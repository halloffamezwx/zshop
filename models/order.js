const db = require('../middleware/db');
const moment = require('moment');

//订单实体
module.exports = db.defineModel('order', {
    userId: db.STRING(30), //用户id
    province: db.STRING(20), //配送省
    city: db.STRING(20), //配送市
    area: db.STRING(20), //配送地区
    address: db.STRING(100), //配送详细地址
    recipient: db.STRING(20), //收件人
    recipientPhone: db.STRING(30), //收件人电话号码
    deliveryType: { //配送方式 1-快递
        type: db.INTEGER,
        defaultValue: 1
    },
    expressCompany: db.STRING(50), //快递公司
    expressNumber: db.STRING(50), //快递单号
    status: { //订单状态 1-初始化 2-待付款 3-待发货 4-待收货 5-待评价 6-已评价
        type: db.INTEGER,
        defaultValue: 1
    },
    deliveryFee: { //配送费用
        type: db.DECIMAL(12, 2),
        defaultValue: 10.00
    }, 
    prodPrice: db.DECIMAL(12, 2), //商品价格
    totalPrice: db.DECIMAL(12, 2), //总价格 = 商品价格 + 配送费用
    payStartTime: { //支付有效开始时间
        type: db.DATE,
        allowNull: true
        //get() {
        //    return moment(this.getDataValue('ServiceTime')).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
        //}
    }
});