process.env.NODE_ENV = "debug";

var async = require('async');
var moment = require('moment');
var DB = require('../models/invincible');
var Product = DB.getModel('product');
var User = DB.getModel('user');
var Merchandise = DB.getModel('merchandise');
var WorkOrder = DB.getModel('workOrder');
var UUID = require('uuid');
var debug = require('debug')('smartdo:route:base');
var Shared = require('../../shared');

var arr = [];
var onsale = [];

async.series([
        // 获取所有在售asin
        function (callB) {
            Merchandise.find({}, function (err, merListFound) {
                if (err) {
                    return callB(err);
                }
                merListFound.forEach(function (merFound) {
                    if ([2,3,4].indexOf(merFound.state) != -1) {
                        onsale.push(merFound.asin);
                    }
                });
                callB(null);
            })
        },

        //
        function (callB) {
            WorkOrder.find({}, function (err, orderListFound) {
                if (err) {
                    return callB(err);
                }
                orderListFound.forEach(function (orderFound) {
                    if (onsale.indexOf(orderFound.data.ASIN) == -1) {
                        console.log(orderFound.data.ASIN)
                    }
                });
                callB(null);
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