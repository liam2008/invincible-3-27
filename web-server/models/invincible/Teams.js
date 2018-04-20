// 类目组

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
	name: "team",
	schema: {
		uuid: String, // uuid 用来做唯一辨识 如查找照片等功能
		name: { // 小组名称
			type: String,
			required: true,
			unique: true
		},
		leader: { // 类目主管
			type: Schema.Types.ObjectId,
			ref: 'user'
		},
		members: [{ // 成员
			type: Schema.Types.ObjectId,
			ref: 'user'
		}],
		categories: [{ // 品类信息
			type: Schema.Types.ObjectId,
			ref: 'category'
		}],
		deleted: { type: Boolean, default: false},
		history: [], // 历史
		createdAt: Date, // 创建时间
		updatedAt: Date, // 修改时间
		deletedAt: Date // 删除时间
	},
	fn: {
		// 获取当前可用的小组信息
		getSurviving: function(model) {
			if (model == null) {
				console.log(new Error("teams getSurviving no model!!!"));
				return;
			}

			return function(callback) {
                model.find({deleted: {$ne: true}})
					.populate("leader")
                    .populate("members")
                    .populate("categories")
					.exec(function(err, result) {
                    callback && callback(err, result);
                });
			}
		},

		// 停用小组 将deleted字段设置为false
        disable: function(model) {
            if (model == null) {
                console.log(new Error("teams disable no model!!!"));
                return;
            }

            return function(id, callback) {
                model.update({_id: id},
                    {$set: {deleted: true}},
                    {multi: false},
                    function(err, result) {
                        callback &&callback(err, result);
                    });
            }
        }
	}
};