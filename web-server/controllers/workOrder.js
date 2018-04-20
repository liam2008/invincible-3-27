var debug = require('debug')('smartdo:controller:workOrder');
var app = require('../app');
var UUID = require('uuid');
var ServerError = require('../errors/server-error');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var moment = require('moment');
var MysqlADC = require('../databases/db.mysql.ADC');
var InvincibleDB = require('../models/invincible');
var OperativeCustomer = InvincibleDB.getModel('operativeCustomer');
var WorkOrder = InvincibleDB.getModel('workOrder');
var WorkOrderType = InvincibleDB.getModel('workOrderType');
var WorkOrderAllot = InvincibleDB.getModel('workOrderAllot');
var WorkOrderGoods = InvincibleDB.getModel('workOrderGoods');
var WorkOrderNotice = InvincibleDB.getModel('workOrderNotice');
var User = InvincibleDB.getModel('user');
var Shop = InvincibleDB.getModel('shops');
var DailySell = InvincibleDB.getModel('daily_sell');
var Merchandise = InvincibleDB.getModel('merchandise');
var StoresJournals = InvincibleDB.getModel('StoresJournals');
var PadLeft = require('padleft');
var Team = InvincibleDB.getModel('team');

var Shared = require('../../shared/');
var ERROR_CODE = Shared.ERROR;
var MESSAGE = Shared.MESSAGE;
var Utils = Shared.Utils;
var dealErr = require('../errors/controller-error');

