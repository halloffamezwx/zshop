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
        
        let limitInt = parseInt(limit);
        if (limitInt > 50) {
            limitInt = 50;
        }

        var products = await product.findAndCountAll({
            where: {
                $or: [
                    {name: {$like: '%' + searchKey + '%'}},
                    {description: {$like: '%' + searchKey + '%'}}
                ]
            },
            limit: limitInt,
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
        for (let i = 0; i < groupAttris.length; i++) {
            let groupAttriValueMap = new Map();
            
            for (let j = 0; j < groupAttriValues.length; j++) {
                if (groupAttris[i].attriId == groupAttriValues[j].attriId) {
                    let groupAttriValueObj = groupAttriValueMap.get(groupAttriValues[j].attriValue);
                    if (!groupAttriValueObj) {
                        groupAttriValueObj = new Object();
                        groupAttriValueObj.attriValue = groupAttriValues[j].attriValue;
                    }
                    if (groupAttriValues[j].prodId == pid) {
                        groupAttriValueObj.class = "active";
                    }
                    if (!groupAttriValues[j].prodId) {
                        groupAttriValueObj.disabled = true;
                        groupAttriValueObj.class = "disabled";
                    }

                    groupAttriValueMap.set(groupAttriValues[j].attriValue, groupAttriValueObj);
                }
            }

            groupAttris[i].groupAttriValueMap = groupAttriValueMap;
        }

        let attriValueStr = "";
        for (let i = 0; i < groupAttris.length; i++) {
            let groupAttriValueArr = new Array();
            
            for (let item of groupAttris[i].groupAttriValueMap.entries()) {
                //console.log(item[0] + " = " + item[1]);
                groupAttriValueArr.push(item[1]);
                if (item[1].class == "active") {
                    if (attriValueStr == "") {
                        attriValueStr += item[1].attriValue;
                    } else {
                        attriValueStr += " " + item[1].attriValue;
                    }
                }
            }
            groupAttris[i].groupAttriValueArr = groupAttriValueArr;
        }
        
        qProduct.detailImagesArr = qProduct.detailImages.split(";");
        qProduct.groupAttris = groupAttris;
        qProduct.attriValueStr = attriValueStr;
        qProduct.gavJsonStr = JSON.stringify(groupAttriValues);
        //console.log(JSON.stringify(qProduct));
        return qProduct;
    },

    getProdAttriValueStr:  async (pid) => {
        let attriValues = await sequelize.query("SELECT GROUP_CONCAT(t1.attriValue SEPARATOR ' ') AS attriValuesStr "
                                              + "FROM prod_attri t "
                                              + "LEFT JOIN group_attri_value t1 ON t.groupAttriValueId = t1.id "
                                              + "WHERE t.prodId = :prodId",
                                {replacements: {prodId: pid}, type: sequelize.QueryTypes.SELECT});
        if (attriValues[0].attriValuesStr) {
            return attriValues[0].attriValuesStr;
        } else {
            return '精选商品';
        }
    }
};
