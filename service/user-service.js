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
    }
};
