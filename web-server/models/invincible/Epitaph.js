var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 墓志铭表
module.exports = {
	name: "epitaph",
	schema: {
		content: { // 主体内容
			type: String
		},
		merchandise: { // 商品信息 对应merchandise表的asin
			type: String
		},
		histories: [] // 更改记录 （head: 时间 操作人，body: 操作内容）
	}
};