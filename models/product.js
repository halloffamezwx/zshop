const db = require('../middleware/db');
//商品实体
module.exports = db.defineModel('product', {
    id: {
        type: db.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    groupId: db.INTEGER,
    name: db.STRING(100),
    description: db.STRING(200),
    price: db.DECIMAL(12, 2),
    image: db.STRING(100),
    recommend: { //推荐 1-首页精品推荐
        type: db.INTEGER,
        allowNull: true
    },
    sales: { //销量
        type: db.INTEGER,
        defaultValue: 0
    },
    stock: { //库存
        type: db.INTEGER, 
        defaultValue: 0
    }
});
