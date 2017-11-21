const db = require('../db');
//用户实体
module.exports = db.defineModel('user', {
    email: {
        type: db.STRING(100),
        unique: true
    },
    passwd: db.STRING(100),
    name: db.STRING(100),
    gender: { //true:男，false:女
        type: db.BOOLEAN,
        allowNull: true
    }
});
