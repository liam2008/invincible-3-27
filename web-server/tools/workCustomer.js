process.env.NODE_ENV = 'debug';
//process.env.NODE_ENV = 'development';
//process.env.NODE_ENV = 'production';
var fs = require('fs');
var async = require('async');
var moment = require('moment');
var mongoose = require('mongoose');
var DB = require('../models/invincible');
var User = DB.getModel('user');
var Team = DB.getModel('team');
var Customer = DB.getModel('operativeCustomer');
/*	客服分配数据	*/
var TextJson = [{
	"工单类型": "出现差评",
	"小组名": "熊本",
	"处理人": "温牡翠"
}, {
	"工单类型": "出现差评",
	"小组名": "车神队",
	"处理人": "邹靖霞"
}, {
	"工单类型": "出现差评",
	"小组名": "Arabot",
	"处理人": "邹靖霞"
}, {
	"工单类型": "出现差评",
	"小组名": "First Blood",
	"处理人": "赵安润"
}, {
	"工单类型": "出现差评",
	"小组名": "无为组",
	"处理人": "邹靖霞"
}, {
	"工单类型": "出现差评",
	"小组名": "ARTEMIS",
	"处理人": "温牡翠"
}, {
	"工单类型": "出现差评",
	"小组名": "IGGY组",
	"处理人": "赵安润"
}, {
	"工单类型": "出现差评",
	"小组名": "榕蜂组",
	"处理人": "钟淑欣"
}, {
	"工单类型": "出现差评",
	"小组名": "ACE",
	"处理人": "邹靖霞"
}, {
	"工单类型": "出现差评",
	"小组名": "favour组",
	"处理人": "钟淑欣"
}, {
	"工单类型": "出现差评",
	"小组名": "Yellow",
	"处理人": "钟淑欣"
}, {
	"工单类型": "出现差评",
	"小组名": "ARMY组",
	"处理人": "赵安润"
}, {
	"工单类型": "出现差评",
	"小组名": "进击的小组",
	"处理人": "赵安润"
}, {
	"工单类型": "出现差评",
	"小组名": "EGG²组",
	"处理人": "温牡翠"
}, {
	"工单类型": "出现差评",
	"小组名": "limitless",
	"处理人": "钟淑欣"
}, {
	"工单类型": "星级低于预警",
	"小组名": "熊本",
	"处理人": "温牡翠"
}, {
	"工单类型": "星级低于预警",
	"小组名": "车神队",
	"处理人": "邹靖霞"
}, {
	"工单类型": "星级低于预警",
	"小组名": "Arabot",
	"处理人": "邹靖霞"
}, {
	"工单类型": "星级低于预警",
	"小组名": "First Blood",
	"处理人": "赵安润"
}, {
	"工单类型": "星级低于预警",
	"小组名": "无为组",
	"处理人": "邹靖霞"
}, {
	"工单类型": "星级低于预警",
	"小组名": "ARTEMIS",
	"处理人": "温牡翠"
}, {
	"工单类型": "星级低于预警",
	"小组名": "IGGY组",
	"处理人": "赵安润"
}, {
	"工单类型": "星级低于预警",
	"小组名": "榕蜂组",
	"处理人": "钟淑欣"
}, {
	"工单类型": "星级低于预警",
	"小组名": "ACE",
	"处理人": "邹靖霞"
}, {
	"工单类型": "星级低于预警",
	"小组名": "favour组",
	"处理人": "钟淑欣"
}, {
	"工单类型": "星级低于预警",
	"小组名": "Yellow",
	"处理人": "钟淑欣"
}, {
	"工单类型": "星级低于预警",
	"小组名": "ARMY组",
	"处理人": "赵安润"
}, {
	"工单类型": "星级低于预警",
	"小组名": "进击的小组",
	"处理人": "赵安润"
}, {
	"工单类型": "星级低于预警",
	"小组名": "EGG²组",
	"处理人": "温牡翠"
}, {
	"工单类型": "星级低于预警",
	"小组名": "limitless",
	"处理人": "钟淑欣"
}, {
	"工单类型": "评论数量变少",
	"小组名": "熊本",
	"处理人": "温牡翠"
}, {
	"工单类型": "评论数量变少",
	"小组名": "车神队",
	"处理人": "邹靖霞"
}, {
	"工单类型": "评论数量变少",
	"小组名": "Arabot",
	"处理人": "邹靖霞"
}, {
	"工单类型": "评论数量变少",
	"小组名": "First Blood",
	"处理人": "赵安润"
}, {
	"工单类型": "评论数量变少",
	"小组名": "无为组",
	"处理人": "邹靖霞"
}, {
	"工单类型": "评论数量变少",
	"小组名": "ARTEMIS",
	"处理人": "温牡翠"
}, {
	"工单类型": "评论数量变少",
	"小组名": "IGGY组",
	"处理人": "赵安润"
}, {
	"工单类型": "评论数量变少",
	"小组名": "榕蜂组",
	"处理人": "钟淑欣"
}, {
	"工单类型": "评论数量变少",
	"小组名": "ACE",
	"处理人": "邹靖霞"
}, {
	"工单类型": "评论数量变少",
	"小组名": "favour组",
	"处理人": "钟淑欣"
}, {
	"工单类型": "评论数量变少",
	"小组名": "Yellow",
	"处理人": "钟淑欣"
}, {
	"工单类型": "评论数量变少",
	"小组名": "ARMY组",
	"处理人": "赵安润"
}, {
	"工单类型": "评论数量变少",
	"小组名": "进击的小组",
	"处理人": "赵安润"
}, {
	"工单类型": "评论数量变少",
	"小组名": "EGG²组",
	"处理人": "温牡翠"
}, {
	"工单类型": "评论数量变少",
	"小组名": "limitless",
	"处理人": "钟淑欣"
}, {
	"工单类型": "ASIN被篡改",
	"小组名": "熊本",
	"处理人": "温牡翠"
}, {
	"工单类型": "ASIN被篡改",
	"小组名": "车神队",
	"处理人": "邹靖霞"
}, {
	"工单类型": "ASIN被篡改",
	"小组名": "Arabot",
	"处理人": "邹靖霞"
}, {
	"工单类型": "ASIN被篡改",
	"小组名": "First Blood",
	"处理人": "赵安润"
}, {
	"工单类型": "ASIN被篡改",
	"小组名": "无为组",
	"处理人": "邹靖霞"
}, {
	"工单类型": "ASIN被篡改",
	"小组名": "ARTEMIS",
	"处理人": "温牡翠"
}, {
	"工单类型": "ASIN被篡改",
	"小组名": "IGGY组",
	"处理人": "赵安润"
}, {
	"工单类型": "ASIN被篡改",
	"小组名": "榕蜂组",
	"处理人": "钟淑欣"
}, {
	"工单类型": "ASIN被篡改",
	"小组名": "ACE",
	"处理人": "邹靖霞"
}, {
	"工单类型": "ASIN被篡改",
	"小组名": "favour组",
	"处理人": "钟淑欣"
}, {
	"工单类型": "ASIN被篡改",
	"小组名": "Yellow",
	"处理人": "钟淑欣"
}, {
	"工单类型": "ASIN被篡改",
	"小组名": "ARMY组",
	"处理人": "赵安润"
}, {
	"工单类型": "ASIN被篡改",
	"小组名": "进击的小组",
	"处理人": "赵安润"
}, {
	"工单类型": "ASIN被篡改",
	"小组名": "EGG²组",
	"处理人": "温牡翠"
}, {
	"工单类型": "ASIN被篡改",
	"小组名": "limitless",
	"处理人": "钟淑欣"
}, {
	"工单类型": "Lightning Deals",
	"小组名": "全部小组",
	"处理人": "钟淑欣"
}, {
	"工单类型": "销售权限",
	"小组名": "全部小组",
	"处理人": "黎广怡"
}, {
	"工单类型": "品牌更改",
	"小组名": "熊本",
	"处理人": "温牡翠"
}, {
	"工单类型": "品牌更改",
	"小组名": "车神队",
	"处理人": "邹靖霞"
}, {
	"工单类型": "品牌更改",
	"小组名": "Arabot",
	"处理人": "邹靖霞"
}, {
	"工单类型": "品牌更改",
	"小组名": "First Blood",
	"处理人": "赵安润"
}, {
	"工单类型": "品牌更改",
	"小组名": "无为组",
	"处理人": "邹靖霞"
}, {
	"工单类型": "品牌更改",
	"小组名": "ARTEMIS",
	"处理人": "温牡翠"
}, {
	"工单类型": "品牌更改",
	"小组名": "IGGY组",
	"处理人": "赵安润"
}, {
	"工单类型": "品牌更改",
	"小组名": "榕蜂组",
	"处理人": "钟淑欣"
}, {
	"工单类型": "品牌更改",
	"小组名": "ACE",
	"处理人": "邹靖霞"
}, {
	"工单类型": "品牌更改",
	"小组名": "favour组",
	"处理人": "钟淑欣"
}, {
	"工单类型": "品牌更改",
	"小组名": "Yellow",
	"处理人": "钟淑欣"
}, {
	"工单类型": "品牌更改",
	"小组名": "ARMY组",
	"处理人": "赵安润"
}, {
	"工单类型": "品牌更改",
	"小组名": "进击的小组",
	"处理人": "赵安润"
}, {
	"工单类型": "品牌更改",
	"小组名": "EGG²组",
	"处理人": "温牡翠"
}, {
	"工单类型": "品牌更改",
	"小组名": "limitless",
	"处理人": "钟淑欣"
}, {
	"工单类型": "店铺IP问题",
	"小组名": "全部小组",
	"处理人": "赵安润"
}, {
	"工单类型": "其它",
	"小组名": "全部小组",
	"处理人": "黎广怡"
}, ];
/*	对应问题类型	*/
var TextType = {
	'出现差评': '1',
	'星级低于预警': '2',
	'评论数量变少': '3',
	'ASIN被篡改': '5',
	'品牌被篡改': '6',
	'标题被篡改': '7',
	'简介被篡改': '8',
	'描述被篡改': '9',
	'主图被篡改': '10',
	'Lightning Deals': '003',
	'销售权限': '004',
	'品牌更改': '005',
	'店铺IP问题': '006',
	'其它': '000'
};
let UserJson = {};
let TeamJson = {};
let TeamList = [];
let WorkLack = [];
let TeamLack = [];
let UserLack = [];

