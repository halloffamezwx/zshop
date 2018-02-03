const db = require('../middleware/db');
//我的收藏实体
module.exports = db.defineModel('collection', {
    userId: db.STRING(30),
    prodId: db.INTEGER
});
