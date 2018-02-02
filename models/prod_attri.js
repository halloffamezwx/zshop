const db = require('../middleware/db');
//产品属性实体
module.exports = db.defineModel('prod_attri', {
    prodId: db.INTEGER, //product表的id
    groupAttriValueId: db.INTEGER //group_attri_value的id
});
