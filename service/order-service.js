//订单service
const model = require('../middleware/model');
const productService = require('./product-service');
const uuid = require('node-uuid');
let order = model.order;
let orderProd = model.order_prod;
let product = model.product;
let cart = model.cart;
let userAddress = model.user_address;

module.exports = {
    //结算
    settlementAct: async (cartIds, userIdIn) => {
        let cartIdArr = cartIds.split(",");
        let genOrderId = uuid.v4();
        let prodPrice = 0.00;
        let deliveryFee = 10.00;

        for (let i = 0; i < cartIdArr.length; i++) {
            let qCart = await cart.findOne( {where: {id: parseInt(cartIdArr[i]), userId: userIdIn}} );
            let qProduct = await product.findById(qCart.prodId);
            prodPrice += qProduct.price * qCart.count;

            await orderProd.create({
                orderId: genOrderId, 
                prodId: qProduct.id, 
                price: qProduct.price, 
                count: qCart.count,
                cartId: qCart.id 
            });
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
        });
        
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
