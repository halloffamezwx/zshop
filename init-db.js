//初始化数据库 包括表和表数据 谨慎执行
const model = require('./middleware/model.js');
const fs = require('mz/fs');
var sequelize = model.sequelize;

(async () => {
    await model.sync();

    let fp = 'init-sql.sql';
    var sqlBuffer = await fs.readFile(fp);
    var sqlString = sqlBuffer.toString('utf-8');
    
    var sqlStringArray = sqlString.split("\n");
    for (let i = 0; i < sqlStringArray.length; i++) {
        //console.log(sqlStringArray[i]);
        if (sqlStringArray[i].trim() == '') {
            continue;
        }
        await sequelize.query(sqlStringArray[i]);
    }

    process.exit(0);
})();

/* sequelize.query('select * from product').spread((results, metadata) => {
    console.log(results);
});

sequelize.query('select * from product', { type: sequelize.QueryTypes.SELECT }).then(results => {
    console.log(results);
}); */