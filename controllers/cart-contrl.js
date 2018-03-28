//购物车ctrl
const cartService = require('../service/cart-service');
const APIError = require('../middleware/rest').APIError;

module.exports = {
    'GET /user/cart': async (ctx, next) => {
        var userCartProds = await cartService.getUserCartProd(ctx.session.user); 
        
        ctx.render('cart.html', userCartProds);
    },

    'POST /userapi/delCartProd': async (ctx, next) => {
        //console.log(JSON.stringify(ctx.request.body));
        var cid = ctx.request.body.cid || '';
        await cartService.deleteCardProd(cid); 
        //ctx.rest();
        ctx.rest({code: 'system:success', message: '成功'});
    },

    'POST /userapi/chgCartProdCount': async (ctx, next) => {
        var cid = ctx.request.body.cid || '';
        var newValue = ctx.request.body.newValue || '';
        await cartService.updateCardProdCount(cid, newValue); 
        ctx.rest();
    },

    'POST /userapi/addCartProd': async (ctx, next) => {
        var pid = ctx.request.body.pid || '';
        var pcount = ctx.request.body.pcount || '1';
        if (!pid || pid.trim() == '') {
            throw new APIError('cart:empty_pid', '商品ID不能为空');
        }
        let cartSize = await cartService.addCartProd(pid, pcount, ctx.session.user.userId); 
        ctx.rest({cartSize: cartSize});
    }
};
