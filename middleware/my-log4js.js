const log4js = require('log4js');
//const uuid = require('node-uuid');

log4js.configure({
    appenders: {
        myFileAppend: {
            type: 'dateFile',
            filename: 'logs/',
            pattern: 'zshop_yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            layout: {
                type: 'pattern',
                pattern: '[%d] [%p] [%X{logid}] %c - %m'
            }
        },
        myConsoleAppend: {
            type: 'console',
            layout: {
                type: 'pattern',
                pattern: '%[[%d] [%p] [%X{logid}] %c -%] %m'
                //tokens: {
                //  logid: function(logEvent) {
                //    return uuid.v4();
                //  }
                //}
            }
        }
    },
    categories: {
        default: { appenders: ['myFileAppend', 'myConsoleAppend'], level: 'debug'}
    }
});

module.exports = log4js;