module.exports = {
    APIError: function (code, message) {
        this.code = code || 'internal:unknown_error';
        this.message = message || '';
    },
    restify: (pathPrefix) => {
        var loginPathPrefix = pathPrefix || '/zshop/userapi/';
        pathPrefix = pathPrefix || '/zshop/api/';
        return async (ctx, next) => {
            if (ctx.request.path.startsWith(pathPrefix) || ctx.request.path.startsWith(loginPathPrefix)) {
                console.log(`Process API ${ctx.request.method} ${ctx.request.url}...`);
                ctx.rest = (data) => {
                    ctx.response.type = 'application/json';
                    ctx.response.body = data;
                }
                try {
                    if (ctx.request.path.startsWith(loginPathPrefix) && !ctx.session.user) {
                        ctx.response.status = 400;
                        ctx.response.type = 'application/json';
                        ctx.response.body = {
                            code: 'login:must_login',
                            message: '请先登录'
                        };
                    } else {
                        await next();
                    }
                } catch (e) {
                    console.log('Process API error...' + e.stack);
                    ctx.response.status = 400;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code: e.code || 'internal:unknown_error',
                        message: e.message || ''
                    };
                }
            } else if (ctx.request.path.startsWith('/zshop/user/')) {
                if (ctx.session.user) {
                    await next();
                } else {
                    ctx.response.redirect('/zshop/login');
                    //ctx.render('login.html');
                }
            } else {
                await next();
            }
        };
    }
};
