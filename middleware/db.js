const Sequelize = require('sequelize');
const moment = require('moment');
const uuid = require('node-uuid');

const config = require('./config');

console.log('init sequelize...');

function generateId() {
    return uuid.v4();
}

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    timezone: '+08:00' //东八时区
    //logging: function(sql) {    
    //  console.log(sql);  
    //} 
});

const ID_TYPE = Sequelize.STRING(50);

function defineModel(name, attributes) {
    var attrs = {};
    attrs.id = {
        type: ID_TYPE,
        primaryKey: true
    };
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }
    
    attrs.createdAt = {
        type: Sequelize.DATE,
        allowNull: false
        //get() {
        //    return moment(this.getDataValue('ServiceTime')).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
        //}
    };
    attrs.updatedAt = {
        type: Sequelize.DATE,
        allowNull: false
        //get() {
        //    return moment(this.getDataValue('ServiceTime')).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
        //}
    };
    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
    };
    console.log('model defined for table: ' + name + '\n' + JSON.stringify(attrs, function (k, v) {
        if (k === 'type') {
            for (let key in Sequelize) {
                if (key === 'ABSTRACT' || key === 'NUMBER') {
                    continue;
                }
                let dbType = Sequelize[key];
                if (typeof dbType === 'function') {
                    if (v instanceof dbType) {
                        if (v._length) {
                            return `${dbType.key}(${v._length})`;
                        }
                        return dbType.key;
                    }
                    if (v === dbType) {
                        return dbType.key;
                    }
                }
            }
        }
        return v;
    }, '  '));
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();
                if (obj.isNewRecord) {
                    console.log('will create entity...' + JSON.stringify(obj));
                    console.log('will create entity idtype...' + attrs.id.type);
                    if (!obj.id && attrs.id.type == ID_TYPE) {
                        obj.id = generateId();
                    }
                    obj.createdAt = now;
                    obj.updatedAt = now;
                    //obj.version = 0;
                } else {
                    console.log('will update entity...');
                    obj.updatedAt = now;
                    obj.version++;
                }
            }
        }
    });
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN', 'DECIMAL', 'DATE'];

var exp = {
    defineModel: defineModel,
    sync: async () => {
        console.log('process.env.NODE_ENV=' + process.env.NODE_ENV);
        // only allow create ddl in non-production environment:
        //if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync({ force: true });
        //} else {
        //    throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        //}
    }
};

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}

exp.ID = ID_TYPE;
exp.generateId = generateId;
exp.sequelize = sequelize;

module.exports = exp;
