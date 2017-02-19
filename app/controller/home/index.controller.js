module.exports = class extends koahub.controller {

    _initialize() {
        //设置模版主题
        this.state.theme = 'home';
    }

    *index() {

        var context = {version: process.version, time: new Date()};
        var article = yield this.model('article').getList({});
        yield this.render('index', {context: context, article: article});
    }
}