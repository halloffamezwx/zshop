//收藏service
const model = require('../middleware/model');
var sequelize = model.sequelize;
let collection = model.collection;

module.exports = {
    //查询一个收藏
    getOneCollection: async (userId, prodId) => {
        return await collection.findOne({
            where: {
                userId: userId,
                prodId: parseInt(prodId)
            }
        });
    },

    getCollection: async (userId) => {
        return await sequelize.query("SELECT t.id, t.prodId, t1.`name`, t1.price, t1.image, t1.description "
                                   + "FROM collection t "
                                   + "LEFT JOIN product t1 ON t.prodId = t1.id "
                                   + "WHERE t.userId = :userId",
                     {replacements: {userId: userId}, type: sequelize.QueryTypes.SELECT});
    },

    collection: async (id, userId, pid) => {
        if (id && id.trim() != "") {
            await collection.destroy({where: {id: id}});
        } else {
            let coll = await collection.create({
                userId: userId,
                prodId: parseInt(pid),
            });
            return coll.id;
        }   
    }
};
