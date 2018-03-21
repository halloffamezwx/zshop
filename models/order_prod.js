const db = require('../middleware/db');
//订单产品实体
module.exports = db.defineModel('order_prod', {
    orderId: db.STRING(50), //订单id
    prodId: db.INTEGER, //产品id
    price: db.DECIMAL(12, 2), //价格
    count: db.INTEGER, //数量
    cartId: db.INTEGER //购物车id
});