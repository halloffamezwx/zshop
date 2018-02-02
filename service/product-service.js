//商品service
const model = require('../middleware/model');

let product = model.product;
let groupAttri = model.group_attri;
let sequelize = model.sequelize;

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
    },

    //商品详情
    prodDetail: async (pid) => {
        let qProduct = await product.findById(parseInt(pid));
        let groupAttris = await groupAttri.findAll({where: {prodGroup: qProduct.groupId}});

        let groupAttriValues =  await sequelize.query('SELECT t.attriId, t.attriName, t1.attriValue, t2.prodId '
                                                    + 'FROM group_attri t '
                                                    + 'LEFT JOIN group_attri_value t1 ON t.id = t1.groupAttriId '
                                                    + 'LEFT JOIN prod_attri t2 ON t1.id = t2.groupAttriValueId '
                                                    + 'WHERE t.prodGroup = :prodGroup',
                                      {replacements: {prodGroup: qProduct.groupId}, type: sequelize.QueryTypes.SELECT});
        let attriValueStr = "";
        for (let i = 0; i < groupAttris.length; i++) {
            let groupAttriValueArr = new Array();
            
            for (let j = 0; j < groupAttriValues.length; j++) {
                if (groupAttris[i].attriId == groupAttriValues[j].attriId) {
                    let groupAttriValueObj = new Object();
                    groupAttriValueObj.attriValue = groupAttriValues[j].attriValue;
                    groupAttriValueObj.isCheck = false;

                    if (groupAttriValues[j].prodId == pid) {
                        groupAttriValueObj.isCheck = true;
                        if (attriValueStr == "") {
                            attriValueStr += groupAttriValues[j].attriValue;
                        } else {
                            attriValueStr += " " + groupAttriValues[j].attriValue;
                        }
                    }
                    groupAttriValueArr.push(groupAttriValueObj);
                }
            }
            
            groupAttris[i].groupAttriValueArr = groupAttriValueArr;
        }
        
        qProduct.detailImagesArr = qProduct.detailImages.split(";");
        qProduct.groupAttris = groupAttris;
        qProduct.attriValueStr = attriValueStr;
        //console.log(JSON.stringify(qProduct));
        return qProduct;
    }
};
