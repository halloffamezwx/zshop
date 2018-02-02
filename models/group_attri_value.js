const db = require('../middleware/db');
//分组产品属性值实体
module.exports = db.defineModel('group_attri_value', {
    id: {
        type: db.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    groupAttriId: db.INTEGER, //group_attri表的id
    attriValue: db.STRING(200) //属性value
});
