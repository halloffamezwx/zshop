const model = require('../model');

let advert = model.advert;

module.exports = {
    getAllAds: async () => {
        var adverts = await advert.findAll();
        return adverts;
    },

    getAdByPosition: async (posit) => {
        var adverts = await advert.findAll({
            where: {
                position: posit
            }
        });
        return adverts;
    }
};
