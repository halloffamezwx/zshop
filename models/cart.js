const db = require('../middleware/db');
//购物车实体
module.exports = db.defineModel('cart', {
    id: {
        type: db.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: db.STRING(30),
    prodId: db.INTEGER,
    count: db.INTEGER
});
