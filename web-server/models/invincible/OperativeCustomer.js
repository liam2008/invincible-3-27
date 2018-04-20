var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

module.exports = {
    name: "operativeCustomer",
    schema: {
        _id: Schema.Types.ObjectId,
        operate_team: { type: Schema.Types.ObjectId, ref: 'team' },                                                   // 运营小组
        work_order_type: String,                                                // 工单类型(1：评论异常， 2：发现跟单， 3：Lightning Deals， 4:销售权限， 5:品牌更改， 6:店铺IP问题， 0：其它)
        customer_id: { type: Schema.Types.ObjectId, ref: 'user' },                 // 客服

        createdAt: { type: Date, default: moment().format("YYYY-MM-DD HH:mm:ss")},
        updatedAt: { type: Date, default: moment().format("YYYY-MM-DD HH:mm:ss")}
    }
};