module.exports = {
	name: "workOrder",

	customerList: function(req, res, next) {
		var findCondition = null;
		var subFilter = req.subfilterOperativeCustomer || {};
		if(subFilter.view == "*") {
			findCondition = {};
		} else if(subFilter.view != null) {
			findCondition = {
				customer_id: subFilter.view
			};
		} else {
			res.error(ERROR_CODE.ACCESS_DENIED);
			return;
		}

		if(req.query.teamID) findCondition.operate_team = mongoose.Types.ObjectId(req.query.teamID);
		if(req.query.orderType) {
			if(typeof(req.query.orderType) == "number") {
				findCondition.work_order_type = req.query.orderType;
			} else {
				findCondition.work_order_type = Utils.toNumber(req.query.orderType);
			}
		}

		var results = {};
		async.series([
				// 运营客服
				function(callB) {
					OperativeCustomer.find(findCondition)
						.sort({
							operateTeam: 1
						})
						.populate("customer_id")
						.populate("operate_team")
						.exec(function(err, customerFounds) {
							if(dealErr.findErr(err, res)) return callB(err);
							var list = [];
							customerFounds.forEach(function(customerFound) {
								var result = {};
								result.WOCustomerID = customerFound._id;
								if(customerFound.operate_team) {
									result.operateTeam = {
										id: customerFound.operate_team.id,
										name: customerFound.operate_team.name
									};
								} else {
									result.operateTeam = "全部";
								}
								if(customerFound.customer_id) result.customer = {
									id: customerFound.customer_id._id,
									name: customerFound.customer_id.name
								};
								result.WOType = customerFound.work_order_type;
								list.push(result);
							});
							results.list = list;
							callB(null);
						})
				},

				function(callB) {
					Team.getSurviving(function(err, docs) {
						let send = [];
						docs.forEach(function(row) {
							send.push({
								_id: row._id,
								name: row.name
							})
						});
						results.team = send;
						callB(err)
					})
				},

				function(callB) {
					var customers = [];
					User.find({
						role: mongoose.Types.ObjectId("5a264d69c4d23f1fcdb62191")
					}).populate("customer_id").exec(function(err, customerFounds) {
						if(dealErr.findErr(err, res)) return callB(err);
						customerFounds.forEach(function(customerFound) {
							var customer = {
								id: customerFound._id,
								name: customerFound.name
							};
							customers.push(customer);
						});
						results.customers = customers;
						callB(null);
					})
				}
			],
			function(err) {
				if(err) {
					debug(new Error(err));
					return;
				}
				res.success(results);
			}
		)
	},

	saveCustomer: function(req, res, next) {
		var subFilter = req.subfilterOperativeCustomer || {};
		if(!subFilter.add) {
			res.error(ERROR_CODE.ACCESS_DENIED);
			return;
		}
		if(!req.body.customerID) return res.error(ERROR_CODE.MISSING_ARGUMENT);
		if(req.body.customerID) var customer_id = mongoose.Types.ObjectId(req.body.customerID);
		if(req.body.operateTeam) var operate_team = mongoose.Types.ObjectId(req.body.operateTeam);
		if(req.body.WOType) var work_order_type = req.body.WOType;

		async.series([
			function(callB) {
				let where = {};
				if(customer_id) where.customer_id = customer_id;
				if(operate_team) where.operate_team = operate_team;
				if(work_order_type) where.work_order_type = work_order_type;
				OperativeCustomer.find(where, function(err, docs) {
					if(docs.length) {
						res.error(ERROR_CODE.ALREADY_EXISTS);
						callB(ERROR_CODE.ALREADY_EXISTS);
					} else {
						callB(err)
					}
				})
			},
			function(callB) {
				var customer = new OperativeCustomer({
					_id: new mongoose.Types.ObjectId(),
					customer_id, // 客服专员
					operate_team, // 运营小组
					work_order_type, // 工单类型
					createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
					updatedAt: moment().format("YYYY-MM-DD HH:mm:ss")
				});
				customer.save(function(err) {
					if(dealErr.createErr(err, res)) return callB(err);
					callB(null);
				})
			}
		], function(err) {
			if(err) {
				debug(new Error(err));
				res.error(err);
				return;
			}
			res.success();
		})
	},

	updateCustomer: function(req, res, next) {
		var subFilter = req.subfilterOperativeCustomer || {};
		if(!subFilter.edit) {
			res.error(ERROR_CODE.ACCESS_DENIED);
			return;
		}
		if(!req.body.customerID) return res.error(ERROR_CODE.MISSING_ARGUMENT);
		if(req.body.customerID) var customer_id = mongoose.Types.ObjectId(req.body.customerID);
		if(req.body.operateTeam) var operate_team = mongoose.Types.ObjectId(req.body.operateTeam);
		if(req.body.WOType) var work_order_type = req.body.WOType;
		if(req.body.WOCustomerID) var WOCustomerID = mongoose.Types.ObjectId(req.body.WOCustomerID);

		async.series([
			function(callB) {
				let where = {};
				if(customer_id) where.customer_id = customer_id;
				if(operate_team) where.operate_team = operate_team;
				if(work_order_type) where.work_order_type = work_order_type;
				OperativeCustomer.find(where, function(err, docs) {
					if(docs.length) {
						res.error(ERROR_CODE.ALREADY_EXISTS);
						callB(ERROR_CODE.ALREADY_EXISTS);
					} else {
						callB(err)
					}
				})
			},
			function(callB) {
				OperativeCustomer.findOne({
					_id: WOCustomerID
				}, function(err, doc) {
					doc.customer_id = customer_id;
					doc.operate_team = operate_team;
					doc.work_order_type = work_order_type;
					doc.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
					doc.save(function(err) {
						if(dealErr.createErr(err, res)) return callB(err);
						callB(null);
					})
				})
			}
		], function(err) {
			if(err) {
				debug(new Error(err));
				res.error(err);
				return;
			}
			res.success();
		})
	},

	deleteCustomer: function(req, res, next) {
		var subFilter = req.subfilterOperativeCustomer || {};
		if(!subFilter.delete) {
			res.error(ERROR_CODE.ACCESS_DENIED);
			return;
		}

		if(!req.body.WOCustomerID) return res.error(ERROR_CODE.MISSING_ARGUMENT);
		req.body.WOCustomerID = mongoose.Types.ObjectId(req.body.WOCustomerID);
		var findRequire = {
			_id: req.body.WOCustomerID
		};
		OperativeCustomer.remove(findRequire, function(err) {
			if(dealErr.removeErr(err, res)) return debug(new Error(err));
			res.success();
		})
	},

	dealOrder: function(req, res, next) {
		var subFilter = req.subfilterWorkOrder || {};
		if(!subFilter.edit) {
			res.error(ERROR_CODE.ACCESS_DENIED);
			return;
		}

		// 转派人
		var handlerID;
		if(req.body.handlerID) handlerID = mongoose.Types.ObjectId(req.body.handlerID);
		if(!req.body.id || !req.body.state || (!handlerID && req.body.state != 2)) return res.error(ERROR_CODE.MISSING_ARGUMENT);
		if(typeof(req.body.state) != "number") req.body.state = Utils.toNumber(req.body.state);

		req.body.id = mongoose.Types.ObjectId(req.body.id);

		async.series([
				function(callB) {
					var findRequire = {
						_id: req.body.id
					};
					WorkOrder.findOne(findRequire, function(err, orderFound) {
						if(dealErr.findErr(err, res)) return callB(err);
						if(orderFound) {
							if(orderFound.history[0]) {
								if((orderFound.history[0].to.toString()) == (handlerID + "")) {
									res.error(ERROR_CODE.INVALID_ARGUMENT);
									callB(ERROR_CODE.INVALID_ARGUMENT);
									return;
								}
								var log = req.body.log || "";
								var remark = req.body.remark || "";
								var history = {
									log: log,
									remark: remark,
									from: mongoose.Types.ObjectId(subFilter.edit),
									dealtAt: moment().format("YYYY-MM-DD HH:mm:ss")
								};
								if(handlerID) history.to = handlerID;
								orderFound.history.unshift(history);
								if(handlerID) {
									orderFound.handler = handlerID;
								} else {
									orderFound.handler = null;
								}
								orderFound.handle = 0;
								orderFound.state = req.body.state;
								orderFound.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss")
								orderFound.save(function(err) {
									if(dealErr.updateErr(err, res)) return callB(err);
									callB(null);
								})
							} else {
								res.error(ERROR_CODE.DB_ERROR);
								callB(ERROR_CODE.DB_ERROR);
							}
						} else {
							res.error(ERROR_CODE.NOT_EXISTS);
							callB(ERROR_CODE.NOT_EXISTS);
						}
					})
				}
			],
			function(err) {
				if(err) {
					debug(new Error(err));
					return;
				}
				res.success();
			}
		)
	},

	// 创建工单
	workOrderCreate: function(req, res) {
		var assestManager = app.getService('AssetsManager');
		var subFilter = req.subfilterCreateOrder || {};
		if(!subFilter.add) {
			res.error(ERROR_CODE.ACCESS_DENIED);
			return;
		};
		if(!req.body.operateTeam || !req.body.WOType || !req.body.content) return res.error(ERROR_CODE.MISSING_ARGUMENT);

		var WOType = req.body.WOType;
		var content = req.body.content;
		var operateTeam = req.body.operateTeam;
		var asin = req.body.asin;
		var shop_name = req.body.shop_name;
		var fileInfo = req.body.fileInfo;

		var handlingHours = null;
		var reminderHours = null;
		var kufuzhuguan = null;
		var customerJson = {};
		var fileInfoOss = [];
		var orderID = moment().format("YYYYMMDD") + '0001';

		async.series([
			// 上传文件OSS
			function(callback) {
				async.mapSeries(fileInfo, function(item, cb) {
					var uuid = UUID.v4();
					var data = item.data;
					var name = item.name;
					var type = name.substr(name.lastIndexOf('.') + 1);
					assestManager.putWorkFile({
						uuid,
						name,
						type,
						data
					}, function(err, result) {
						fileInfoOss.push({
							uuid,
							name,
							user: subFilter.add
						});
						cb(err)
					})
				}, function(err) {
					callback(err)
				})
			},
			// 获取客服主管
			function(callback) {
				User.findOne({
					role: mongoose.Types.ObjectId("5a265adac4d23f1fcdb621f1")
				}, function(err, docs) {
					if(docs) kufuzhuguan = docs._id;
					callback(err)
				})
			},
			// 获取工单处理人
			function(callback) {
				WorkOrderAllot.find({}).populate({
					path: 'goods',
					select: 'merchandise',
					populate: [{
						path: 'merchandise',
						select: 'asin'
					}]
				}).exec(function(err, docs) {
					docs.map(function(item) {
						if(item.goods) {
							if(item.goods.merchandise.length) {
								item.goods.merchandise.map(function(m) {
									customerJson[m.asin + item.type] = item.customer
								})
							} else {
								customerJson[item.type] = item.customer
							}
						}
					});
					callback(err)
				})
			},
			// 生成工单编号
			function(callback) {
				var regExp = new RegExp(moment().format("YYYYMMDD"));
				var findRequire = {
					order_id: regExp
				};
				WorkOrder.count(findRequire, function(err, OrderCount) {
					if(dealErr.findErr(err, res)) return callB(err);
					orderID = (OrderCount + 1).toString();
					if(orderID.length < 4) orderID = moment().format("YYYYMMDD") + orderID.padLeft(4, '0');
					callback(null);
				});
			},
			// 查询截止时间
			function(callback) {
				WorkOrderType.findOne({
					type: WOType
				}, ['handlingHours', 'reminderHours'], function(err, docs) {
					handlingHours = docs.handlingHours;
					reminderHours = docs.reminderHours;
					callback(err)
				})
			}
		], function(err) {
			var handlingTime = null;
			var reminderTime = null;
			var handler = customerJson[(asin || '') + WOType] || kufuzhuguan;
			if(handlingHours) {
				handlingTime = moment().add(handlingHours, 'Hours').format('YYYY-MM-DD HH:mm:ss')
			};
			if(reminderHours) {
				reminderTime = moment().add(reminderHours, 'Hours').format('YYYY-MM-DD HH:mm:ss')
			};
			new WorkOrder({
				_id: mongoose.Types.ObjectId(),
				team_id: mongoose.Types.ObjectId(operateTeam),
				creator: mongoose.Types.ObjectId(subFilter.add),
				order_id: orderID,
				type: WOType,
				asin: asin,
				shop_name: shop_name,
				content: content,
				handler: handler,
				history: [{
					log: '',
					from: subFilter.add,
					to: handler
				}],
				fileInfo: fileInfoOss,
				state: 0,
				handlingTime: handlingTime,
				reminderTime: reminderTime,
				createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
				updatedAt: moment().format("YYYY-MM-DD HH:mm:ss")
			}).save(function(err, docs) {
				if(dealErr.createErr(err, res)) return callB(err);
				res.success(docs);
			})
		})
	},

	// 批量转派
	dealOrders: function(req, res) {
		var subFilter = req.subfilterWorkOrder || {};
		if(!subFilter.edit) {
			res.error(ERROR_CODE.ACCESS_DENIED);
			return
		};

		let ids = req.body.ids;
		let handler = req.body.handler;
		let remark = req.body.remark;
		let log = req.body.log;

		async.mapSeries(ids, function(item, callback) {
			WorkOrder.findOne({
				_id: item
			}, function(err, orderFound) {
				// 是否完结还是转派
				if(log && !handler) {
					orderFound.state = 2;
					orderFound.handler = null;
					orderFound.history.unshift({
						log,
						to: mongoose.Types.ObjectId(handler),
						from: mongoose.Types.ObjectId(subFilter.edit),
						dealtAt: moment().format('YYYY-MM-DD HH:mm:ss')
					});
					orderFound.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
					orderFound.save(function(err) {
						callback(err)
					})

				} else {
					// 是否重复转派同一人
					if(orderFound.history[0].to.toString() != handler) {
						orderFound.state = 1;
						orderFound.handle = 0;
						orderFound.handler = handler;
						orderFound.history.unshift({
							remark,
							to: mongoose.Types.ObjectId(handler),
							from: mongoose.Types.ObjectId(subFilter.edit),
							dealtAt: moment().format('YYYY-MM-DD HH:mm:ss')
						});
						orderFound.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
						orderFound.save(function(err) {
							callback(err)
						})
					} else {
						orderFound.state = 1;
						orderFound.handle = 0;
						orderFound.handler = handler;
						orderFound.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
						orderFound.save(function(err) {
							callback(err)
						})
					}
				}
			})
		}, function(err) {
			res.success();
		})
	},

	// 创建工单需求数据
	orderReady: function(req, res, next) {
		let team = [];
		let type = [];
		let asin = [];
		let shop = [];
		async.series([
			function(callback) {
				Team.getSurviving(function(err, docs) {
					let send = [];
					docs.forEach(function(row) {
						send.push({
							_id: row._id,
							name: row.name
						})
					});
					team = send;
					callback(err)
				})
			},
			function(callback) {
				WorkOrderType.find({
					type: {
						$nin: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
					}
				}, ['name', 'type', 'tips', 'isAsin', 'remark']).sort({
					type: -1
				}).exec(function(err, docs) {
					type = docs;
					callback(err)
				})
			},
			function(callback) {
				Merchandise.distinct('asin', function(err, docs) {
					asin = docs;
					callback(err)
				})
			},
			function(callback) {
				Shop.distinct('name', function(err, docs) {
					shop = docs;
					callback(err)
				})
			}
		], function(err) {
			res.send({
				team,
				type,
				asin,
				shop
			})
		})
	},

	// 工单详情
	openOrder: function(req, res, next) {
		let assestManager = app.getService('AssetsManager');
		if(!req.query.id) return res.error(ERROR_CODE.MISSING_ARGUMENT);
		WorkOrder.findOne({
			_id: req.query.id
		}).populate({
			path: 'creator',
			select: 'name'
		}).populate({
			path: 'team_id',
			select: 'name'
		}).populate({
			path: 'history.from',
			select: 'name'
		}).populate({
			path: 'history.to',
			select: 'name'
		}).populate({
			path: 'fileInfo.user',
			select: 'name'
		}).exec(function(err, docs) {
			if(!docs) res.error(ERROR_CODE.NOT_EXISTS);
			let history = [];
			docs.history.map(function(item) {
				history.splice(0, 0, {
					remark: item.remark,
					dealtLog: item.log,
					dealtAt: item.dealtAt || docs.createdAt,
					dealer: item.to ? item.to.name : '预警机器人',
					handler: item.from ? item.from.name : '预警机器人'
				})
			});
			if(docs.state == 2) history[history.length - 1]['state'] = 2;
			let type = docs['type'] >= 100 ? docs['type'] : '00' + docs['type'];
			let fileInfo = [];
			docs.fileInfo.map(function(item) {
				var type = item.name.substr(item.name.lastIndexOf('.') + 1);
				fileInfo.push({
					_id: item._id,
					name: item.name,
					path: assestManager.getWorkUrl(item.uuid, type, true),
					user: item.user ? item.user : '不存在',
					createdAt: item.createdAt
				})
			});
			res.send({
				history,
				fileInfo,
				state: docs.state,
				content: docs.content,
				createdAt: docs.createdAt,
				type: docs.data ? docs.data.type : type,
				operateTeam: docs.team_id ? docs.team_id.name : '',
				creator: docs.creator ? docs.creator.name : '预警机器人'
			})
		})
	},

	// 保存备注
	saveRemark: function(req, res, next) {
		if(!req.body._id) res.error(ERROR_CODE.MISSING_ARGUMENT);
		async.series({
			save: function(callback) {
				WorkOrder.findOne({
					_id: req.body._id
				}, function(err, work) {
					if(err || !work) callback(ERROR_CODE.FIND_FAILED);
					work.remarks.unshift({
						writer: req.agent.id,
						content: req.body.content
					});
					work.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
					work.save(function(err, doc) {
						err ? callback(ERROR_CODE.UPDATE_FAILED) : callback(null)
					})
				})
			},
			info: function(callback) {
				WorkOrder.findOne({
					_id: req.body._id
				}).populate({
					path: 'remarks.writer',
					select: 'name'
				}).exec(function(err, work) {
					err ? callback(ERROR_CODE.UPDATE_FAILED) : callback(null, work)
				})
			}
		}, function(err, results) {
			err ? res.error(err) : res.send(results.info['remarks'])
		})
	},
	// 处理状态
	handle: function(req, res) {
		if(!req.body._id) res.error(ERROR_CODE.MISSING_ARGUMENT);
		WorkOrder.findOne({
			_id: req.body._id
		}, function(err, work) {
			if(work.handle) {
				work.handle = 0;
				work.handleTime = null;
			} else {
				work.handle = 1;
				work.handleTime = moment().format('YYYY-MM-DD HH:mm:ss');
			};
			work.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
			work.save(function(err, doc) {
				err ? res.error(ERROR_CODE.UPDATE_FAILED) : res.send(doc)
			})
		})
	},
	// 待处理列表
	newOrders: function(req, res) {
		var pageSize = parseInt(req.query.pageSize) || 10;
		var currentPage = parseInt(req.query.currentPage) || 1;
		var where = {};
		var subFilter = req.subfilterWorkOrder || {};
		if(subFilter.view != '*' && subFilter.view != null) {
			where = {
				handler: {
					$in: subFilter.view
				}
			}
		} else if(subFilter.view != '*') {
			res.error(ERROR_CODE.ACCESS_DENIED)
		};
		where.state = {
			$nin: [2]
		};
		if(req.query.asin) {
			where['data.ASIN'] = {
				$regex: req.query.asin,
				$options: 'i'
			}
		};
		if(req.query.orderId) {
			where.order_id = {
				$regex: req.query.orderId,
				$options: 'i'
			}
		};
		if(req.query.startTime) {
			where.createdAt = {
				$gte: new Date(req.query.startTime)
			}
		};
		if(req.query.endTime) {
			var time = new Date(req.query.endTime);
			time.setDate(time.getDate() + 1);
			where.createdAt = {
				$lte: new Date(time)
			}
		};
		if(req.query.startTime && req.query.endTime) {
			var time = new Date(req.query.endTime);
			time.setDate(time.getDate() + 1);
			where.createdAt = {
				$gte: new Date(req.query.startTime),
				$lte: new Date(time)
			}
		};
		if(req.query.handle && req.query.handle === '0') {
			where.$or = [{
				handle: null
			}, {
				handle: parseInt(req.query.handle)
			}]
		};
		if(req.query.handle && req.query.handle === '1') {
			where.handle = parseInt(req.query.handle)
		};
		var types = req.query.type;
		if(types && typeof types == 'string') {
			if(types.length >= 3) {
				where['type'] = parseInt(types)
			} else {
				where['data.type'] = parseInt(types)
			}
		} else if(types) {
			var typeIn = {
				type: {
					$in: []
				}
			};
			var dataTypeIn = {
				'data.type': {
					$in: []
				}
			};
			where.$or = [];
			for(var i = 0; i < types.length; i++) {
				if(types[i].length >= 3) {
					typeIn.type.$in.push(parseInt(types[i]))
				} else {
					dataTypeIn['data.type'].$in.push(parseInt(types[i]))
				}
			};
			if(typeIn.type.$in.length) where.$or.push(typeIn);
			if(dataTypeIn['data.type'].$in.length) where.$or.push(dataTypeIn);
		};
		var customers = [];
		var pageCount = 1;
		var teamJson = {};
		var workOrder = {};
		var dailySell = {};
		var merchandise = {};
		var findCreator = [];
		var findHandler = [];
		var findTreated = [];
		async.series([
			// 获取用户
			function(callback) {
				User.find({}, ['name', 'team', 'role']).populate({
					path: 'role',
					select: 'type'
				}).exec(function(err, docs) {
					docs.map(function(item) {
						if(req.query.creator && item.name.indexOf(req.query.creator) != -1) {
							findCreator.push(item._id);
							where.creator = {
								$in: findCreator
							};
						}
						if(req.query.handler && item.name.indexOf(req.query.handler) != -1) {
							findHandler.push(item._id);
							where.handler = {
								$in: findHandler
							};
						}
						if(req.query.treated && item.name.indexOf(req.query.treated) != -1) {
							findTreated.push(item._id);
							if(where['history.from']) {
								where['history.from']['$in'].concat(findTreated)
							} else {
								where['history.from'] = {
									$in: findTreated
								}
							};
						}
						if(item.role && ['CSDMember', 'CSDDirector', 'member', 'leader'].indexOf(item.role.type) != -1) {
							if(item.role.type == 'leader') teamJson[item.team] = item.name;
							customers.push({
								_id: item._id,
								name: item.name
							})
						}
					});
					callback(err)
				})
			},
			// 获取工单信息
			function(callback) {
				WorkOrder.find(where).sort({
					handlingTime: -1,
					reminderTime: -1,
					order_id: -1
				}).skip((currentPage - 1) * pageSize).limit(pageSize).populate({
					path: 'creator',
					select: 'name'
				}).populate({
					path: 'handler',
					select: 'name'
				}).populate({
					path: 'team_id',
					select: 'name'
				}).populate({
					path: 'remarks.writer',
					select: 'name'
				}).exec(function(err, docs) {
					docs.map(function(item) {
						if(item['team_id']) {
							item.team_name = item['team_id']['name'];
							item.leader = teamJson[item['team_id']['_id']];
						};
						workOrder[item.order_id] = item;
					});
					callback(null)
				})
			},
			// 获取商品信息
			function(callback) {
				Merchandise.find({}, ['asin', 'state', 'shop_name', 'store_sku', 'shop_id', 'team_id', 'product_id']).populate({
					path: 'team_id',
					select: 'name'
				}).populate({
					path: 'shop_id',
					select: 'name'
				}).populate({
					path: 'product_id',
					select: 'name_cn'
				}).exec(function(err, docs) {
					docs.map(function(item) {
						if(item['team_id']) {
							item.team_name = item['team_id']['name'];
							item.leader = teamJson[item['team_id']['_id']];
						};
						if(item['shop_id']) {
							item.shop_name = item['shop_id']['name'];
						};
						merchandise[item.asin] = item;
					});
					callback(null)
				})
			},
			// 获取FBA库存 
			function(callback) {
				DailySell.aggregate([{
					$group: {
						_id: '$asin',
						sstock: {
							$last: '$sellable_stock'
						},
						tstock: {
							$last: '$transport_stock'
						}
					}
				}]).exec(function(err, docs) {
					docs.map(function(item) {
						dailySell[item._id] = (item.sstock || 0) + (item.tstock || 0)
					});
					callback(err)
				})
			},
			// 获取类型统计
			function(callback) {
				WorkOrder.count(where, function(err, count) {
					pageCount = Math.ceil(count / pageSize);
					callback(null)
				})
			}
		], function(err, results) {
			let list = [];
			let states = ["停售", "未开售", "推广期", "在售期", "清仓期", "归档", "备用"];
			for(let key in workOrder) {
				let work = workOrder[key];
				let asin = work['asin'];
				let type = null;
				let handlingTime = null;
				let reminderTime = null;
				if(work['data']) {
					asin = work['data']['ASIN'];
					type = work['data']['type'];
				};
				let merchan = merchandise[asin] || {};
				if(work['handlingTime'] && moment() > moment(work['handlingTime'])) {
					handlingTime = work['reminderTime']
				};
				if(work['reminderTime'] && moment() > moment(work['reminderTime'])) {
					reminderTime = work['reminderTime']
				};
				list.push({
					asin,
					id: work['_id'],
					type: type || work['type'] >= 100 ? work['type'] : '00' + work['type'],
					handle: work['handle'],
					handleTime: work['handleTime'],
					handlingTime: handlingTime,
					reminderTime: reminderTime,
					remarks: work['remarks'],
					content: work['content'],
					orderID: work['order_id'],
					createdAt: work['createdAt'],
					creator: work['creator'] ? work['creator']['name'] : '机器人',
					handler: work['handler'] ? work['handler']['name'] : '机器人',
					leader: work['team_name'] ? work['leader'] : merchan['leader'],
					product: merchan['product_id'] ? merchan['product_id']['name_cn'] : null,
					team_name: work['team_name'] || merchan['team_name'],
					shop_name: work['shop_name'] || merchan['shop_name'],
					fba_stock: dailySell[asin],
					status: states[merchan['state']] ? states[merchan['state']] : '不存在'
				})
			};
			res.send({
				list,
				pageCount,
				customers
			})
		})
	},
	// 已处理已完结列表
	dealtList: function(req, res, next) {
		var pageSize = parseInt(req.query.itemsPerPage) || 10;
		var currentPage = parseInt(req.query.currentPage) || 1;
		var subFilter = req.subfilterWorkOrder || {};
		var where = {};

		if(subFilter.view == '*') {
			where.$or = [{
				creator: mongoose.Types.ObjectId(req.agent.id)
			}, {
				state: {
					$nin: [0]
				}
			}]
		} else if(subFilter.view != null) {
			where['history.from'] = {
				$in: subFilter.view
			}
		};
		if(req.query.state) {
			where['state'] = {
				$in: [2]
			}
		} else {
			where['state'] = {
				$in: [0, 1]
			}
		};
		if(req.query.asin) {
			where['data.ASIN'] = {
				$regex: req.query.asin,
				$options: 'i'
			}
		};
		if(req.query.orderId) {
			where.order_id = {
				$regex: req.query.orderId,
				$options: 'i'
			}
		};
		if(req.query.handle === '0') {
			where.$or = [{
				handle: null
			}, {
				handle: 0
			}]
		};
		if(req.query.handle === '1') {
			where.handle = 1
		};
		if(req.query.startDate) {
			where.createdAt = {
				$gte: new Date(req.query.startDate)
			}
		};
		if(req.query.endDate) {
			var time = new Date(req.query.endDate);
			time.setDate(time.getDate() + 1);
			where.createdAt = {
				$lte: new Date(time)
			}
		};
		if(req.query.startDate && req.query.endDate) {
			var time = new Date(req.query.endDate);
			time.setDate(time.getDate() + 1);
			where.createdAt = {
				$gte: new Date(req.query.startDate),
				$lte: new Date(time)
			}
		};
		var type = req.query.type;
		if(type && type.length >= 3) {
			where.type = parseInt(type)
		} else if(type) {
			where['data.type'] = parseInt(type)
		};
		var totalItems = 0;
		var teamJson = {};
		var workOrder = {};
		var dailySell = {};
		var merchandise = {};
		var findCreator = [];
		var findHandler = [];
		var findTreated = [];
		async.series([
			// 获取用户
			function(callback) {
				User.find({}, ['name', 'team', 'role']).populate({
					path: 'role',
					select: 'type'
				}).exec(function(err, docs) {
					docs.map(function(item) {
						if(req.query.creator && item.name.indexOf(req.query.creator) != -1) {
							findCreator.push(item._id);
							where.creator = {
								$in: findCreator
							};
						}
						if(req.query.handler && item.name.indexOf(req.query.handler) != -1) {
							findHandler.push(item._id);
							where.handler = {
								$in: findHandler
							};
						}
						if(req.query.treated && item.name.indexOf(req.query.treated) != -1) {
							findTreated.push(item._id);
							if(where['history.from']) {
								where['history.from']['$in'].concat(findTreated)
							} else {
								where['history.from'] = {
									$in: findTreated
								}
							};
						}
						if(item.role && item.role.type == 'leader') {
							teamJson[item.team] = item.name
						}
					});
					callback(err)
				})
			},
			// 获取工单总数
			function(callback) {
				WorkOrder.count(where, function(err, count) {
					totalItems = count;
					callback(null)
				})
			},
			// 获取工单信息
			function(callback) {
				WorkOrder.find(where).sort({
					order_id: -1
				}).skip((currentPage - 1) * pageSize).limit(pageSize).populate({
					path: 'creator',
					select: 'name'
				}).populate({
					path: 'handler',
					select: 'name'
				}).populate({
					path: 'team_id',
					select: 'name'
				}).populate({
					path: 'remarks.writer',
					select: 'name'
				}).populate('team_id').exec(function(err, docs) {
					docs.map(function(item) {
						if(item['team_id']) {
							item.team_name = item['team_id']['name'];
							item.leader = teamJson[item['team_id']['_id']];
						};
						workOrder[item.order_id] = item;
					});
					callback(null)
				})
			},
			// 获取商品信息
			function(callback) {
				Merchandise.find({}, ['asin', 'state', 'shop_name', 'store_sku', 'shop_id', 'team_id', 'product_id']).populate({
					path: 'team_id',
					select: 'name'
				}).populate({
					path: 'shop_id',
					select: 'name'
				}).populate({
					path: 'product_id',
					select: 'name_cn'
				}).exec(function(err, docs) {
					docs.map(function(item) {
						if(item['team_id']) {
							item.team_name = item['team_id']['name'];
							item.leader = teamJson[item['team_id']['_id']];
						};
						if(item['shop_id']) {
							item.shop_name = item['shop_id']['name'];
						};
						merchandise[item.asin] = item;
					});
					callback(null)
				})
			},
			// 获取FBA库存 
			function(callback) {
				var $match = {};
				var startTime = req.query.startDate;
				var endTime = req.query.endDate;
				if(startTime || endTime) {
					$match.date = {};
					if(startTime) $match.date.$gte = startTime;
					if(endTime) $match.date.$lte = endTime;
				};
				DailySell.aggregate([{
					$match
				}, {
					$group: {
						_id: '$asin',
						sstock: {
							$last: '$sellable_stock'
						},
						tstock: {
							$last: '$transport_stock'
						}
					}
				}]).exec(function(err, docs) {
					docs.map(function(item) {
						dailySell[item._id] = (item.sstock || 0) + (item.tstock || 0);
					});
					callback(err)
				})
			}
		], function(err, results) {
			let list = [];
			let states = ["停售", "未开售", "推广期", "在售期", "清仓期", "归档", "备用"];
			for(let key in workOrder) {
				let work = workOrder[key];
				let asin = work['asin'];
				let type = null;
				if(work['data']) {
					asin = work['data']['ASIN'];
					type = work['data']['type'];
				}
				let merchan = merchandise[asin] || {};
				list.push({
					asin,
					ID: work['_id'],
					type: type || work['type'] >= 100 ? work['type'] : '00' + work['type'],
					state: work['state'],
					remarks: work['remarks'],
					content: work['content'],
					orderID: work['order_id'],
					createdAt: work['createdAt'],
					creator: work['creator'] ? work['creator']['name'] : '机器人',
					handler: work['handler'] ? work['handler']['name'] : null,
					leader: work['team_name'] ? work['leader'] : merchan['leader'],
					product: merchan['product_id'] ? merchan['product_id']['name_cn'] : null,
					team_name: work['team_name'] || merchan['team_name'],
					shop_name: work['shop_name'] || merchan['shop_name'],
					handle: work['handle'],
					handleTime: work['handleTime'],
					fba_stock: dailySell[asin],
					status: states[merchan['state']] ? states[merchan['state']] : '不存在',
				})
			};
			res.send({
				list,
				totalItems
			})
		})
	},
	// 工单类型选项
	orderTypes: function(req, res) {
		WorkOrderType.find({}, ['name', 'type']).sort({
			type: -1
		}).exec(function(err, docs) {
			res.send(docs)
		})
	},
	// 工单类型列表
	orderTypeList: function(req, res) {
		WorkOrderType.find({
		}).sort({
			createdAt: -1
		}).exec(function(err, docs) {
			res.send(docs)
		})
	},
	// 工单类型保存
	orderTypeSave: function(req, res) {
		let _id = req.body._id;
		let name = req.body.name;
		let tips = req.body.tips;
		let remark = req.body.remark;
		let isAsin = req.body.isAsin;
		let handlingHours = req.body.handlingHours;
		let reminderHours = req.body.reminderHours;
		if(_id) {
			WorkOrderType.findOne({
				_id
			}, function(err, work) {
				if(err) {
					res.send(err);
					return
				};
				work.name = name;
				work.tips = tips;
				work.isAsin = isAsin;
				work.remark = remark;
				work.handlingHours = handlingHours;
				work.reminderHours = reminderHours;
				work.updatedAt = Date.now();
				work.save(function(err) {
					res.send(err || work)
				})
			})
		} else {
			let type = 100;
			async.series([
				// 生成编号
				function(callback) {
					WorkOrderType.find({}, ['type'], function(err, docs) {
						docs.map(function(item) {
							if(parseInt(item.type) >= type) {
								type = parseInt(item.type) + 1
							}
						});
						callback(null)
					})
				}
			], function(err) {
				new WorkOrderType({
					name,
					type,
					tips,
					remark,
					isAsin,
					handlingHours,
					reminderHours
				}).save(function(err, work) {
					res.send(err || work)
				})
			})
		}
	},
	// 工单分配列表
	orderAllotList: function(req, res) {
		let list = [];
		let goods = [];
		let customer = [];
		async.series([
			// 获取工单分配列表
			function(callback) {
				WorkOrderAllot.find({}).populate({
					path: 'goods',
					select: 'name'
				}).populate({
					path: 'customer',
					select: 'name'
				}).sort({
					createdAt: -1
				}).exec(function(err, docs) {
					list = docs;
					callback(err)
				})
			},
			// 获取商品列表选项
			function(callback) {
				WorkOrderGoods.find({}, ['name']).sort({
					name: 1
				}).exec(function(err, docs) {
					goods = docs;
					callback(err)
				})
			},
			// 获取处理人列表选项
			function(callback) {
				User.find({}, ['name', 'role']).populate({
					path: 'role',
					select: 'type'
				}).sort({
					name: 1
				}).exec(function(err, docs) {
					docs.map(function(item) {
						if(item.role && ['CSDMember', 'CSDDirector'].indexOf(item.role.type) != -1) {
							customer.push({
								_id: item._id,
								name: item.name
							})
						}
					});
					callback(err)
				})
			}
		], function(err) {
			res.send({
				list,
				goods,
				customer
			})
		})
	},
	// 工单分配保存
	orderAllotSave: function(req, res) {
		let _id = req.body._id;
		let type = req.body.type;
		let goods = req.body.goods;
		let customer = req.body.customer;
		async.series([
			function(callback) {
				WorkOrderAllot.findOne({
					type,
					goods
				}, function(err, docs) {
					docs ? callback(true) : callback(null)
				})
			}
		], function(err) {
			if(err) {
				res.send(500, 'There has been the same allocation')
				return
			};
			if(_id) {
				WorkOrderAllot.findOne({
					_id
				}, function(err, work) {
					if(err) {
						res.send(err);
						return
					};
					work.type = type;
					work.goods = goods;
					work.customer = customer;
					work.updatedAt = Date.now();
					work.save(function(err) {
						res.send(err || work)
					})
				})
			} else {
				new WorkOrderAllot({
					type,
					goods,
					customer
				}).save(function(err, work) {
					res.send(err || work)
				})
			}
		})
	},
	// 工单分配删除
	orderAllotRemove: function(req, res) {
		let _id = req.params.id;
		WorkOrderAllot.remove({
			_id
		}, function(err, info) {
			res.send(err || info)
		})
	},
	// 工单商品
	orderGoodsList: function(req, res) {
		let list = [];
		let merchandise = [];
		async.series([
			// 获取工单分配列表
			function(callback) {
				WorkOrderGoods.find({}).populate({
					path: 'merchandise',
					select: 'asin'
				}).sort({
					createdAt: -1
				}).exec(function(err, docs) {
					list = docs;
					callback(err)
				})
			},
			function(callback) {
				Merchandise.find({
					state: {
						$ne: -1
					}
				}, ['asin', 'store_sku', 'product_id', 'shop_id', 'team_id', 'state']).populate({
					path: 'product_id',
					select: 'name_cn'
				}).populate({
					path: 'shop_id',
					select: 'name'
				}).populate({
					path: 'team_id',
					select: 'name'
				}).exec(function(err, docs) {
					let list = [];
					let state = ['停售', '未开售', '推广期', '在售期', '清仓期', '归档', '备用'];
					docs.map(function(item) {
						list.push({
							_id: item._id,
							asin: item.asin,
							store_sku: item.store_sku,
							shop_name: item.shop_id ? item.shop_id.name : null,
							team_name: item.team_id ? item.team_id.name : null,
							product_name: item.product_id ? item.product_id.name_cn : null,
							state: state[item.state] || '不存在'
						})
					});
					merchandise = list;
					callback(err)
				})
			}
		], function(err) {
			res.send({
				list,
				merchandise
			})
		})
	},
	orderGoodsSave: function(req, res) {
		let _id = req.body._id;
		let name = req.body.name;
		let remark = req.body.remark;
		let merchandise = req.body.merchandise;
		if(_id) {
			WorkOrderGoods.findOne({
				_id
			}, function(err, work) {
				if(err) {
					res.send(err);
					return
				};
				work.name = name;
				work.remark = remark;
				work.merchandise = merchandise;
				work.updatedAt = Date.now();
				work.save(function(err) {
					res.send(err || work)
				})
			})
		} else {
			new WorkOrderGoods({
				name,
				remark,
				merchandise
			}).save(function(err, work) {
				res.send(err || work)
			})
		}
	},
	orderGoodsRemove: function(req, res) {
		let _id = req.params.id;
		WorkOrderGoods.remove({
			_id
		}, function(err, info) {
			res.send(err || info)
		})
	},
	// 工单文件
	orderFiles: function(req, res) {
		let assestManager = app.getService('AssetsManager');
		let subFilter = req.subfilterCreateOrder || {};
		let id = req.body.id;
		let addFileInfo = req.body.addFileInfo;
		let delFileItem = req.body.delFileItem;
		WorkOrder.findOne({
			_id: id
		}, function(err, docs) {
			if(delFileItem) {
				docs.fileInfo.map(function(item) {
					if(item._id == delFileItem) {
						docs.fileInfo.splice(docs.fileInfo.indexOf(item), 1)
					}
				});
				docs.save(function(e, d) {
					res.send(e || d.fileInfo)
				})
			} else if(addFileInfo.length) {
				async.mapSeries(addFileInfo, function(item, cb) {
					var uuid = UUID.v4();
					var data = item.data;
					var name = item.name;
					var type = name.substr(name.lastIndexOf('.') + 1);
					var createdAt = Date.now();
					assestManager.putWorkFile({
						uuid,
						name,
						type,
						data
					}, function(err, result) {
						docs.fileInfo.push({
							uuid,
							name,
							createdAt,
							user: req.agent.id
						});
						cb(err)
					})
				}, function(err) {
					if(err) {
						res.send(err);
						return
					};
					docs.save(function(e, d) {
						res.send(e || d.fileInfo)
					})
				})
			}
		})
	},
	// 工单公告
	orderNoticeList: function(req, res) {
		WorkOrderNotice.find({}).sort({
			createdAt: -1
		}).exec(function(err, docs) {
			let list = [];
			docs.map(function(item) {
				list.push({
					_id: item._id,
					title: item.title,
					content: item.content,
					startTime: moment(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
					endTime: moment(item.endTime).format('YYYY-MM-DD HH:mm:ss'),
					status: moment(item.startTime) <= moment() && moment() <= moment(item.endTime)
				})
			});
			res.send(list)
		})
	},
	orderNoticeSave: function(req, res) {
		let _id = req.body._id;
		let title = req.body.title;
		let content = req.body.content;
		let startTime = req.body.startTime;
		let endTime = req.body.endTime;
		let creator = req.agent.id;
		if(_id) {
			WorkOrderNotice.findOne({
				_id
			}, function(err, work) {
				work.title = title;
				work.content = content;
				work.startTime = startTime;
				work.endTime = endTime;
				work.updatedAt = Date.now();
				work.save(function(e) {
					e ? res.send(500) : res.send(200)
				})
			})
		} else {
			new WorkOrderNotice({
				title,
				content,
				startTime,
				endTime,
				creator
			}).save(function(e) {
				e ? res.send(500) : res.send(200)
			})
		}
	},
	orderNoticeRemove: function(req, res) {
		let _id = req.params.id;
		WorkOrderNotice.remove({
			_id
		}, function(err) {
			err ? res.send(500) : res.send(200)
		})
	},
	// 点击任务列表
	clickTaskList: function(req, res) {
		MysqlADC.query('SELECT * FROM ClickConfig', function(error, results) {
			res.send(results)
		})
	},
	// 点击任务保存
	clickTaskSave: function(req, res) {
		var {
			Asin,
			Category,
			ExecuteNum,
			ExecuteTime,
			Id,
			Keyword,
			Note,
			UpNote,
			OperTime,
			SellerId,
			Status
		} = req.body;
		Note = Note || '';
		Status = parseInt(Status) || 0;
		ExecuteNum = parseInt(ExecuteNum) || 1;
		ExecuteTime = moment(ExecuteTime).format('YYYY-MM-DD HH:mm:ss');
		OperTime = moment().format('YYYY-MM-DD HH:mm:ss');

		if(Id) {
			async.series([
				function(callback) {
					if(UpNote) {
						callback(null);
						return
					};
					var sql = `SELECT * FROM ClickConfig WHERE (Id="${Id}")`;
					MysqlADC.query(sql, function(error, results) {
						if(results[0]['Status'] != 0) callback({
							message: 'The completed state cannot be updated'
						});
						callback(error, results)
					})
				},
				function(callback) {
					var sql = `UPDATE ClickConfig SET Asin="${Asin}",Category="${Category}",ExecuteNum="${ExecuteNum}",ExecuteTime="${ExecuteTime}",Keyword="${Keyword}",Note="${Note}",OperTime="${OperTime}",SellerId="${SellerId}" WHERE (Id="${Id}")`;
					MysqlADC.query(sql, function(error, results) {
						callback(error, results)
					})
				}
			], function(error, results) {
				res.send({
					results,
					error: error ? error.message : null
				})
			})
		} else {
			var sql = `INSERT INTO ClickConfig (ExecuteTime,ExecuteNum,Category,Keyword,Asin,SellerId,OperTime) VALUES ("${ExecuteTime}","${ExecuteNum}","${Category}","${Keyword}","${Asin}","${SellerId}","${OperTime}")`;
			MysqlADC.query(sql, function(error, results) {
				res.send({
					results,
					error: error ? error.message : null
				})
			})
		}
	}

}