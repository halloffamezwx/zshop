//购物车service
const model = require('../middleware/model');
var sequelize = model.sequelize;
let prodAttriValue = model.prodAttriValue;
let cart = model.cart;

module.exports = {
    //查询用户购物车
    getUserCartProd: async (user) => {
        var qcarts =  await sequelize.query('SELECT c.id AS cid, p.id AS pid, p.`name`, p.price, p.image, c.count, p.stock ' +
                                           'FROM cart c LEFT JOIN product p ON c.prodId = p.id ' +
                                           'WHERE c.userId = :userId',
            { replacements: { userId: user.userId }, type: sequelize.QueryTypes.SELECT }
        )

        let totalPrice = 0.00;
        for (let i = 0; i < qcarts.length; i++) {
            let attriValues = await prodAttriValue.findAll({where: {prodId: qcarts[i].pid}});
            let attriValuesStr = "";
            for (let j = 0; j < attriValues.length; j++) {
                if (j == 0) {
                    attriValuesStr += attriValues[j].attriValue;
                } else {
                    attriValuesStr += " " + attriValues[j].attriValue;
                }
            }
            qcarts[i].attriValuesStr = attriValuesStr;
            totalPrice += qcarts[i].price;
        }
        var result = new Object();
        result.totalPrice = totalPrice;
        result.totalSize = qcarts.length;
        result.cartProds = qcarts

        //console.log(JSON.stringify(result));
        return result;
    },

    //根据id删除一个购物车商品
    deleteCardProd: async (id) => {
        await cart.destroy({where: {id: id}});
    }
};
