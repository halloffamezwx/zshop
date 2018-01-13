const db = require('../middleware/db');
//产品属性值实体
module.exports = db.defineModel('prod_attri_value', {
    prodId: db.INTEGER, 
    attriId: db.INTEGER, //商品属性id
    attriValue: db.STRING(100) //商品属性value
});
