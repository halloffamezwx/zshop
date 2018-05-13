//用户service
const model = require('../middleware/model');
const APIError = require('../middleware/rest').APIError;

let user = model.user;

module.exports = {
    //查询一个用户
    getOneUser: async (userCon) => {
        let whereObj = new Object();
        if (userCon.mobile) {
            whereObj.mobile = userCon.mobile;
        }
        if (userCon.passwd) {
            whereObj.passwd = userCon.passwd;
        }
        if (userCon.userId) {
            whereObj.userId = userCon.userId;
        }
        let quser = await user.findOne({where: whereObj});
        //let quser = await user.findById(userCon.id);
        //let quser = await user.findByPrimary(userCon.id);
        return quser;
    },

    countUser: async (userCon) => {
        let whereObj = new Object();
        if (userCon.mobile) {
            whereObj.mobile = userCon.mobile;
        }
        if (userCon.userId) {
            whereObj.userId = userCon.userId;
        }
        if (userCon.email) {
            whereObj.email = userCon.email;
        }
        return await user.count({where: whereObj});
    },

    regist: async (mobile, password) => {
        let countInt = await user.count({where: {mobile: mobile}});
        if (countInt > 0) {
            throw new APIError('regist:repeat_mobile', '该手机号码已被占用');
        }
        let cuser = await user.create({
            mobile: mobile,
            userId: mobile,
            passwd: password,
            name: '墨菲',
            headImage: '/static/images/head/bear.jpg'
        });
        return cuser;
    },

    checkUserInfo: async (email, userId, id) => {
        let result = new Object();
        let whereObj = new Object();

        if (email && email.trim() != '') {
            whereObj.email = email.trim();
        }
        if (userId && userId.trim() != '') {
            whereObj.userId = userId.trim();
        }
        whereObj.id = {$ne: id};

        result.countInt = await user.count({where: whereObj});
        return result;
    },

    uptUser: async (userCon, userValue) => {
        let uptUserInfo = new Object();
        uptUserInfo.updatedAt = Date.now();
        if (userValue.name && userValue.name.trim() != '') {
            uptUserInfo.name = userValue.name;
        }
        if (userValue.userId && userValue.userId.trim() != '') {
            uptUserInfo.userId = userValue.userId;
        }
        if (userValue.email && userValue.email.trim() != '') {
            uptUserInfo.email = userValue.email;
        }
        if (userValue.headImage && userValue.headImage.trim() != '') {
            uptUserInfo.headImage = userValue.headImage;
        }
        if (userValue.passwd && userValue.passwd.trim() != '') {
            uptUserInfo.passwd = userValue.passwd;
        }

        let whereObj = new Object();
        if (userCon.id) {
            whereObj.id = userCon.id;
        }
        if (userCon.version >= 0) {
            whereObj.version = userCon.version;
            uptUserInfo.version = userCon.version + 1;
        }

        let uptRet = await user.update(uptUserInfo, {where: whereObj});
        console.log('uptSize:' + uptRet[0]);
        if (uptRet[0] < 1) {
            throw new APIError('uptUserInfo:update_fail', '请稍后重试');
        }
    }
};
