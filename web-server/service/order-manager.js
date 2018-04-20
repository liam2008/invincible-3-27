var fs = require('fs');
var path = require('path');
var async = require('async');
var DB = require('../models/invincible');
var User = DB.getModel('user');
var AbnormalAsins = DB.getModel('abnormal_asin');
var WorkOrder = DB.getModel('workOrder');
var Merchandise = DB.getModel('merchandise');
var WorkOrderAllot = DB.getModel('workOrderAllot');
var WorkOrderType = DB.getModel('workOrderType');
var OperativeCustomer = DB.getModel('operativeCustomer');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var PadLeft = require('padleft');

var debug = require('debug')('smartdo:service:order');
var Shared = require('../../shared/');
var Utils = Shared.Utils;

var OrderManager = module.exports = {};

OrderManager.name = "OrderManager";

OrderManager.init = function(cb) {
	var self = this;

	async.series([
		function(callback) {
			self.load(callback);
		}
	], function(err, results) {
		if(err != null) {
			debug("%s init error: ", self.name, err);
			return;
		}

		debug("%s inited...", self.name);
		process.nextTick(cb);
	});
};

OrderManager.start = function(cb) {
	debug("%s started...", this.name);
	process.nextTick(cb);
};

OrderManager.stop = function(cb) {
	debug("%s stopped...", this.name);
	process.nextTick(cb);
};

OrderManager.load = function(cb) {
	this.resetOrder(function(err) {
		cb && cb(err);
	});
};

