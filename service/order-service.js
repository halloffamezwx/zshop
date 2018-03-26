//订单service
const model = require('../middleware/model');
const productService = require('./product-service');
const uuid = require('node-uuid');
const APIError = require('../middleware/rest').APIError;
const timeoutFunMap = require('../middleware/rest').timeoutFunMap;
const commonUtil = require('../utils/common');
const moment = require('moment');

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

        ctx.timeoutFun = async function() { 
            let timeTransaction;
            try {
                timeoutFunMap.delete('settlementAct' + genOrderId);
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
        };
        ctx.timeoutFunTime = 5 * 60 * 1000; //5分钟的确认订单的有效时间
        ctx.timeoutFunKey = 'settlementAct' + genOrderId;
        
        return genOrderId;
    },

    //订单信息
    orderDetail: async (orderId, userIdIn) => {
        let result = new Object();
        result.status = 'success';

        let qOrder = await order.findOne( {where: {id: orderId, userId: userIdIn}} );
        if (!qOrder) {
            //throw "订单不存在";
            result.status = 'fail';
            result.msg = "订单不存在";
            return result;
        }
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
    },

    //确认订单
    confirmOrder: async (ctx, orderId, userIdIn) => {
        let result = new Object();

        let qOrder = await order.findOne( {where: {id: orderId, userId: userIdIn}} );
        if (qOrder) {
            if (qOrder.status == 2) {
                let momentPayStartTime = moment(qOrder.payStartTime);
                result.payStartTime = momentPayStartTime.utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
                result.payEndTime = momentPayStartTime.add(30, 'minute').utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
                result.totalPrice = qOrder.totalPrice;
                return result;
            }
            if (qOrder.status != 1) {
                throw new APIError('settlement:invalid_order', '订单状态不正确');
            }
        } else {
            throw new APIError('settlement:invalid_order', '订单不存在或已失效'); 
        }
        ctx.transaction = await sequelize.transaction();

        let date = new Date();
        let momentDate = moment(date);
        result.payStartTime = momentDate.utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
        result.payEndTime = momentDate.add(30, 'minute').utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
        result.totalPrice = qOrder.totalPrice;
        
        let uptRet = await sequelize.query('UPDATE `order` SET status = 2, payStartTime = :payStartTime, updatedAt = now(), version = version + 1 ' + 
                                           'WHERE id = :id AND userId = :userId AND status = 1 AND version = :version',
                              { replacements: { id: orderId, userId: userIdIn, version: qOrder.version, payStartTime: date }, transaction: ctx.transaction });
        if (uptRet[0].affectedRows != 1) {
            throw new APIError('settlement:invalid_order', '订单不存在或已失效');
        }
        let opArr = await orderProd.findAll({where: {orderId: orderId}});
        for (let i = 0; i < opArr.length; i++) {
            await cart.destroy({where: {id: opArr[i].cartId, userId: userIdIn}, transaction: ctx.transaction});
        }

        let timeoutFunKey = 'settlementAct' + orderId;
        clearTimeout(timeoutFunMap.get(timeoutFunKey));
        timeoutFunMap.delete(timeoutFunKey);

        ctx.timeoutFun = async function() { 
            let timeTransaction;
            try {
                timeoutFunMap.delete('confirmOrder' + orderId);
                timeTransaction = await sequelize.transaction();
                let delSize = await order.destroy({where: {id: orderId, status: 2}, transaction: timeTransaction});

                if (delSize == 1) {
                    let orderProds = await orderProd.findAll({where: {orderId: orderId}});
                    for (let i = 0; i < orderProds.length; i++) {
                        await sequelize.query('UPDATE product SET stock = stock + :count, updatedAt = now(), version = version + 1 WHERE id = :id', 
                                            { replacements: { count: orderProds[i].count, id: orderProds[i].prodId }, transaction: timeTransaction });
                    }
                    await orderProd.destroy({where: {orderId: orderId}, transaction: timeTransaction});
                }
                timeTransaction.commit();
            } catch (e) {
                console.log(e.stack);
                if (timeTransaction) timeTransaction.rollback();
            }
        };
        ctx.timeoutFunTime = 30 * 60 * 1000; //30分钟的支付订单的有效时间
        ctx.timeoutFunKey = 'confirmOrder' + orderId;
        
        return result;
    },

    //支付订单
    payOrder: async (ctx, orderId, totalPrice, userIdIn) => {
        let result = new Object();

        try {
            console.log('sleep start');
            let result = await commonUtil.sleep(2000); 
            console.log('sleep result:' + result);
            console.log('sleep end');
        } catch (err) {
            console.log('sleep err' + err); 
        }

        let qOrder = await order.findOne( {where: {id: orderId, userId: userIdIn}} );
        if (qOrder) {
            if (qOrder.status != 2) {
                throw new APIError('settlement:invalid_order', '订单状态不正确');
            }
            if (qOrder.totalPrice != totalPrice) {
                throw new APIError('settlement:error_totalPrice', '金额不正确');
            }
        } else {
            throw new APIError('settlement:invalid_order', '订单不存在或已失效'); 
        }
        
        let uptRet = await sequelize.query('UPDATE `order` SET status = 3, updatedAt = now(), version = version + 1 ' + 
                                           'WHERE id = :id AND userId = :userId AND status = 2 AND version = :version',
                              { replacements: { id: orderId, userId: userIdIn, version: qOrder.version } });
        if (uptRet[0].affectedRows != 1) {
            throw new APIError('settlement:invalid_order', '订单不存在或已失效');
        }
        
        let timeoutFunKey = 'confirmOrder' + orderId;
        clearTimeout(timeoutFunMap.get(timeoutFunKey));
        timeoutFunMap.delete(timeoutFunKey);
        
        return result;
    }
};
