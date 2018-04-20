var express = require('express');
var router = express.Router();
var controller = require('../controllers').stores;

module.exports = {
	path: "/stores",
	route: router
};

// 仓库列表
router.get('/houses', controller.houseList);
// 仓库保存
router.post('/ihouse', controller.houseSave);
// 仓库更新
router.post('/uhouse', controller.houseUpdate);

// 库存列表
router.get('/list', controller.storesList);
// 库存登记
router.post('/register', controller.storesRegister);
// 库存记录
router.get('/journal', controller.storesJournal);

// 库存汇总
router.get('/summary', controller.storeSummary);
// 库存汇总-海外仓
router.get('/overseas', controller.storeOverseas);
// 库存汇总-采购订单
router.get('/purchases', controller.storePurchases);