var TextList = require('./setMerchandise.json');
//process.env.NODE_ENV = 'debug';
//process.env.NODE_ENV = 'development';
process.env.NODE_ENV = 'production';
var async = require('async');
var moment = require('moment');
var mongoose = require('mongoose');
var DB = require('../models/invincible');
var User = DB.getModel('user');
var Merchandise = DB.getModel('merchandise');

let UserJosn = {};
let TextJson = {};
let setMerchandise = [];
let UserLack = [];
/*	配置商品管理员	*/
async.series([
	// 获取用户信息
	function(callback) {
		User.find({
			team: {
				$ne: null
			}
		}, ['name', 'team'], function(err, docs) {
			docs.map(function(item) {
				UserJosn[item.name] = {
					team_id: item.team,
					manager: item._id.toString()
				}
			});
			callback(err)
		})
	},
	// 获取需要用户信息
	function(callback) {
		TextList.map(function(item) {
			if(UserJosn[item['负责人']]) {
				TextJson[item['ASIN']] = UserJosn[item['负责人']]
			} else if(UserLack.indexOf(item['负责人']) == -1) {
				UserLack.push(item['负责人'])
			}
		});
		callback(null)
	},
	// 计算当前商品信息
	function(callback) {
		Merchandise.find({}, function(err, docs) {
			docs.map(function(item) {
				let TextItem = TextJson[item.asin];
				if(TextItem) {
					setMerchandise.push({
						_id: item._id,
						team_id: TextItem.team_id,
						manager: TextItem.manager
					})
				}
			});
			callback(err)
		})
	},
], function(err) {
	// 更新操作
	async.mapSeries(setMerchandise, function(item, callback) {
		Merchandise.update({
			_id: item._id
		}, {
			team_id: item.team_id,
			manager: item.manager,
			updatedAt: Date.now()
		}, function(err) {
			callback(err)
		})
	}, function(err) {
		console.log(UserLack)
	})
})