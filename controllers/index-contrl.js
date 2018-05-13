//首页ctrl
const productService = require('../service/product-service');
const adService = require('../service/ad-service');
const orderService = require('../service/order-service');
const userService = require('../service/user-service');
const APIError = require('../middleware/rest').APIError;
const fs = require('mz/fs');
const uuid = require('node-uuid');

module.exports = {
    //首页
    'GET /': async (ctx, next) => {
        ctx.logger.info('===index in===');
        var products = await productService.getRecomProduct(1); //精品推荐
        var headAds = await adService.getAdByPosition(1); //头部广告
        var midAds = await adService.getAdByPosition(2); //中部广告
        //let userId = null;
        //if (ctx.session.user) userId = ctx.session.user.userId;
        //let orderCount = await orderService.countOrder("1111", userId);
        
        console.log('===index mid===');
        ctx.render('index.html', { 
            prods: products, 
            hAds: headAds, 
            mAdImg: midAds[0].image,
            user: ctx.session.user
            //orderCount: orderCount
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
    },

    'GET /user/userPage': async (ctx, next) => { 
        let user = await userService.getOneUser({userId: ctx.session.user.userId});
        ctx.render('user.html', {
            userId: user.userId,
            name: user.name,
            email: user.email,
            headImage: user.headImage
        });
    },

    'POST /userapi/checkUserInfo': async (ctx, next) => {
        let email = ctx.request.body.email || '';
        let userId = ctx.request.body.userId || '';

        let result = await userService.checkUserInfo(email, userId, ctx.session.user.id);

        ctx.rest(result);
    },

    'POST /userapi/uptUserInfo': async (ctx, next) => {
        let noImage = ctx.query.noImage;
        let user = await userService.getOneUser({userId: ctx.session.user.userId});

        let name = null;
        let userId = null;
        let email = null;
        if (noImage) {
            name = ctx.request.body.name || '';
            userId = ctx.request.body.userId || '';
            email = ctx.request.body.email || '';
        } else {
            name = ctx.request.body.fields.name || '';
            userId = ctx.request.body.fields.userId || '';
            email = ctx.request.body.fields.email || '';
        }

        let userValue = new Object();
        if (name != user.name) {
            userValue.name = name;
        }
        if (userId != user.userId) {
            if (await userService.countUser({userId: userId}) >= 1) {
                throw new APIError('uptUserInfo:repeat_userId', '该用户ID已被占用');
            }
            userValue.userId = userId;
        } 
        if (email.trim() != '' && email != user.email) {
            if (await userService.countUser({email: email}) >= 1) {
                throw new APIError('uptUserInfo:repeat_email', '该电子邮箱已被占用');
            }
            userValue.email = email;
        } 

        if (!noImage) {
            let file = ctx.request.body.files.uploaderInput; // 获取上传文件
            let reader = fs.createReadStream(file.path); // 创建可读流
            let ext = file.name.split('.').pop(); // 获取上传文件扩展名
            let filePath = `static/images/head/${uuid.v4().replace(/-/g, "")}.${ext}`;
            let upStream = fs.createWriteStream(filePath); // 创建可写流
            reader.pipe(upStream); // 可读流通过管道写入可写流 

            userValue.headImage = '/' + filePath;
        }

        await userService.uptUser({id: user.id, version: user.version}, userValue);

        if (userValue.name) {
            ctx.session.user.name = userValue.name;
        }
        if (userValue.userId) {
            ctx.session.user.userId = userValue.userId;
        }
        if (userValue.email) {
            ctx.session.user.email = userValue.email;
        }
        if (userValue.headImage) {
            ctx.session.user.headImage = userValue.headImage;
        }

        if (!noImage && user.headImage.indexOf("bear.jpg") == -1) {
            let delFilePath = user.headImage.substr(1, user.headImage.length - 1);
            fs.unlink(delFilePath, function (err) {
                if(err) {
                    console.log(user.headImage + '删除失败：' + err);
                }
            })
        }

        ctx.rest({});
    },

    'GET /user/uptPassPage': async (ctx, next) => { 
        ctx.render('upt-pass.html');
    },

    'POST /userapi/checkPassword': async (ctx, next) => {
        let oldPassword = ctx.request.body.oldPassword || '';
        let user = await userService.getOneUser({userId: ctx.session.user.userId});

        if ( oldPassword != user.passwd ) {
            throw new APIError('index:error_password', '原的密码错误');
        }

        ctx.rest({});
    },

    'POST /userapi/uptPass': async (ctx, next) => {
        let oldPassword = ctx.request.body.oldPassword || '';
        let password = ctx.request.body.password || '';
        //let passwordConfirm = ctx.request.body.passwordConfirm || '';
        let user = await userService.getOneUser({userId: ctx.session.user.userId});

        if ( oldPassword != user.passwd ) {
            throw new APIError('index:error_password', '原的密码错误');
        }

        let userValue = new Object();
        await userService.uptUser({id: user.id, version: user.version}, {passwd: password});

        ctx.rest({});
    }
};
