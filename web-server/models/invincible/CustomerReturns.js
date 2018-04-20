var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

module.exports = {
    name: "customer_returns",
    schema: {
        _id: Schema.Types.ObjectId,
        store_sku: String,                                                   // 库存sku
        today: Number,                                                       // 当天退货个数
        total: Number,                                                       // 上架→目前退货统计

        createdAt: { type: Date, default: moment().format("YYYY-MM-DD HH:mm:ss")}
    }
};