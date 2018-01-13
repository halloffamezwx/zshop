//购物车ctrl
const cartService = require('../service/cart-service');

module.exports = {
    'GET /user/cart': async (ctx, next) => {
        var userCartProds = await cartService.getUserCartProd(ctx.session.user); 
        
        ctx.render('cart.html', { 
            userCartProds: userCartProds
        });
    }
};
