const db = require('../middleware/db');
//用户地址实体
module.exports = db.defineModel('user_address', {
    userId: db.STRING(30), //用户id
    province: db.STRING(20), //配送省
    city: db.STRING(20), //配送市
    area: db.STRING(20), //配送地区
    address: db.STRING(100), //配送详细地址
    name: db.STRING(20), //收件人
    phone: db.STRING(30), //收件人电话号码
    type: db.INTEGER //1-默认地址
});