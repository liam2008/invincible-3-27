// 品类
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
	name: "category",
	schema: {
		name: {
			type: String,
			required: true
		},
		shortName: {
			type: String,
			required: true
		},
		chineseName: {
			type: String
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		updatedAt: {
			type: Date,
			default: Date.now
		}
	}
};