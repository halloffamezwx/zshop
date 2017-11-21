const db = require('../db');

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
    position: db.INTEGER,
    image: db.STRING(100),
    url: {
        type: db.STRING(100),
        allowNull: true
    }
});
