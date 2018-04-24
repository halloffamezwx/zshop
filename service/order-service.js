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

//定时清除未确认支付的初始化订单
var initOrderTimer = async function (key, genOrderId) { 
    let timeTransaction;
    try {
        timeoutFunMap.delete(key + genOrderId);
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

        let key = "settlementAct";
        ctx.timeoutFun = function () {
            initOrderTimer(key, genOrderId); 
        };
        ctx.timeoutFunTime = 5 * 60 * 1000; //5分钟的确认订单的有效时间
        ctx.timeoutFunKey = key + genOrderId;
        
        return genOrderId;
    },

    //立即购买
    buyNow: async (ctx, pid, pcount, userIdIn) => {
        ctx.transaction = await sequelize.transaction();

        let genOrderId = uuid.v4();
        let prodPrice = 0.00;
        let deliveryFee = 10.00;
        let pidInt = parseInt(pid);
        let pcountInt = parseInt(pcount);

        await sequelize.query('UPDATE product SET stock = stock - :count, updatedAt = now(), version = version + 1 WHERE id = :id', 
                                { replacements: { count: pcountInt, id: pidInt }, transaction: ctx.transaction });

        let qProduct = await product.findById(pidInt, { transaction: ctx.transaction });
        if (qProduct.stock < 0) {
            let realStock = qProduct.stock + pcountInt;
            throw new APIError('settlement:lack_stock', qProduct.name + '不够库存了，只剩下' + realStock + '件');
        }
        prodPrice = qProduct.price * pcountInt;

        await orderProd.create({
            orderId: genOrderId, 
            prodId: qProduct.id, 
            price: qProduct.price, 
            count: pcountInt,
            cartId: 0 
        }, { transaction: ctx.transaction });

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

        let key = "buyNow";
        ctx.timeoutFun =  function () {
            initOrderTimer(key, genOrderId); 
        }; 
        ctx.timeoutFunTime = 5 * 60 * 1000; //5分钟的确认订单的有效时间
        ctx.timeoutFunKey = key + genOrderId;
        
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
        if (qOrder.expressCompany == '') {
            qOrder.expressCompany = "暂无";
        }
        if (qOrder.expressNumber == '') {
            qOrder.expressNumber = "暂无";
        }
        qOrder.createdAtFormat = moment(qOrder.createdAt).format('YYYY-MM-DD HH:mm:ss');

        let orderStatus = qOrder.status;
        if (orderStatus == 1) {
            qOrder.statusName = "初始化";
        } else if (orderStatus == 2) {
            qOrder.statusName = "待付款";
        } else if (orderStatus == 3) {
            qOrder.statusName = "待发货";
        } else if (orderStatus == 4) {
            qOrder.statusName = "待收货";
        } else if (orderStatus == 5) {
            qOrder.statusName = "待评价";          
        }  else if (orderStatus == 6) {
            qOrder.statusName = "已评价";
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
            if (opArr[i].cartId != 0) {
                await cart.destroy({where: {id: opArr[i].cartId, userId: userIdIn}, transaction: ctx.transaction});
            }
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

    //确认收货
    confirmReceipt: async (ctx, orderId, userIdIn) => {
        let result = new Object();
        
        let uptRet = await sequelize.query('UPDATE `order` SET status = 5, updatedAt = now(), version = version + 1 ' + 
                                           'WHERE id = :id AND userId = :userId AND status = 4',
                              { replacements: { id: orderId, userId: userIdIn } });
        if (uptRet[0].affectedRows != 1) {
            throw new APIError('order:invalid_order', '订单不存在或状态不对');
        }
        
        return result;
    },

    //删除订单
    delOrder: async (ctx, orderId, userIdIn) => {
        let result = new Object();
        ctx.transaction = await sequelize.transaction();
        
        let delSize = await order.destroy({where: {id: orderId, userId: userIdIn, status: 6}, transaction: ctx.transaction});
        if (delSize == 1) {
            await orderProd.destroy({where: {orderId: orderId}, transaction: ctx.transaction});
        } else {
            throw new APIError('order:invalid_order', '订单不存在或状态不对');
        }
        
        return result;
    },

    //取消订单
    cancelOrder: async (ctx, orderId, userIdIn) => {
        let result = new Object();
        ctx.transaction = await sequelize.transaction();
        
        let delSize = await order.destroy({
            where: {
                id: orderId, 
                userId: userIdIn, 
                $or: [
                    {status: 1},
                    {status: 2}
                ]
            }, 
            transaction: ctx.transaction
        });
        if (delSize == 1) {
            await orderProd.destroy({where: {orderId: orderId}, transaction: ctx.transaction});
        } else {
            throw new APIError('order:invalid_order', '订单不存在或状态不对');
        }

        let timeoutFunKey = "settlementAct" + orderId;
        clearTimeout(timeoutFunMap.get(timeoutFunKey));
        timeoutFunMap.delete(timeoutFunKey);

        timeoutFunKey = "buyNow" + orderId;
        clearTimeout(timeoutFunMap.get(timeoutFunKey));
        timeoutFunMap.delete(timeoutFunKey);

        timeoutFunKey = "confirmOrder" + orderId;
        clearTimeout(timeoutFunMap.get(timeoutFunKey));
        timeoutFunMap.delete(timeoutFunKey);
        
        return result;
    },

    //支付成功取消订单
    paySuccCancelOrder: async (ctx, orderId, userIdIn) => {
        let result = new Object();
        ctx.transaction = await sequelize.transaction();
        
        let delSize = await order.destroy({
            where: {
                id: orderId, 
                userId: userIdIn, 
                status: 3
            }, 
            transaction: ctx.transaction
        });
        if (delSize == 1) {
            await orderProd.destroy({where: {orderId: orderId}, transaction: ctx.transaction});
        } else {
            throw new APIError('order:invalid_order', '订单不存在或状态不对');
        }
        
        return result;
    },

    //支付订单
    payOrder: async (ctx, orderId, totalPrice, userIdIn) => {
        let result = new Object();

        try {
            console.log('sleep start');
            let result = await commonUtil.sleep(1000); 
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
    },

    //订单列表
    getOrderList: async (limit, offset, userIdIn, status) => {
        let whereObj = new Object();
        whereObj.userId = userIdIn;

        let statusInt = parseInt(status);
        if (statusInt == 0) { //查询全部
            whereObj.status = {$ne: 1}
        } else {
            whereObj.status = statusInt;
        }
        let limitInt = parseInt(limit);
        if (limitInt > 50) {
            limitInt = 50;
        }

        let orders = await order.findAll({
            where: whereObj,
            limit: limitInt,
            offset: parseInt(offset),
            order: "createdAt DESC"
        });
        let orderArray = new Array();

        for (let i = 0; i < orders.length; i++) {
            let orderObj = new Object();

            let orderProds =  await sequelize.query('SELECT p.id, p.`name`, p.price, p.image, op.count ' 
                                                  + 'FROM order_prod op '
                                                  + 'LEFT JOIN product p ON op.prodId = p.id '
                                                  + 'WHERE op.orderId = :orderId',
                                    {replacements: {orderId: orders[i].id}, type: sequelize.QueryTypes.SELECT});
            for (let j = 0; j < orderProds.length; j++) {
                let attriValueStr = await productService.getProdAttriValueStr(orderProds[j].id);
                orderProds[j].attriValueStr = attriValueStr;
            }
            orderObj.orderProds = orderProds;
            orderObj.id = orders[i].id;
            orderObj.status = orders[i].status;
            orderObj.deliveryFee = orders[i].deliveryFee;
            orderObj.totalPrice = orders[i].totalPrice;
            orderObj.prodSize = orderProds.length;

            let orderStatus = orders[i].status;
            if (orderStatus == 1) {
                orderObj.statusName = "初始化";
            } else if (orderStatus == 2) {
                orderObj.statusName = "待付款";
            } else if (orderStatus == 3) {
                orderObj.statusName = "待发货";
            } else if (orderStatus == 4) {
                orderObj.statusName = "待收货";
            } else if (orderStatus == 5) {
                orderObj.statusName = "待评价";          
            }  else if (orderStatus == 6) {
                orderObj.statusName = "已评价";
            }
            orderObj.createdAtFormat = moment(orders[i].createdAt).format('YYYY-MM-DD HH:mm:ss');

            orderArray.push(orderObj);
        }
        
        return orderArray;
    },

    countOrder: async (conStr, userIdIn) => {
        let result = new Object();
        result.paySize = 0;
        result.sendSize = 0;
        result.recvieSize = 0;
        result.evalSize = 0;

        if (!userIdIn) return result;
        if (!conStr || conStr.length != 4) conStr = "1111";

        if (conStr.charAt(0) == '1') {
            result.paySize = await order.count({where: {status: 2, userId: userIdIn}}); //待付款
        }
        if (conStr.charAt(1) == '1') {
            result.sendSize = await order.count({where: {status: 3, userId: userIdIn}}); //待发货
        }
        if (conStr.charAt(2) == '1') {
            result.recvieSize = await order.count({where: {status: 4, userId: userIdIn}}); //待收货
        }
        if (conStr.charAt(3) == '1') {
            result.evalSize = await order.count({where: {status: 5, userId: userIdIn}}); //待评价
        }
        
        return result;
    }
};
