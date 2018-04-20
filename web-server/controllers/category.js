var debug = require('debug')('smartdo:controller:category');
var InvincibleDB = require('../models/invincible');
var Category = InvincibleDB.getModel('category');
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');

module.exports = {
	name: "category",
	// 品类列表
	categoryList: function(req, res) {
		Category.find({}).sort({
			name: 1
		}).exec(function(err, docs) {
			res.send(docs)
		})
	},
	// 品类添加
	categorySave: function(req, res) {
		let {
			name,
			shortName,
			chineseName
		} = req.body;

		shortName = shortName.toUpperCase();

		Category.findOne({
			name,
			shortName
		}, function(err, doc) {
			if(doc) {
				res.send(500, 'Field Name Repetition')
			} else {
				new Category({
					name,
					shortName,
					chineseName
				}).save(function(err, doc) {
					res.send(doc)
				})
			}
		})
	},
	// 品类更新
	categoryUpdate: function(req, res) {
		let {
			id,
			name,
			shortName,
			chineseName,
			updatedAt
		} = req.body;

		updatedAt = Date.now();
		shortName = shortName.toUpperCase();

		Category.findOne({
			_id: {
				$ne: mongoose.Types.ObjectId(id)
			},
			name,
			shortName
		}, function(err, doc) {
			if(doc) {
				res.send(500, 'Field Name Repetition')
			} else {
				Category.update({
					_id: id
				}, {
					name,
					shortName,
					chineseName,
					updatedAt
				}, function(err, doc) {
					res.send(doc)
				})
			}
		})
	},
	// 品类删除
	categoryRemove: function(req, res) {
		Category.remove({
			_id: req.query.id
		}, function(err, doc) {
			err ? res.error(err) : res.success(doc)
		})
	}
};