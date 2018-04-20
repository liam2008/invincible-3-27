var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 工单公告模型
module.exports = {
	name: "workOrderNotice",
	schema: {
		title: { // 标题
			type: String,
			required: true,
			unique: true
		},
		content: { // 内容
			required: true,
			type: String,
		},
		startTime: { // 开始时间
			required: true,
			type: Date,
			default: Date.now
		},
		endTime: { // 结束时间
			required: true,
			type: Date,
			default: Date.now
		},
		creator: { // 创建人
			type: Schema.Types.ObjectId,
			ref: 'user'
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