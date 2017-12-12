//广告service
const model = require('../middleware/model');

let advert = model.advert;

module.exports = {
    //查询所有广告
    getAllAds: async () => {
        var adverts = await advert.findAll();
        return adverts;
    },

    //根据位置查询广告
    getAdByPosition: async (posit) => {
        var adverts = await advert.findAll({
            where: {
                position: posit
            }
        });
        return adverts;
    }
};
