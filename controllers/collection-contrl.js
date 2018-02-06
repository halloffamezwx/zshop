//收藏ctrl
const collectionService = require('../service/collection-service');

module.exports = {
    'POST /userapi/collection': async (ctx, next) => {
        var id = ctx.request.body.id || '';
        var pid = ctx.request.body.pid || '';
        var userId = ctx.session.user.userId;
        var id = await collectionService.collection(id, userId, pid); 
        ctx.rest({id: id});
    }
};
