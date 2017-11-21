const model = require('../model');

let product = model.product;

module.exports = {
    getAllProducts: async () => {
        var products = await product.findAll();
        //console.log(JSON.stringify(products));
        return products;
    },

    searchProduct: async (searchKey, limit, offset, orderType) => {
        var orderStr = null;
        if (orderType == 1) {
            orderStr = "sales ASC";
        } else if (orderType == 2) {
            orderStr = "sales DESC";
        } else if (orderType == 3) {
            orderStr = "price ASC";
        } else if (orderType == 4) {
            orderStr = "price DESC";            
        } 

        var products = await product.findAndCountAll({
            where: {
                $or: [
                    {name: {$like: '%' + searchKey + '%'}},
                    {description: {$like: '%' + searchKey + '%'}}
                ]
            },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: orderStr
        });
        return products;
    },

    getRecomProduct: async (recom) => {
        var products = await product.findAll({
            where: {
                recommend: recom
            }
        });
        return products;
    },

    createProduct: async (name, price) => {
        await product.create({
            name: 'dfdfd',
            description: 'dfdfe33',
            price: 112.01,
            image: 'dkfjdkf'
        });
        return null;
    },

    deleteProduct: async (id) => {
        
        return null;
    }
};