OrderManager.resetOrder = function(cb) {
	var loaded = [];
	AbnormalAsins.find({
		status: 0
	}, function(err, findResults) {
		if(err) {
			cb(err);
			return;
		}

		if(findResults.length <= 0) {
			cb(null);
			return;
		}

		var earlyTime;
		var lastTime;
		findResults.forEach(function(findResult) {
			if(!earlyTime || !lastTime) {
				earlyTime = findResult.createdAt;
				lastTime = findResult.createdAt
			}
			if(findResult.createdAt < earlyTime) earlyTime = findResult.createdAt;
			if(findResult.createdAt > lastTime) lastTime = findResult.createdAt;
		});

		var findRequire = {
			data: {
				$ne: null
			}
		};
		if(earlyTime) {
			earlyTime = moment(earlyTime).startOf('day').format("YYYY-MM-DD HH:mm:ss");
			findRequire.createdAt = findRequire.createdAt || {};
			findRequire.createdAt.$gte = earlyTime;
		}
		if(lastTime) {
			lastTime = moment(lastTime).endOf('day').format("YYYY-MM-DD HH:mm:ss");
			findRequire.createdAt = findRequire.createdAt || {};
			findRequire.createdAt.$lte = lastTime;
		}

		var nowData;
		WorkOrder.find(findRequire, ["data", "createdAt"], function(err, oldOrderListFound) {
			if(err) {
				cb(err);
				return;
			}
			oldOrderListFound.forEach(function(oldOrderFound) {
				nowData = moment(oldOrderFound.createdAt).format("YYYYMMDD");
				if(oldOrderFound.data.type >= 1 && oldOrderFound.data.type <= 3) {
					loaded.push(nowData + oldOrderFound.data.ASIN + oldOrderFound.data.type);
				} else if(oldOrderFound.data.type == 4) {
					loaded.push(nowData + oldOrderFound.data.ASIN + oldOrderFound.data.sellerId);
				}
			});

			var iterator = function(abnormalObj, callback) {
				var handler = "";
				var teamID = "";
				var type;
				var hasCustomer = false;
				var content;
				var key;
				var reducePercent = 1;
				var handlingHours = null;
				var reminderHours = null;
				if([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].indexOf(abnormalObj.data.type) == -1) {
					return callback(null);
				}
				nowData = moment(abnormalObj.createdAt).format("YYYYMMDD");
				if(abnormalObj.data.type >= 1 && abnormalObj.data.type <= 3) {
					if(abnormalObj.data.type == 3) reducePercent = abnormalObj.data.currCnt / abnormalObj.data.lastCnt;
					key = (nowData + abnormalObj.data.ASIN + abnormalObj.data.type);
				} else if(abnormalObj.data.type == 4) {
					key = (nowData + abnormalObj.data.ASIN + abnormalObj.data.sellerId);
				}
				if(loaded.indexOf(key) == -1 || reducePercent <= 0.8) {
					async.series([
							// 设置处理人和报警内容
							function(callB) {
								content = "ASIN\t" + abnormalObj.ASIN + "\t站点\t" + abnormalObj.site;

								if(abnormalObj.data) {
									if(abnormalObj.data.type == 4) {
										content += ("\t发现跟卖\r\n跟卖卖家：" + abnormalObj.data.follower +
											"\r\n卖家ID：" + abnormalObj.data.sellerId);

										type = 4;
									} else if(abnormalObj.data.type == 5) {
										content += ("\tasin被篡改\r\n原ASIN：" + abnormalObj.data.ASIN);
										if(abnormalObj.data.afterAsin) content += ("\r\n现ASIN：" + abnormalObj.data.afterAsin);

										type = 5;
									} else if(abnormalObj.data.type >= 6 && abnormalObj.data.type <= 9) {
										if(abnormalObj.data.type == 6) {
											content += ("\t品牌被篡改\r\n被篡改成的品牌：" + abnormalObj.data.brand);
											type = 6;
										} else if(abnormalObj.data.type == 7) {
											content += ("\t标题被篡改\r\n被篡改成的标题：" + abnormalObj.data.title);
											type = 7;
										} else if(abnormalObj.data.type == 8) {
											content += ("\t简介被篡改\r\n被篡改成的简介：" + abnormalObj.data.introduction);
											type = 8;
										} else if(abnormalObj.data.type == 9) {
											content += ("\t描述被篡改\r\n被篡改成的描述：" + abnormalObj.data.description);
											type = 9;
										}
									} else if(abnormalObj.data.type >= 1 && abnormalObj.data.type <= 3) {
										if(abnormalObj.data.type == 1) {
											content += ("\t有差评");
											type = 1;
										} else if(abnormalObj.data.type == 2) {
											content += ("\t总评价低于4.3分");
											type = 2;
										} else if(abnormalObj.data.type == 3) {
											content += ("\t评论数量变少\r\n原评论数：" + abnormalObj.data.lastCnt + "\r\n现评论数：" + abnormalObj.data.currCnt);
											type = 3;
										} else {
											callB("Unknow type in abnormalObj");
											return;
										}
									} else if(abnormalObj.data.type == 10) {
										content += ("\t主图被篡改\r\n原图名称：" + abnormalObj.data.beforeImagePath + "\r\n被篡改成的图片：" + abnormalObj.data.nowImagePath);

										type = 10;
									}
								}
								callB(null);
							},

							// 按商品Asin分配处理人
							function(callB) {
								WorkOrderAllot.find({
									type: type + ''
								}).populate({
									path: 'goods',
									select: 'merchandise',
									populate: [{
										path: 'merchandise',
										select: 'asin'
									}]
								}).exec(function(err, docs) {
									var customerJson = {};
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
									handler = customerJson[(abnormalObj.ASIN || '') + type];
									if(handler) hasCustomer = true;
									callB(err)
								})
							},

							// 如果没有对应客服则分配给客服主管
							function(callB) {
								if(!hasCustomer) {
									User.findOne({
										role: mongoose.Types.ObjectId("5a265adac4d23f1fcdb621f1")
									}, function(err, userFound) {
										if(err) {
											callB(err);
											return;
										}
										if(userFound) {
											handler = userFound._id;
											callB(null);
										} else {
											callB("no handler");
										}
									})
								} else {
									callB(null);
								}
							},

							// 获取处理时限
							function(callB) {
								console.log('----------------------------------')
								WorkOrderType.findOne({
									type: type
								}, ['handlingHours', 'reminderHours'], function(err, docs) {
									console.log(docs)
									if(docs) {
										handlingHours = docs.handlingHours;
										reminderHours = docs.reminderHours;
									};
									callB(err)
								})
							},
							// 转换到数据库
							function(callB) {
								var head = moment(abnormalObj.createdAt).format("YYYYMMDD");
								var reg = new RegExp(head);
								var findRequire = {
									order_id: reg
								};
								WorkOrder.count(findRequire, function(err, maxNum) {
									if(err) {
										callB(err);
										return
									}
									var orderID = (maxNum + 1).toString();
									if(orderID.length < 4) orderID = orderID.padLeft(4, '0');
									orderID = head + orderID;
									var handlingTime = null;
									var reminderTime = null;
									if(handlingHours) {
										handlingTime = moment().add(handlingHours, 'Hours').format('YYYY-MM-DD HH:mm:ss')
									};
									if(reminderHours) {
										reminderTime = moment().add(reminderHours, 'Hours').format('YYYY-MM-DD HH:mm:ss')
									};
									console.log(handlingTime, reminderTime)
									var newOrder = new WorkOrder({
										_id: mongoose.Types.ObjectId(),
										order_id: orderID, // 工单编号
										state: 0, // 状态(0：待处理， 1：已跟进， 2：已完结)
										type: type, // 类型(1：评论异常， 2：发现跟单， 3：Lightning Deals， 4:销售权限， 5:品牌更改， 6:店铺IP问题， 0：其它)
										content: content, // 工单内容
										handler: handler, // 当前处理人
										handlingTime: handlingTime, // 最长处理时限
										reminderTime: reminderTime, // 提醒处理时限
										history: [{
											to: handler
										}],
										data: abnormalObj.data,
										createdAt: abnormalObj.createdAt,
										updatedAt: abnormalObj.updatedAt
									});
									if(teamID) newOrder.team_id = teamID;
									newOrder.save(function(err) {
										if(err) {
											callB(err);
											return;
										}
										if(newOrder.data.type >= 1 && newOrder.data.type <= 3) {
											loaded.push(moment(abnormalObj.createdAt).format("YYYYMMDD") + newOrder.data.ASIN + newOrder.data.type);
										} else if(newOrder.data.type == 4) {
											loaded.push(moment(abnormalObj.createdAt).format("YYYYMMDD") + newOrder.data.ASIN + newOrder.data.sellerId);
										}
										debug(abnormalObj);
										callB(null);
									})
								})
							},

							function(callB) {
								// 修改abnormalObj的status为1（已处理）
								abnormalObj.status = 1;
								abnormalObj.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
								abnormalObj.save(function(e) {
									if(e) {
										callB(e);
										return;
									}
									callB(null);
								});
							}
						],
						function(err) {
							if(err) {
								callback(err);
								return;
							}
							callback(null);
						}
					);
				} else {
					// 修改abnormalObj的status为1（已处理）
					abnormalObj.status = 1;
					abnormalObj.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
					abnormalObj.save(function(e) {
						if(e) {
							callback(e);
							return;
						}
						callback(null);
					});
				}
			};

			async.eachSeries(findResults, iterator, function(e) {
				if(e != null) {
					debug(e);
					cb(e);
					return;
				}
				cb(null);
			});
		})
	});
};