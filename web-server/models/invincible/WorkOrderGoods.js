var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 工单商品模型
module.exports = {
	name: "workOrderGoods",
	schema: {
		name: { // 名称
			type: String,
			required: true,
			unique: true
		},
		merchandise: [{ // 商品集合
			required: true,
			type: Schema.Types.ObjectId,
			ref: 'merchandise'
		}],
		remark: { // 备注
			type: String,
		},
		updatedAt: {
			type: Date,
			default: Date.now
		},
		createdAt: {
			type: Date,
			default: Date.now
		}
	}
};