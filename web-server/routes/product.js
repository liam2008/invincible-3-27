var express = require('express');
var router = express.Router();
var app = require('../app');
var controller = require('../controllers').product;

module.exports = {
	path: "/product",
	route: router
};

router.use(app.authServer.authenticate());

// 产品信息
router.get('/info', controller.productInfo);

// 产品列表
router.get('/list', controller.productList);

// 产品添加
router.post('/save', controller.productSave)

// 产品更新
router.post('/update', controller.productUpdate)

// 产品删除
router.get('/remove', controller.productRemove)