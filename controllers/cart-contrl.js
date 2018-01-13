//购物车ctrl
const cartService = require('../service/cart-service');

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
    }
};
