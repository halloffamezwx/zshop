//商品service
const model = require('../middleware/model');

let product = model.product;

module.exports = {
    //查询所有商品
    getAllProducts: async () => {
        var products = await product.findAll();
        //console.log(JSON.stringify(products));
        return products;
    },

    //根据关键字搜索商品
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
        //console.log(JSON.stringify(products));
        return products;
    },

    //取得相应的推荐商品
    getRecomProduct: async (recom) => {
        var products = await product.findAll({
            where: {
                recommend: recom
            }
        });
        //console.log(JSON.stringify(products));
        return products;
    },

    //新增一个商品
    createProduct: async (name, price) => {
        await product.create({
            name: 'dfdfd',
            description: 'dfdfe33',
            price: 112.01,
            image: 'dkfjdkf'
        });
        return null;
    },

    //根据id删除一个商品
    deleteProduct: async (id) => {
        
        return null;
    }
};
