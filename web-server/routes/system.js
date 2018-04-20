var express = require('express');
var router = express.Router();
var debug = require('debug')('smartdo:route:system');
var app = require('../app');
var controller = require('../controllers').system;

module.exports = {
	path: '/system',
	route: router
};

router.use(app.authServer.authenticate());

// 最新版本号
router.get('/version', controller.version);

// 推送日志内容
router.get('/pushlog', controller.pushChangeLog);

// 添加日志内容
router.post('/addlog', controller.addChangeLog);

// 编辑日志内容
router.post('/editlog', controller.editChangeLog);

// 更新日志列表
router.get('/updatelog', controller.updateLogs);