//登录ctrl
const userService = require('../service/user-service');
const orderService = require('../service/order-service');
const APIError = require('../middleware/rest').APIError;
const indexContrl = require('../controllers/index-contrl');
let captchapng = null;
const fs = require('fs');
const openCaptcha = process.env.OPEN_CAPTCHA === 'true';
console.log(`openCaptcha = [${openCaptcha}]`);
if (openCaptcha) {
    captchapng = require('captchapng');
}

module.exports = {
    'POST /api/signin': async (ctx, next) => {
        //console.log(JSON.stringify(ctx.request.body));
        let
            mobile = ctx.request.body.mobile || '',
            password = ctx.request.body.password || '',
            captcha = ctx.request.body.captcha || '',
            sessionCaptcha = ctx.session.sessionCaptcha,
            userIn = new Object();
        userIn.mobile = mobile;
        userIn.passwd = password;
        console.log("sessionCaptcha=" + sessionCaptcha);

        if ( openCaptcha && (!sessionCaptcha || sessionCaptcha != captcha) ) {
            throw new APIError('login:error_captcha', '验证码错误');
        }

        ctx.session.sessionCaptcha = null;
        var user = await userService.getOneUser(userIn); 
        if (user) {
            var userTemp = new Object();
            userTemp.id = user.id;
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
        ctx.render('login.html', {loginSuccUrl: ctx.query.loginSuccUrl, openCaptcha: openCaptcha});
    },

    'GET /resetPass': async (ctx, next) => {
        ctx.render('reset-pass.html', {mobile: ctx.query.mobile});
    },

    'GET /registPage': async (ctx, next) => {
        ctx.render('register.html');
    },

    'POST /api/regist': async (ctx, next) => {
        /* let file = ctx.request.body.files.file1; // 获取上传文件
        let reader = fs.createReadStream(file.path); // 创建可读流
        let ext = file.name.split('.').pop(); // 获取上传文件扩展名
        let upStream = fs.createWriteStream(`static/images/head/${Math.random().toString()}.${ext}`); // 创建可写流
        reader.pipe(upStream); // 可读流通过管道写入可写流 */

        let mobile = ctx.request.body.mobile || '';
        let password = ctx.request.body.password || '';
        let passwordConfirm = ctx.request.body.passwordConfirm || '';

        if (mobile.trim() == '' || password.trim() == '' || passwordConfirm.trim() == '') {
            throw new APIError('regist:error_input', '手机号，密码和确认密码必传');
        }
        if (password != passwordConfirm) {
            throw new APIError('regist:error_input', '密码和确认密码不一致');
        }

        let cuser = await userService.regist(mobile, password);
        ctx.session.user = cuser;
        ctx.rest({});
    },

    'POST /api/countUserMobile': async (ctx, next) => {
        let mobile = ctx.request.body.mobile || '';
        if (mobile.trim() == '') {
            throw new APIError('regist:error_input', '手机号必传');
        }
        let countInt = await userService.countUser({mobile: mobile});
        ctx.rest({countInt: countInt});
    },

    'POST /userapi/getLoginUserInfo': async (ctx, next) => {
        let orderCount = await orderService.countOrder("1111", ctx.session.user.userId);
        let user = await userService.getOneUser({userId: ctx.session.user.userId});

        var userTemp = new Object();
        userTemp.name = user.name;
        userTemp.userId = user.userId;
        userTemp.headImage = user.headImage;

        ctx.rest({user: userTemp, orderCount: orderCount});
    },

    'POST /api/checkCaptcha': async (ctx, next) => {
        let captcha = ctx.request.body.captcha || '',
            sessionCaptcha = ctx.session.sessionCaptcha;
        console.log("checkCaptcha-sessionCaptcha=" + sessionCaptcha);

        if ( openCaptcha && (!sessionCaptcha || sessionCaptcha != captcha) ) {
            throw new APIError('login:error_captcha', '验证码错误');
        }

        ctx.rest({});
    },

    'GET /captcha': async (ctx, next) => {
        //const captchapng = require('captchapng');

        var numeric = parseInt(Math.random()*9000+1000);
        console.log("captcha=" + numeric);
        ctx.session.sessionCaptcha = numeric;

        var p = new captchapng(110,45,numeric); // width,height,numeric captcha
        p.color(248, 248, 248, 255);  // First color: background (red, green, blue, alpha)
        p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

        var img = p.getBase64();
        var imgbase64 = new Buffer(img,'base64');
        ctx.response.type = "image/png";
        ctx.response.body = imgbase64;
    }
};
