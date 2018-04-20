const moment = require('moment');
const async = require('async');
const DB = require('../models/invincible');
const Product = DB.getModel('product');
const Houses = DB.getModel('StoresHouses');
const Journals = DB.getModel('StoresJournals');
const Purchase = DB.getModel('purchase');
const Merchandise = DB.getModel('merchandise');
const MysqlEdw = require('../databases/mysql_edw');
const MysqlOds = require('../databases/mysql_ods');

module.exports = {
	name: "stores",

	// 仓库列表
	houseList: function(req, res) {
		Houses.find({}).sort({
			createdAt: -1
		}).exec(function(err, docs) {
			res.send(docs)
		})
	},
	// 仓库保存
	houseSave: function(req, res) {
		let name = req.body.name;
		new Houses({
			name
		}).save(function(err, doc) {
			err ? res.send(500, err) : res.send(doc)
		})
	},
	// 仓库更新
	houseUpdate: function(req, res) {
		let _id = req.body._id;
		let name = req.body.name;
		let updatedAt = Date.now();
		Houses.update({
			_id
		}, {
			name,
			updatedAt
		}, function(err, doc) {
			err ? res.send(500, err) : res.send(doc)
		})
	},

	// 库存列表
	storesList: function(req, res) {
		let productJson = {};
		let journalJson = {};
		let productList = [];
		let houseSelect = [];

		async.series([
			// 仓库选项
			function(callback) {
				Houses.find({}, ['name']).sort({
					name: 1
				}).exec(function(err, docs) {
					houseSelect = docs;
					callback(err)
				})
			},
			// 查询产品信息
			function(callback) {
				Product.find({}, ['id', 'name_cn', 'store_sku']).sort({
					createdAt: -1
				}).exec(function(err, docs) {
					docs.map(function(item) {
						productJson[item.id] = item
					});
					callback(err)
				})
			},
			// 查询库存记录
			function(callback) {
				Journals.aggregate([{
					$unwind: '$house'
				}, {
					$group: {
						_id: {
							pid: '$id',
							house: '$house'
						},
						unit: {
							$last: '$unit'
						},
						house: {
							$last: '$house'
						},
						stock: {
							$last: '$stock'
						},
						updatedAt: {
							$last: '$updatedAt'
						},
						list: {
							$push: {
								time: '$time',
								enter: '$enter'
							}
						}
					}
				}, {
					$sort: {
						updatedAt: -1
					}
				}]).exec(function(err, docs) {
					Houses.populate(docs, {
						path: 'house',
						select: 'name'
					}, function(err, populate) {
						populate.map(function(item) {
							let journal = {
								duration: 0,
								list: item.list,
								stock: item.stock
							};
							journal.list.sort(function(x, y) {
								return new Date(y.time) - new Date(x.time)
							});
							if(item.stock) {
								for(let i = 0; i < journal.list.length; i++) {
									let value = journal.stock -= journal.list[i]['enter'];
									if(value <= 0) {
										let time = new Date() - new Date(journal.list[i]['time']);
										journal.duration = Math.floor(time / 86400000);
										break
									} else {
										let time = new Date() - new Date(journal.list[i]['time']);
										journal.duration = Math.floor(time / 86400000)
									}
								}
							};
							let info = {
								unit: item.unit,
								stock: item.stock,
								house: item.house.name,
								updatedAt: item.updatedAt,
								duration: journal.duration
							};
							if(journalJson[item._id.pid]) journalJson[item._id.pid].push(info);
							else journalJson[item._id.pid] = [info];
						});
						callback(err)
					})
				})
			},
		], function(err, results) {
			// 关联产品和库存记录
			for(var key in productJson) {
				let item = journalJson[key];
				let getStock = list => {
					let stock = 0;
					list.map(function(item) {
						stock += item.stock
					});
					return stock
				};
				productList.push({
					id: productJson[key]['id'],
					name: productJson[key]['name_cn'],
					sku: productJson[key]['store_sku'],
					unit: item ? item[0]['unit'] : null,
					updatedAt: item ? item[0]['updatedAt'] : null,
					stock: item ? getStock(journalJson[key]) : 0,
					journals: journalJson[key]
				})
			};
			productList.sort(function(x, y) {
				return new Date(y.updatedAt) - new Date(x.updatedAt)
			});
			res.send({
				houseSelect,
				productList
			})
		})
	},
	// 库存登记
	storesRegister: function(req, res) {
		let data = {
			id: req.body.id,
			unit: req.body.unit,
			note: req.body.note,
			time: req.body.time,
			house: req.body.house,
			stock: parseInt(req.body.stock) || 0,
			enter: parseInt(req.body.enter) || 0,
			output: parseInt(req.body.output) || 0,
			updatedAt: moment().format("YYYY-MM-DD HH:mm:ss")
		};

		Journals.find({
			id: data.id,
			house: data.house
		}).sort({
			updatedAt: -1
		}).exec(function(err, docs) {
			if(docs.length) {
				data.stocked = docs[0]['stock'];
				data.stock = docs[0]['stock'] + data.enter - data.output;
			} else {
				data.stocked = 0;
				data.stock = data.enter - data.output;
			};
			new Journals(data).save(function(err, doc) {
				err ? res.send(500, err) : res.send(doc)
			})
		})
	},
	// 库存记录
	storesJournal: function(req, res) {
		let id = req.query.id;
		let house = req.query.house;
		let startTime = req.query.startTime || moment().subtract(1, 'days').format("YYYY-MM-DD");
		let endTime = req.query.endTime || moment().format("YYYY-MM-DD");

		Product.findOne({
			id
		}, function(err, product) {
			Journals.find({
				id,
				time: {
					$gte: startTime,
					$lte: endTime
				}
			}).populate({
				path: 'house',
				select: 'name'
			}).sort({
				updatedAt: -1
			}).exec(function(err, journals) {
				let list = [];
				journals.map(function(item) {
					let info = {
						id: product['id'],
						sku: product['store_sku'],
						name: product['name_cn'],
						unit: item['unit'],
						stock: item['stock'],
						stocked: item['stocked'],
						time: item['time'],
						enter: item['enter'],
						output: item['output'],
						note: item['note'],
						house: item['house']['name'],
						updatedAt: item['updatedAt']
					};
					if(house && house == item['house']['_id']) {
						list.push(info)
					} else if(!house) {
						list.push(info)
					};
				});
				res.send(list)
			})
		})
	},
	// 库存汇总
	storeSummary: function(req, res) {
		let sort = req.query.sort || 'total_qty:DESC';
		let sortIndex = sort.split(':')[0];
		let sortValue = sort.split(':')[1];
		let msku = req.query.msku;
		let cn_name = req.query.cn_name;
		let store_sku = req.query.store_sku;
		let shop_name = req.query.shop_name;
		let currentPage = parseInt(req.query.currentPage) || 1;
		let pageSize = parseInt(req.query.pageSize) || 10;
		let dataDt = moment().format('YYYY-MM-DD');
		let storeSkuJson = {};
		let storeSkuList = [];
		async.series([
			function(callback) {
				let sql = 'SELECT data_dt FROM ws_rmp_warehouse_stock_sum ORDER BY data_dt DESC LIMIT 1';
				MysqlEdw.query(sql, function(err, docs) {
					if(docs[0]) dataDt = moment(docs[0]['data_dt']).format('YYYY-MM-DD');
					callback(err)
				})
			},
			function(callback) {
				let sql = `SELECT * FROM ws_rmp_warehouse_stock_sum WHERE data_dt='${dataDt}' ORDER BY ${sortIndex} ${sortValue}`;
				if(msku) sql = sql.replace('ORDER', `AND msku LIKE '%${msku}%' ORDER`);
				if(cn_name) sql = sql.replace('ORDER', `AND cn_name LIKE '%${cn_name}%' ORDER`);
				if(store_sku) sql = sql.replace('ORDER', `AND store_sku LIKE '%${store_sku}%' ORDER`);
				if(shop_name) sql = sql.replace('ORDER', `AND shop_name LIKE '%${shop_name}%' ORDER`);
				
				console.log(sql)
				
				MysqlEdw.query(sql, function(err, docs) {
					docs.map(function(item) {
						if(storeSkuJson[item.store_sku]) {
							storeSkuJson[item.store_sku].fba_return_qty.push(item.fba_return_qty)
							storeSkuJson[item.store_sku].fba_transport_qty.push(item.fba_transport_qty)
							storeSkuJson[item.store_sku].fba_stock_qty.push(item.fba_stock_qty)
							storeSkuJson[item.store_sku].msku.push(item.msku)
							storeSkuJson[item.store_sku].shop_name.push(item.shop_name)
						} else {
							storeSkuJson[item.store_sku] = {
								store_sku: item.store_sku,
								cn_name: item.cn_name,
								product_qty: item.product_qty,
								transport_qty: item.transport_qty,
								panyu_stock_qty: item.panyu_stock_qty,
								virtual_stock_qty: item.virtual_stock_qty,
								overseas_transport_qty: item.overseas_transport_qty,
								fba_return_qty: [item.fba_return_qty],
								overseas_stock_qty: item.overseas_stock_qty,
								fba_transport_qty: [item.fba_transport_qty],
								fba_stock_qty: [item.fba_stock_qty],
								msku: [item.msku],
								shop_name: [item.shop_name],
								total_qty: item.total_qty
							}
						}
					});
					callback(err)
				})
			}
		], function(err) {
			for(let key in storeSkuJson) {
				storeSkuList.push(storeSkuJson[key])
			};
			// 分页
			let pagination = [];
			for(let i = (currentPage - 1) * pageSize; i < currentPage * pageSize; i++) {
				if(storeSkuList[i]) pagination.push(storeSkuList[i])
			};
			res.send({
				pageSize,
				currentPage,
				list: pagination,
				total: storeSkuList.length
			})
		})
	},
	// 库存汇总-海外仓
	storeOverseas: function(req, res) {
		let store_sku = req.query.store_sku || '';
		let dataDt = moment().format('YYYY-MM-DD');

		async.series([
			function(callback) {
				let sql = 'SELECT data_dt FROM ws_rmp_warehouse_stock_overseas ORDER BY data_dt DESC LIMIT 1';
				MysqlEdw.query(sql, function(err, docs) {
					if(docs[0]) dataDt = moment(docs[0]['data_dt']).format('YYYY-MM-DD');
					callback(err)
				})
			},
			function(callback) {
				let sql = `SELECT warehouse_name, overseas_stock_qty FROM ws_rmp_warehouse_stock_overseas WHERE data_dt='${dataDt}' AND store_sku = '${store_sku}'`;
				MysqlEdw.query(sql, function(err, docs) {
					res.send(err || docs)
					callback(err)
				})
			}
		])
	},
	// 库存汇总-采购订单
	storePurchases: function(req, res) {
		let store_sku = req.query.store_sku || '';
		let storeSkuJson = {};
		async.series([
			function(callback) {
				let sql = `SELECT * FROM ods_erp_purchase_info WHERE store_sku = '${store_sku}'`;
				MysqlOds.query(sql, function(err, docs) {
					let purchase_quantity = 0;
					let actual_quantity = 0;
					docs.map(function(item) {
						purchase_quantity += item.purchase_quantity;
						actual_quantity += (item.inventory_quantity + item.deliver_quantity);
						storeSkuJson[item.purchase_id] = {
							purchase_id: item.purchase_id,
							purchase_quantity: 0,
							plan_deliver_date: [],
							plan_deliver_quantity: [],
							actual_quantity: 0,
							difference: 0
						}
					});
					for(let key in storeSkuJson) {
						storeSkuJson[key].purchase_quantity = purchase_quantity;
						storeSkuJson[key].actual_quantity = actual_quantity;
						storeSkuJson[key].difference = purchase_quantity - actual_quantity;
					};
					callback(err)
				})
			},
			function(callback) {
				let sql = `SELECT * FROM ods_erp_purchase_deliver_plan WHERE store_sku = '${store_sku}'`;
				MysqlOds.query(sql, function(err, docs) {
					docs.map(function(item) {
						let plan_deliver_date = moment(item.plan_deliver_date).format('YYYY-MM-DD');
						storeSkuJson[item.purchase_id].plan_deliver_date.push(plan_deliver_date)
						storeSkuJson[item.purchase_id].plan_deliver_quantity.push(item.plan_deliver_quantity)
					});
					callback(err)
				})
			}
		], function(err) {
			res.send(storeSkuJson)
		})
	}
}