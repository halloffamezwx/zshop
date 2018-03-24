//订单ctrl
const orderService = require('../service/order-service');
const APIError = require('../middleware/rest').APIError;

module.exports = {
    //结算页
    'GET /user/settlement/:orderId': async (ctx, next) => {
        //let orderId = ctx.query.orderId; //这种是?key=value的形式
        let orderId = ctx.params.orderId;
        let userId = ctx.session.user.userId;
        if (!orderId || orderId.trim() == '') {
            throw 'orderId不能为空';
        }

        let result = await orderService.orderDetail(orderId, userId);
        ctx.render('settlement.html', result);
    },

    //结算
    'POST /userapi/settlementAct': async (ctx, next) => {
        let cartIds = ctx.request.body.cartIds;
        let userId = ctx.session.user.userId;
        if (!cartIds || cartIds.trim() == '') {
            throw new APIError('settlement:empty_cartIds', 'cartIds不能为空');
        }

        let orderId = await orderService.settlementAct(ctx, cartIds, userId);
        ctx.rest({orderId: orderId});
    },

    //确认订单
    'POST /userapi/confirmOrder': async (ctx, next) => {
        let orderId = ctx.request.body.orderId;
        let userId = ctx.session.user.userId;
        if (!orderId || orderId.trim() == '') {
            throw new APIError('settlement:empty_orderId', 'orderId不能为空');
        }

        let result = await orderService.confirmOrder(ctx, orderId, userId);
        ctx.rest(result);
    },

    //支付订单
    'POST /userapi/payOrder': async (ctx, next) => {
        let orderId = ctx.request.body.orderId;
        let totalPrice = ctx.request.body.totalPrice;
        let userId = ctx.session.user.userId;
        if (!orderId || orderId.trim() == '') {
            throw new APIError('settlement:empty_orderId', 'orderId不能为空');
        }
        if (!totalPrice || totalPrice.trim() == '') {
            throw new APIError('settlement:empty_totalPrice', 'totalPrice不能为空');
        }

        let result = await orderService.payOrder(ctx, orderId, totalPrice, userId);
        ctx.rest(result);
    },

    //支付成功页
    'GET /user/paySuccess/:orderId': async (ctx, next) => {
        let orderId = ctx.params.orderId;
        //let userId = ctx.session.user.userId;
        if (!orderId || orderId.trim() == '') {
            throw 'orderId不能为空';
        }
        
        ctx.render('pay-success.html', {orderId: orderId});
    }
};
