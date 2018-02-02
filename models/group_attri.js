const db = require('../middleware/db');
//分组产品属性实体
module.exports = db.defineModel('group_attri', {
    id: {
        type: db.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    prodGroup: db.INTEGER, //product表的groupId
    attriId: db.STRING(20), //属性id
    attriName: db.STRING(30) //属性name
});
