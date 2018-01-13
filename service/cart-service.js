//购物车service
const model = require('../middleware/model');
var sequelize = model.sequelize;
let prodAttriValue = model.prodAttriValue;

module.exports = {
    //查询用户购物车
    getUserCartProd: async (user) => {
        var qcarts =  await sequelize.query('SELECT p.id, p.`name`, p.price, p.image, c.count FROM cart c ' +
                                           'LEFT JOIN product p ON c.prodId = p.id ' +
                                           'WHERE c.userId = :userId',
            { replacements: { userId: user.userId }, type: sequelize.QueryTypes.SELECT }
        )
        for (let i = 0; i < qcarts.length; i++) {
            let attriValues = await prodAttriValue.findAll({
                where: {
                    prodId: qcarts[i].id
                }
            });
            let attriValuesStr = "";
            for (let j = 0; j < attriValues.length; j++) {
                if (j == 0) {
                    attriValuesStr += attriValues[j].attriValue;
                } else {
                    attriValuesStr += " " + attriValues[j].attriValue;
                }
            }
            qcarts[i].attriValuesStr = attriValuesStr
        }
        console.log(JSON.stringify(qcarts));
        return qcarts;
    }
};
