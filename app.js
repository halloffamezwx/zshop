const myLog4js = require("./middleware/my-log4js");
const uuid = require('node-uuid');
const sysLogger = myLog4js.getLogger('system');
sysLogger.addContext('logid', uuid.v4().replace(/-/g,""));
console.log = sysLogger.info.bind(sysLogger);

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');
const controller = require('./middleware/controller');
const templating = require('./middleware/templating');
const compress = require('koa-compress');
const rest = require('./middleware/rest');
const app = new Koa();
const session = require("koa-session2");

console.log(`process.env.NODE_ENV = [${process.env.NODE_ENV}]`);
const isProduction = process.env.NODE_ENV === 'production';
console.log(`isProduction = [${isProduction}]`);

// log request URL:
app.use(async (ctx, next) => {
    var logger = myLog4js.getLogger('zshop');
    var logid = uuid.v4().replace(/-/g, "");
    logger.addContext('logid', logid);
    console.log = logger.info.bind(logger);
    ctx.logger = logger;

    logger.info(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
        
    await next();

    console.log("ctx.response.status=" + ctx.response.status);
    if (ctx.response.status == 404) {
        ctx.response.redirect('/static/html/404.html');
    }

    ctx.response.set('logid', logid);
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`); 
});

app.use(compress({
    //filter: function (content_type) {
    //    return /text/i.test(content_type)
    //},
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}));

app.use(session({
    key: "SESSIONID", //default "koa:sess"
    maxAge: 30 * 60 * 1000
}));

// static file support:
//if (! isProduction) {
    let staticFiles = require('./middleware/static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
//}

app.use(koaBody({ 
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024 //设置上传文件大小最大限制，默认2M
    } 
}));
// parse request body:
app.use(bodyParser());

// add nunjucks as view:
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

// bind .rest() for ctx:
app.use(rest.restify());

// add controller:
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');
