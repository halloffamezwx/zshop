//登录ctrl
const userService = require('../service/user-service');
const APIError = require('../middleware/rest').APIError;

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
            ctx.rest({user: user});
        } else {
            throw new APIError('login:error_mobile_passwd', '手机号或密码错误');
        }
    },
    
    'GET /signout': async (ctx, next) => {
        ctx.render('login.html');
    }
};