async.series([
	// 清空客服数据
	function(callback) {
		Customer.remove({}, function(err) {
			callback(err)
		})
	},
	// 获取用户数据
	function(callback) {
		User.find({}, ['name'], function(err, docs) {
			docs.map(function(item) {
				UserJson[item.name] = item._id
			});
			callback(err)
		})
	},
	// 获取小组数据
	function(callback) {
		Team.find({}, ['name'], function(err, docs) {
			docs.map(function(item) {
				TeamList.push(item);
				TeamJson[item.name] = item._id
			});
			callback(err)
		})
	}
], function(err) {
	// 分配处理
	async.mapSeries(TextJson, function(item, callback) {
		let typeId = TextType[item['工单类型']];
		let teamId = TeamJson[item['小组名']];
		let userId = UserJson[item['处理人']];

		if(!userId || !teamId && item['小组名'] != '全部小组') {
			if(!userId && UserLack.indexOf(item['处理人']) == -1) UserLack.push(item['处理人']);
			if(!teamId && TeamLack.indexOf(item['小组名']) == -1 && item['小组名'] != '全部小组') TeamLack.push(item['小组名']);
			WorkLack.push({
				'工单类型': item['工单类型'],
				'小组名': item['小组名'],
				'处理人': item['处理人']
			});
			callback(null)
		} else {
			if(item['小组名'] == '全部小组') {
				new Customer({
					_id: new mongoose.Types.ObjectId(),
					customer_id: new mongoose.Types.ObjectId(userId),
					work_order_type: typeId,
					updatedAt: Date.now(),
					createdAt: Date.now()
				}).save(function(err) {
					callback(err)
				})
			} else {
				new Customer({
					_id: new mongoose.Types.ObjectId(),
					customer_id: new mongoose.Types.ObjectId(userId),
					operate_team: new mongoose.Types.ObjectId(teamId),
					work_order_type: typeId,
					updatedAt: Date.now(),
					createdAt: Date.now()
				}).save(function(err) {
					callback(err)
				})
			}
		}
	}, function(err) {
		console.log('分配缺失 复制内容转化为表格手动分配 https://www.bejson.com/json/json2excel/')
		fs.writeFileSync('D:\\work.txt', JSON.stringify(WorkLack));
		console.log('该用户不存在：' + UserLack.toString())
		console.log('该小组不存在：' + TeamLack.toString())
	})
});