var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 版本更新日志
module.exports = {
	name: "update-log",
	schema: {
		version: {
			type: String
		},
		content: {
			type: String
		},
		viewed: {
			type: [],
			default: []
		},
		createdAt: {
			type: Date,
			default: Date.now
		}
	}
};