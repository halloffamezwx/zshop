const db = require('../middleware/db');
//用户实体
module.exports = db.defineModel('user', {
    email: {
        type: db.STRING(100),
        unique: true,
        allowNull: true
    },
    mobile: {
        type: db.STRING(11),
        unique: true
    },
    userId: {
        type: db.STRING(30),
        unique: true
    },
    passwd: db.STRING(100),
    name: db.STRING(100),
    gender: { //true:男，false:女
        type: db.BOOLEAN,
        allowNull: true
    },
    headImage: db.STRING(100) //头像
});
