//收藏service
const model = require('../middleware/model');

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
