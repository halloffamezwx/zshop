//登录ctrl
const userService = require('../service/user-service');
const orderService = require('../service/order-service');
const APIError = require('../middleware/rest').APIError;
const indexContrl = require('../controllers/index-contrl');
//const captchapng = require('captchapng');

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
        let orderCount = await orderService.countOrder("1111", ctx.session.user.userId);
        ctx.rest({user: ctx.session.user, orderCount: orderCount});
    },

    'GET /captcha': async (ctx, next) => {
        var numeric = parseInt(Math.random()*9000+1000);
        //console.log("captcha=" + numeric);
        ctx.session.captcha = numeric;

        var p = new captchapng(110,45,numeric); // width,height,numeric captcha
        p.color(248, 248, 248, 255);  // First color: background (red, green, blue, alpha)
        p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

        var img = p.getBase64();
        var imgbase64 = new Buffer(img,'base64');
        ctx.response.type = "image/png";
        ctx.response.body = imgbase64;
    }
};
