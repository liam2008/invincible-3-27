/*
* 小组管理权限
* 对应到每个人，所属的小组信息
* 暂时只用于类目主管的配置
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    name: "team_manager",
    schema: {
        user:               { type: Schema.Types.ObjectId, ref: 'user' },           // 用户id
        teams:              [{ type: Schema.Types.ObjectId, ref: 'team' }],         // 小组id列表
        history:            [],
        createdAt:          Date,
        updatedAt:          Date,
        deletedAt:          Date
    }
};
