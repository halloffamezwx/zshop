//收藏ctrl
const collectionService = require('../service/collection-service');
const APIError = require('../middleware/rest').APIError;

module.exports = {
    'GET /user/collection/index': async (ctx, next) => {
        var collections = await collectionService.getCollection(ctx.session.user.userId); 
        ctx.render('collection.html', {collections: collections});
    },

    'POST /userapi/collection/act': async (ctx, next) => {
        var id = ctx.request.body.id || '';
        var pid = ctx.request.body.pid || '';
        var userId = ctx.session.user.userId;
        var id = await collectionService.collection(id, userId, pid); 
        ctx.rest({id: id});
    },

    'GET /user/collection/del/:id': async (ctx, next) => {
        var id = ctx.params.id || '';
        if (!id || id.trim() == '') {
            throw new APIError('collection:empty_id', 'id不能为空');
        }
        await collectionService.collection(id);
        ctx.response.redirect('/zshop/user/collection/index'); 
    }
};
