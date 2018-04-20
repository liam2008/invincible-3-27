var express = require('express');
var router = express.Router();
var debug = require('debug')('smartdo:route:category');
var app = require('../app');

var controller = require('../controllers').category;

module.exports = {
	path: "/category",
	route: router
};

router.use(app.authServer.authenticate());

// 品类列表
router.get('/list', controller.categoryList);

// 品类添加
router.post('/save', controller.categorySave);

// 品类更新
router.post('/update', controller.categoryUpdate);

// 品类删除
router.get('/remove', controller.categoryRemove);