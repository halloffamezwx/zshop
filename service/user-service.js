//用户service
const model = require('../middleware/model');
const APIError = require('../middleware/rest').APIError;

let user = model.user;

module.exports = {
    //查询一个用户
    getOneUser: async (userCon) => {
        var quser = await user.findOne({
            where: {
                mobile: userCon.mobile,
                passwd: userCon.passwd
            }
        });
        return quser;
    },

    countUser: async (userCon) => {
        let whereObj = new Object();
        if (userCon.mobile) {
            whereObj.mobile = userCon.mobile;
        }
        return await user.count({where: whereObj});
    },

    regist: async (mobile, password) => {
        let countInt = await user.count({where: {mobile: mobile}});
        if (countInt > 0) {
            throw new APIError('regist:repeat_mobile', '该手机号码已存在');
        }
        let cuser = await user.create({
            mobile: mobile,
            userId: mobile,
            passwd: password,
            name: '墨菲',
            headImage: '/static/images/head/bear.jpg'
        });
        return cuser;
    }
};
