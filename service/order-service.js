//订单service
const model = require('../middleware/model');
const productService = require('./product-service');
const uuid = require('node-uuid');
const APIError = require('../middleware/rest').APIError;

let order = model.order;
let orderProd = model.order_prod;
let product = model.product;
let cart = model.cart;
let userAddress = model.user_address;
let sequelize = model.sequelize;

module.exports = {
    //结算
    settlementAct: async (ctx, cartIds, userIdIn) => {
        ctx.transaction = await sequelize.transaction();

        let cartIdArr = cartIds.split(",");
        let genOrderId = uuid.v4();
        let prodPrice = 0.00;
        let deliveryFee = 10.00;

        for (let i = 0; i < cartIdArr.length; i++) {
            let qCart = await cart.findOne( {where: {id: parseInt(cartIdArr[i]), userId: userIdIn}} );
            await sequelize.query('UPDATE product SET stock = stock - :count, updatedAt = now(), version = version + 1 WHERE id = :id', 
                                 { replacements: { count: qCart.count, id: qCart.prodId }, transaction: ctx.transaction });

            let qProduct = await product.findById(qCart.prodId, { transaction: ctx.transaction });
            if (qProduct.stock < 0) {
                let realStock = qProduct.stock + qCart.count;
                throw new APIError('settlement:lack_stock', qProduct.name + '不够库存了，只剩下' + realStock + '件');
            }
            prodPrice += qProduct.price * qCart.count;

            await orderProd.create({
                orderId: genOrderId, 
                prodId: qProduct.id, 
                price: qProduct.price, 
                count: qCart.count,
                cartId: qCart.id 
            }, { transaction: ctx.transaction });
        }

        let qUserAddress = await userAddress.findOne( {where: {type: 1, userId: userIdIn}} );
        if (!qUserAddress) {
            qUserAddress = new Object();
        }
        await order.create({
            id: genOrderId,
            userId: userIdIn, 
            province: qUserAddress.province || '', 
            city: qUserAddress.city || '', 
            area: qUserAddress.area || '', 
            address: qUserAddress.address || '',
            recipient: qUserAddress.name || '请选择一个收件地址',
            recipientPhone: qUserAddress.phone || '',
            deliveryFee: deliveryFee,
            prodPrice: prodPrice,
            totalPrice: prodPrice + deliveryFee,
            expressCompany: '', 
            expressNumber: ''
        }, { transaction: ctx.transaction });

        let taskTimeOutId = setTimeout(async function() { 
            let timeTransaction;
            try {
                timeTransaction = await sequelize.transaction();
                let delSize = await order.destroy({where: {id: genOrderId, status: 1}, transaction: timeTransaction});

                if (delSize == 1) {
                    let orderProds = await orderProd.findAll({where: {orderId: genOrderId}});
                    for (let i = 0; i < orderProds.length; i++) {
                        await sequelize.query('UPDATE product SET stock = stock + :count, updatedAt = now(), version = version + 1 WHERE id = :id', 
                                            { replacements: { count: orderProds[i].count, id: orderProds[i].prodId }, transaction: timeTransaction });
                    }
                    await orderProd.destroy({where: {orderId: genOrderId}, transaction: timeTransaction});
                }
                timeTransaction.commit();
            } catch (e) {
                console.log(e.stack);
                if (timeTransaction) timeTransaction.rollback();
            }
        }, 10 * 60 * 1000); //10分钟的确认支付订单的有效时间
        ctx.taskTimeOutId = taskTimeOutId;
        
        return genOrderId;
    },

    //订单信息
    orderDetail: async (orderId, userIdIn) => {
        let result = new Object();

        let qOrder = await order.findOne( {where: {id: orderId, userId: userIdIn}} );
        if (qOrder.deliveryType == 1) {
            qOrder.deliveryTypeName = "快递";
        }
        let opArr = await orderProd.findAll({where: {orderId: orderId}});

        for (let i = 0; i < opArr.length; i++) {
            let attriValueStr = await productService.getProdAttriValueStr(opArr[i].prodId);
            let qProduct = await product.findById(opArr[i].prodId);
            opArr[i].attriValueStr = attriValueStr;
            opArr[i].image = qProduct.image;
            opArr[i].name = qProduct.name;
        }

        result.order = qOrder;
        result.opArr = opArr;
        
        return result;
    }
};
