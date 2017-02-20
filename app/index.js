var Koahub = require("koahub").default;
var hbs = require("koahub-handlebars");
var convert = require("koa-convert");
var body = require("koa-body");
var serve = require("koa-static");
var session = require("koa-session2").default;
var helpers = require("handlebars-helpers");
var model = require("./util/model.util");

var app = new Koahub();
var koa = app.getKoa();

koa.use(convert(body({multipart: true})));
koa.use(convert(serve('./www')));
koa.use(session({
    key: "koahubjs",   //default "koa:sess"
}));
koa.use(hbs.middleware({
    extname: '.html',
    viewPath: './www',
    layoutsPath: './www',
    partialsPath: './www',
    disableCache: true //true: 模版修改立即生效（性能差），false：模版修改重启生效（性能提升10倍）
}));

helpers({
    handlebars: hbs.handlebars
});

koa.use(convert(function *(next) {

    this.model = model;

    if (!this.request.body.files) {
        this.post = this.request.body;
    } else {
        this.post = this.request.body.fields;
        this.file = this.request.body.files;
    }

    yield next;
}));

koa.use(convert(function *(next) {
    try {
        yield next;
    } catch (err) {

        if (err.code == 'ER_ACCESS_DENIED_ERROR') {
            console.error('数据库链接失败')
        }
        if (err.code == 'ER_NO_SUCH_TABLE') {
            console.error('数据库中没有对应的表')
        }
    }
}));

app.run();