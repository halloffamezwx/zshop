//购物车ctrl
module.exports = {
    'GET /cart': async (ctx, next) => {
        ctx.render('cart.html');
    }
};
