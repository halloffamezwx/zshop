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
    }
};
