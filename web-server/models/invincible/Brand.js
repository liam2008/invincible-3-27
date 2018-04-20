// 品牌

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    name: "brand",
    schema: {
        _id:            Schema.Types.ObjectId,
        name:           String,                 // 品牌名
        remarks:        String,                 // 备注
        createdAt:      Date,
        updatedAt:      Date,
        deletedAt:      Date
    }
};
