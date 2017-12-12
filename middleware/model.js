// scan all models defined in models:
const fs = require('fs');
const db = require('./db');

//let files = fs.readdirSync(__dirname + '/models');
let files = fs.readdirSync('./models');

let js_files = files.filter((f)=>{
    return f.endsWith('.js');
}, files);

module.exports = {};

for (let f of js_files) {
    console.log(`import model from file ${f}...`);
    let name = f.substring(0, f.length - 3);
    //module.exports[name] = require(__dirname + '/models/' + f);
    module.exports[name] = require('../models/' + f);
}

module.exports.sync = async () => {
    await db.sync();
};

module.exports.sequelize = db.sequelize
