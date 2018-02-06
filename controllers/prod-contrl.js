//产品ctrl
const productService = require('../service/product-service');
const cartService = require('../service/cart-service');
const collectionService = require('../service/collection-service');

module.exports = {
    //商品详情
    'GET /prodDetail/:pid': async (ctx, next) => {
        var product = await productService.prodDetail(ctx.params.pid);
        var cardProdNum = 0;
        var collection;
        if (ctx.session.user) {
            cardProdNum = await cartService.getCardProdNum(ctx.session.user.userId);
            collection = await collectionService.getOneCollection(ctx.session.user.userId, product.id);
        }
        
        ctx.render('prod-detail.html', {product: product, cardProdNum: cardProdNum, collection: collection});
    }
};
