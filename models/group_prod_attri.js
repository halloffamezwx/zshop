const db = require('../middleware/db');
//产品属性实体
module.exports = db.defineModel('group_prod_attri', {
    prodGroup: db.INTEGER, 
    attriId: db.STRING(20), //商品属性id
    attriName: db.STRING(30) //商品属性name
});
