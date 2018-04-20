var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 工单分配模型
module.exports = {
	name: "workOrderAllot",
	schema: {
		goods: {
			required: true,
			type: Schema.Types.ObjectId,
			ref: 'workOrderGoods'
		},
		customer: {
			required: true,
			type: Schema.Types.ObjectId,
			ref: 'user'
		},
		type: {
			required: true,
			type: String
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