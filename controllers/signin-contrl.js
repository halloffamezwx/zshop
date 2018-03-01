//登录ctrl
const userService = require('../service/user-service');
const APIError = require('../middleware/rest').APIError;
const indexContrl = require('../controllers/index-contrl');

module.exports = {
    'POST /api/signin': async (ctx, next) => {
        //console.log(JSON.stringify(ctx.request.body));
        var
            mobile = ctx.request.body.mobile || '',
            password = ctx.request.body.password || '',
            userIn = new Object();
        userIn.mobile = mobile;
        userIn.passwd = password;

        var user = await userService.getOneUser(userIn); 
        if (user) {
            var userTemp = new Object();
            userTemp.name = user.name;
            userTemp.userId = user.userId;
            userTemp.headImage = user.headImage;
            ctx.session.user = userTemp;
            ctx.rest({user: userTemp});
        } else {
            throw new APIError('login:error_mobile_passwd', '手机号或密码错误');
        }
    },
    
    'GET /signout': async (ctx, next) => {
        ctx.session.user = null;
        //return await indexContrl['GET /'](ctx, next);
        ctx.response.redirect('/zshop/');
    },

    'GET /login': async (ctx, next) => {
        ctx.render('login.html', {loginSuccUrl: ctx.query.loginSuccUrl});
    },

    'POST /userapi/getLoginUserInfo': async (ctx, next) => {
        ctx.rest(ctx.session.user);
    }
};
