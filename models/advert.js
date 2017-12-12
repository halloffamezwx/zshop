const db = require('../middleware/db');
//广告实体
module.exports = db.defineModel('advert', {
    id: {
        type: db.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: db.STRING(100),
    description: {
        type: db.STRING(200),
        allowNull: true
    },
    position: db.INTEGER, //位置 1-首页头部 2-首页中部
    image: db.STRING(100),
    url: {
        type: db.STRING(100),
        allowNull: true
    }
});
