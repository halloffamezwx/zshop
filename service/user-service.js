//用户service
const model = require('../middleware/model');

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

    regist: async (mobile, password) => {
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
