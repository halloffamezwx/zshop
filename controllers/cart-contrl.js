//购物车ctrl
module.exports = {
    'GET /user/cart': async (ctx, next) => {
        ctx.render('cart.html');
    }
};
