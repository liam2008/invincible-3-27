var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 工单类型模型
module.exports = {
	name: "workOrderType",
	schema: {
		name: { // 名称
			type: String,
			required: true,
			unique: true
		},
		type: { // 编号
			type: String,
		},
		tips: { // 说明
			type: String,
		},
		remark: { // 模版
			type: String,
		},
		isAsin: { // 是否填写ASIN
			type: Boolean,
			default: false
		},
		handlingHours: { // 最长处理时限
			type: Number,
			default: 0
		},
		reminderHours: { // 提醒处理时限
			type: Number,
			default: 0
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