const db = require('../db');

module.exports = db.defineModel('product', {
    id: {
        type: db.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: db.STRING(100),
    description: db.STRING(200),
    price: db.DECIMAL(12, 2),
    image: db.STRING(100),
    recommend: {
        type: db.INTEGER,
        allowNull: true
    },
    sales: {
        type: db.INTEGER,
        defaultValue: 0
    }
});
