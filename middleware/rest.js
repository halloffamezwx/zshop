module.exports = {
    APIError: function (code, message) {
        this.code = code || 'internal:unknown_error';
        this.message = message || '';
    },
    restify: (pathPrefix) => {
        var loginPathPrefix = pathPrefix || '/zshop/userapi/';
        pathPrefix = pathPrefix || '/zshop/api/';

        return async (ctx, next) => {
            var isRest = false;
            if (ctx.request.path.startsWith(pathPrefix) || ctx.request.path.startsWith(loginPathPrefix)) {
                console.log(`Process API ${ctx.request.method} ${ctx.request.url}...`);
                isRest = true;
                ctx.rest = (data, httpCode) => {
                    ctx.response.type = 'application/json';
                    ctx.response.body = data;
                    if (httpCode) {
                        ctx.response.status = httpCode;
                    }
                }

                if (ctx.request.path.startsWith(loginPathPrefix) && !ctx.session.user) {
                    ctx.rest({code: 'login:must_login', message: '请先登录'}, 400);
                    return;
                }
            } else if (ctx.request.path.startsWith('/zshop/user/')) {
                if ( !ctx.session.user ) {
                    ctx.response.redirect('/zshop/login');
                    //ctx.render('login.html');
                    return;
                }
            } 

            try {
                await next();
            } catch (e) {
                console.log('Process API error...' + e.stack);
                if (isRest) {
                    ctx.rest({code: e.code || 'internal:unknown_error', message: e.message || ''}, 400);
                } else {
                    throw e;
                }
            }
        };
    }
};
