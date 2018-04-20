const mongoose = require('mongoose');
const moment = require('moment');
const async = require('async');
const DB = require('../models/invincible');
const Category = DB.getModel('category');
const Product = DB.getModel('product');
const UUID = require('uuid');

module.exports = {
	name: "product",
	// 产品信息
	productInfo: function(req, res) {
		const store_sku = req.query.store_sku || 'AAA-brief00001';
		Product.findOne({
			store_sku
		}).populate({
			path: 'categories',
			select: 'name shortName'
		}).populate({
			path: 'combination.store_sku',
			select: 'store_sku name_cn'
		}).exec(function(err, docs) {
			res.send(docs)
		})
	},
	// 产品列表
	productList: function(req, res) {
		const where = {};
		if(req.query.categories) where.categories = req.query.categories;
		if(req.query.name) {
			where.name = {
				$regex: req.query.name,
				$options: 'i'
			}
		};
		if(req.query.name_cn) {
			where.name_cn = {
				$regex: req.query.name_cn,
				$options: 'i'
			}
		};

		async.series({
			products: function(callback) {
				Product.find(where).populate({
					path: 'categories',
					select: 'name shortName'
				}).populate({
					path: 'combination.store_sku',
					select: 'store_sku name_cn'
				}).sort({
					deleted: 1,
					createdAt: -1
				}).exec(function(err, docs) {
					callback(err, docs)
				})
			},
			categories: function(callback) {
				Category.find({}, {
					name: 1,
					shortName: 1
				}).sort({
					name: 1
				}).exec(function(err, docs) {
					let list = [];
					docs.map(function(item) {
						list.push({
							_id: item._id,
							name: item.name + '(' + item.shortName + ')'
						})
					});
					callback(err, list)
				})
			}
		}, function(err, results) {
			res.send({
				result: results.products,
				categories: results.categories
			})
		})
	},
	// 产品添加
	productSave: function(req, res) {
		const account = req.agent.account;
		const name = req.body.name;
		const name_cn = req.body.name_cn;
		const name_brief = req.body.name_brief;
		const categories = req.body.categories;
		const categorieBrief = req.body.categorieBrief;
		const combination = req.body.combination || [];
		const nameBriefLength = name_brief.length;

		if(nameBriefLength > 5) res.send(500, 'The length is wrong');
		if(!name && !name_cn && !name_brief && !categories && !categorieBrief) res.send(500, 'Field is required');
		let nameBrief = name_brief;
		let store_sku = 'AAA-AAAAA00001';
		for(let i = 5; i > nameBriefLength; i--) {
			nameBrief += 0
		};

		async.series({
			sku: function(callback) {
				Product.find({}, {
					store_sku: 1
				}).sort({
					store_sku: -1
				}).exec(function(err, docs) {
					let sku = [];
					let index = '00001';
					let cBrief = categorieBrief.substring(categorieBrief.indexOf('(') + 1, categorieBrief.indexOf(')'));
					docs.map(function(item) {
						if(item['store_sku'].substring(0, item['store_sku'].indexOf('-')) == cBrief) {
							sku.push(item['store_sku'])
						}
					});
					sku.sort(function(x, y) {
						let a = x.substr(x.indexOf('-') + 6);
						let b = y.substr(y.indexOf('-') + 6);
						return b - a
					});
					if(sku.length) index = parseInt(sku[0].substr(sku[0].indexOf('-') + 6)) + 1 + '';
					for(let i = index.length; i < 5; i++) {
						index = 0 + index
					};
					store_sku = cBrief + '-' + nameBrief.toUpperCase() + index;
					callback(null)
				})
			},
			repeat: function(callback) {
				Product.findOne({
					$or: [{
						name_cn: name_cn
					}, {
						store_sku: store_sku
					}]
				}, function(err, product) {
					if(err) callback(err);
					product ? callback('Attribute repetition') : callback(null)
				})
			},
			save: function(callback) {
				new Product({
					name,
					name_cn,
					name_brief,
					store_sku,
					categories,
					combination,
					id: UUID.v4(),
					histories: [{
						head: account + ' 创建于 ' + moment().format('YYYY年MM月DD日 HH:mm:ss')
					}]
				}).save(function(err, doc) {
					err ? callback(err) : callback(null, doc)
				})
			}
		}, function(err, results) {
			err ? res.send(500, err) : res.send(results.save)
		})
	},
	// 产品更新
	productUpdate: function(req, res) {
		const account = req.agent.account;
		const name = req.body.name;
		const name_cn = req.body.name_cn;
		const combination = req.body.combination;
		const store_sku = req.body.store_sku;

		async.series({
			repeat: function(callback) {
				Product.findOne({
					name_cn,
					store_sku: {
						$ne: store_sku
					}
				}, function(err, product) {
					if(err) callback(err);
					product ? callback('Chinese name repetition') : callback(null)
				})
			},
			update: function(callback) {
				Product.findOne({
					store_sku
				}).populate({
					path: 'combination.store_sku',
					select: 'store_sku name_cn'
				}).exec(function(err, product) {
					if(err) callback(err);
					let content = '';
					if(product.name != name) {
						content += '【产品英文名】由：' + product.name + ' 变更为：' + name + '<br/>';
						product.name = name;
					};
					if(product.name_cn != name_cn) {
						content += '【产品中文名】由：' + product.name_cn + ' 变更为：' + name_cn + '<br/>';
						product.name_cn = name_cn;
					};
					let newCombination = {};
					let oldCombination = {};
					combination.map(function(item) {
						newCombination[item['store_sku']] = {
							count: item['count'],
							store_sku: item['index']
						}
					});
					product.combination.map(function(item) {
						oldCombination[item['store_sku']['_id']] = {
							count: item['count'],
							store_sku: item['store_sku']['store_sku']
						}
					});
					for(var key in newCombination) {
						if(oldCombination[key]) {
							if(oldCombination[key]['count'] != newCombination[key]['count']) {
								content += '【产品组合】' + newCombination[key]['store_sku'] + ' 数量由 ' + oldCombination[key]['count'] + ' 变更为：' + newCombination[key]['count'] + '<br/>';
							}
						} else {
							content += '【产品组合】新增 ' + newCombination[key]['store_sku'] + ' 数量 ' + newCombination[key]['count'] + '<br/>'
						}
					};
					for(var key in oldCombination) {
						if(!newCombination[key]) {
							content += '【产品组合】移除 ' + oldCombination[key]['store_sku'] + ' 数量 ' + oldCombination[key]['count'] + '<br/>'
						}
					};
					if(oldCombination != newCombination) {
						if(!combination.length) content += '产品改为不需要加工<br/>';
						product.combination = combination
					};
					if(content.length) {
						product.histories.push({
							head: account + ' 变更于 ' + moment().format('YYYY年MM月DD日 HH:mm:ss'),
							body: content
						})
					};
					product.save(function(err, doc) {
						err ? callback(err) : callback(null, doc)
					})
				})
			}
		}, function(err, results) {
			err ? res.send(500, err) : res.send(results.update)
		})
	},
	// 产品删除
	productRemove: function(req, res) {
		const account = req.agent.account;
		const store_sku = req.query.store_sku;
		Product.findOne({
			store_sku
		}, function(err, product) {
			if(err) res.send(500, err);
			if(product.deleted) {
				product.deleted = false;
				product.histories.push({
					head: account + ' 恢复于 ' + moment().format('YYYY年MM月DD日 HH:mm:ss')
				})
			} else {
				product.deleted = true;
				product.histories.push({
					head: account + ' 删除于 ' + moment().format('YYYY年MM月DD日 HH:mm:ss')
				})
			};
			product.save(function(err, doc) {
				err ? res.send(500, err) : res.send(doc)
			})
		})
	}
};