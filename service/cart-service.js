//购物车service
const model = require('../middleware/model');
var sequelize = model.sequelize;
let prodAttriValue = model.prod_attri_value;
let cart = model.cart;

module.exports = {
    //查询用户购物车
    getUserCartProd: async (user) => {
        var qcarts =  await sequelize.query('SELECT c.id AS cid, p.id AS pid, p.`name`, p.price, p.image, c.count, p.stock ' 
                                          + 'FROM cart c '
                                          + 'LEFT JOIN product p ON c.prodId = p.id '
                                          + 'WHERE c.userId = :userId',
                            {replacements: {userId: user.userId}, type: sequelize.QueryTypes.SELECT});
        let totalPrice = 0.00;
        for (let i = 0; i < qcarts.length; i++) {
            let attriValues = await sequelize.query("SELECT GROUP_CONCAT(t1.attriValue SEPARATOR ' ') AS attriValuesStr "
                                                     + "FROM prod_attri t "
                                                     + "LEFT JOIN group_attri_value t1 ON t.groupAttriValueId = t1.id "
                                                     + "WHERE t.prodId = :prodId",
                                 {replacements: {prodId: qcarts[i].pid}, type: sequelize.QueryTypes.SELECT});
            if (attriValues[0].attriValuesStr) {
                qcarts[i].attriValuesStr = attriValues[0].attriValuesStr;
            } else {
                qcarts[i].attriValuesStr = '精选商品';
            }
            totalPrice += qcarts[i].price * qcarts[i].count;
        }
        var result = new Object();
        result.totalPrice = totalPrice;
        result.totalSize = qcarts.length;
        result.cartProds = qcarts;

        //console.log(JSON.stringify(result));
        return result;
    },

    //根据id删除一个购物车商品
    deleteCardProd: async (id) => {
        await cart.destroy({where: {id: parseInt(id)}});
    },

    //修改购物车商品数量
    updateCardProdCount: async (id, count) => {
        //await cart.update({count: parseInt(count), updatedAt: Date.now()}, {where: {id: parseInt(id)}});
        await sequelize.query('UPDATE cart SET count = :count, updatedAt = now(), version = version + 1 WHERE id = :id', 
                        { replacements: { count: parseInt(count), id: parseInt(id) } });
    },

    getCardProdNum: async (userId) => {
        return await cart.count({where: {userId: userId}});
    },

    addCartProd: async (pid, pcount, userId) => {
        await cart.create({
            userId: userId,
            prodId: parseInt(pid),
            count: parseInt(pcount)
        });
    }
};
