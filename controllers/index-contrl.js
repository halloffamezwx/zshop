//首页ctrl
const productService = require('../service/product-service');
const adService = require('../service/ad-service');
const APIError = require('../middleware/rest').APIError;

module.exports = {
    //首页
    'GET /': async (ctx, next) => {
        ctx.logger.info('===index in===');
        var products = await productService.getRecomProduct(1); //精品推荐
        var headAds = await adService.getAdByPosition(1); //头部广告
        var midAds = await adService.getAdByPosition(2); //中部广告
        
        console.log('===index mid===');
        ctx.render('index.html', { 
            prods: products, 
            hAds: headAds, 
            mAdImg: midAds[0].image,
            user: ctx.session.user
        });
        ctx.logger.info('===index out===');
    },

    //商品搜索
    'GET /api/search/:key/:limit/:offset/:ordertype': async (ctx, next) => {
        var skey = ctx.params.key;
        if (!skey || skey.trim() == '') {
            throw new APIError('sproduct:empty_key', '搜索关键字不能为空');
        }
        var products = await productService.searchProduct(skey, ctx.params.limit, ctx.params.offset, ctx.params.ordertype);
        ctx.rest({
            prods: products
        });
    }
};
