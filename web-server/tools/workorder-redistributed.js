process.env.NODE_ENV = "debug";

var async = require('async');
var moment = require('moment');
var InvincibleDB = require('../models/invincible');
var Product = InvincibleDB.getModel('product');
var User = InvincibleDB.getModel('user');
var Merchandise = InvincibleDB.getModel('merchandise');
var WorkOrder = InvincibleDB.getModel('workOrder');
var UUID = require('uuid');
var debug = require('debug')('smartdo:route:base');
var Shared = require('../../shared');
var mongoose = require('mongoose');
var OperativeCustomer = InvincibleDB.getModel('operativeCustomer');

var customers = {};
var onsale = [];

async.series([
        // 获取所有在售asin
        function (callB) {
            OperativeCustomer.find({}, function (err, customerFound) {
                if (err) {
                    return callB(err);
                }
                customerFound.forEach(function (getCustomer) {
                    var key1 = getCustomer.operate_team + "-" + getCustomer.work_order_type;
                    customers[key1] = getCustomer.customer_id;
                });
                callB(null);
            })
        },

        // 所有处理人为陈米娜的工单根据客服分配表重新分配
        function (callB) {
            // 用户陈米娜
            var handler = mongoose.Types.ObjectId("5a2a24fad8b8ee28d4aba35a");
            WorkOrder.find({handler: handler}, function (err, orderListFound) {
                if (err) {
                    return callB(err);
                }

                var iterator = function (orderFound, cb) {
                    var key2 = orderFound.team_id + "-" + orderFound.type;
                    if (customers[key2]) {
                        console.log(customers[key2])
                        //orderFound.handler = customers[key2];
                        //orderFound.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
                        //orderFound.save(function (err) {
                        //    if (err) {
                        //        return cb(err);
                        //    }
                        //    cb(null);
                        //})
                    }else {
                        console.log(key2)
                        //cb(key2 + "has no handler")
                    }
                    cb(null);
                };

                async.eachSeries(orderListFound, iterator, function (err) {
                    if (err) {
                        return callB(err);
                    }
                    callB(null);
                })

            })
        }
    ],
    function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("all done");
    }
);