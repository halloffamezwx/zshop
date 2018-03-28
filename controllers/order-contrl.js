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
        if (result.status == 'success') {
            ctx.render('settlement.html', result);
        } else {
            ctx.render('msg.html', result);
        }
    },

    //订单详情页
    'GET /user/orderDetail/:orderId': async (ctx, next) => {
        let orderId = ctx.params.orderId;
        let userId = ctx.session.user.userId;
        if (!orderId || orderId.trim() == '') {
            throw 'orderId不能为空';
        }

        let result = await orderService.orderDetail(orderId, userId);
        if (result.status == 'success') {
            ctx.render('order-detail.html', result);
        } else {
            ctx.render('msg.html', result);
        }
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

    //立即购买
    'POST /userapi/buyNow': async (ctx, next) => {
        let pid = ctx.request.body.pid;
        let pcount = ctx.request.body.pcount;
        let userId = ctx.session.user.userId;
        if (!pid || pid.trim() == '') {
            throw new APIError('settlement:empty_pid', 'pid不能为空');
        }
        if (!pcount || pcount.trim() == '' || parseInt(pcount) <= 0) {
            throw new APIError('settlement:invalid_pcount', '无效的pcount');
        }

        let orderId = await orderService.buyNow(ctx, pid, pcount, userId);
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
