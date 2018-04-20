const app = require('../app');
const DB = require('../models/invincible');
const UpdateLog = DB.getModel('update-log');
const mongoose = require('mongoose');
const moment = require('moment');

module.exports = {
	name: 'system',

	// 最新版本号
	version(req, res) {
		let version = '0.0.1 Module';

		UpdateLog.find({}).limit(1).sort({
			createdAt: -1
		}).exec(function(err, docs) {
			if(docs.length) version = docs[0]['version'];
			res.success(version)
		})
	},

	// 推送日志内容
	pushChangeLog(req, res) {
		let loginUserId = req.agent.id;

		UpdateLog.find({}).limit(1).sort({
			createdAt: -1
		}).exec(function(err, docs) {
			if(docs.length && docs[0]['viewed'].indexOf(loginUserId) == -1) {
				UpdateLog.findOne({
					_id: docs[0]['_id']
				}, function(err, log) {
					log.viewed.push(loginUserId);
					log.save(function(err) {
						res.success(docs[0])
					})
				})
			} else {
				res.success()
			}
		})
	},

	// 更新日志列表
	updateLogs(req, res) {
		let limit = parseInt(req.query.limit) || 100;
		UpdateLog.find({}).sort({
			createdAt: -1
		}).limit(limit).exec(function(err, docs) {
			res.success(docs)
		})
	},

	// 添加日志内容
	addChangeLog(req, res) {
		let {
			content,
			version = '0.0.1 Module'
		} = req.body;

		new UpdateLog({
			content,
			version
		}).save(function(err, doc) {
			err ? res.error(err) : res.success(doc)
		})
	},

	// 编辑日志内容
	editChangeLog(req, res) {
		let {
			_id,
			content,
			version,
		} = req.body;

		UpdateLog.findOne({
			_id
		}, function(err, log) {
			log.version = version;
			log.content = content;
			log.save(function(err, doc) {
				err ? res.error(err) : res.success(doc)
			})
		})
	}

}