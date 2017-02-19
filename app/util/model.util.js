var bookshelf = require("./../data/bookshelf.init");

module.exports = function (_model, options) {

    var model = koahub.models[_model];
    // 自动创建model
    if (!model) {
        model = bookshelf.Model.extend({
            tableName: _model,
            hasTimestamps: true
        });
    }
    options = options || {};
    var pageNum = 25;

    return {
        model: function () {
            return model;
        },
        handle: function (data) {
            if (typeof data === 'object' && data != null) {
                return data.toJSON();
            }
            return data;
        },
        add: function*(data) {
            if (!data.id) {
                delete data.id;
            }
            var data = yield model.forge(data).save();
            return this.handle(data);
        },
        del: function*(condition) {
            var data = yield model.forge(condition).destroy();
            return this.handle(data);
        },
        get: function*(condition) {
            var data = yield model.query({where: condition}).fetch(options);
            return this.handle(data);
        },
        getList: function*(condition) {
            var data = yield model.query({where: condition}).fetchAll(options);
            return this.handle(data);
        },
        getCount: function*(condition) {
            var data = yield model.query({where: condition}).count();
            return this.handle(data);
        },
        getPageList: function*(page, callback, option) {
            if (option != undefined && option.pageNum != undefined) {
                pageNum = option.pageNum;
            }

            var data = yield model.query(function (qb) {
                if (typeof callback === 'function') {
                    callback(qb);
                }

                qb.orderBy('id', 'desc');
            }).fetchPage({
                pageSize: pageNum,
                page: page,
                withRelated: options.withRelated
            });

            return {
                data: this.handle(data),
                pagination: data.pagination
            };
        },
        getQueryList: function*(callback) {
            var data = yield model.query(function (qb) {
                if (typeof callback === 'function') {
                    callback(qb);
                }

                qb.orderBy('id', 'desc');
            }).fetchAll(options);

            return this.handle(data);
        },
        getQueryCount: function*(callback) {
            var data = yield model.query(function (qb) {

                if (typeof callback === 'function') {
                    callback(qb);
                }
            }).count();

            return this.handle(data);
        }
    };
}