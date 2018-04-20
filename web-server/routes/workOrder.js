var express = require('express');
var router = express.Router();
var debug = require('debug')('smartdo:route:workOrder');
var app = require('../app');

var controller = require('../controllers').workOrder;
var subfilter = require('../middleware/sub-filter');

module.exports = {
	path: "/workOrder",
	route: router
};

router.use(app.authServer.authenticate());

router.get('/customerList', subfilter.operativeCustomer, controller.customerList);

router.post('/saveCustomer', subfilter.operativeCustomer, controller.saveCustomer);

router.post('/updateCustomer', subfilter.operativeCustomer, controller.updateCustomer);

router.post('/deleteCustomer', subfilter.operativeCustomer, controller.deleteCustomer);

router.post('/dealOrder', subfilter.workOrder, controller.dealOrder);

// 创建工单
router.post('/createOrder', subfilter.createOrder, controller.workOrderCreate);

// 批量转派
router.post('/dealOrders', subfilter.workOrder, controller.dealOrders);

// 查询小组
router.get('/orderReady', subfilter.workOrder, controller.orderReady);

// 工单详情
router.get('/openOrder', subfilter.workOrder, controller.openOrder);

// 保存备注
router.post('/saveRemark', subfilter.workOrder, controller.saveRemark);

// 处理状态
router.post('/handle', subfilter.workOrder, controller.handle);

// 待处理列表
router.get('/newOrderList', subfilter.workOrder, controller.newOrders);

// 已处理列表
router.get('/dealtList', subfilter.workOrder, controller.dealtList);

// 工单类型选项
router.get('/orderTypes', subfilter.workOrder, controller.orderTypes);

// 工单类型
router.get('/orderType', subfilter.workOrder, controller.orderTypeList);
router.post('/orderType', subfilter.workOrder, controller.orderTypeSave);

// 工单分配
router.get('/orderAllot', subfilter.workOrder, controller.orderAllotList);
router.post('/orderAllot', subfilter.workOrder, controller.orderAllotSave);
router.delete('/orderAllot/:id', subfilter.workOrder, controller.orderAllotRemove);

// 工单商品
router.get('/orderGoods', subfilter.workOrder, controller.orderGoodsList);
router.post('/orderGoods', subfilter.workOrder, controller.orderGoodsSave);
router.delete('/orderGoods/:id', subfilter.workOrder, controller.orderGoodsRemove);

// 工单公告
router.get('/orderNotice', subfilter.createOrder, controller.orderNoticeList);
router.post('/orderNotice', subfilter.createOrder, controller.orderNoticeSave);
router.delete('/orderNotice/:id', subfilter.createOrder, controller.orderNoticeRemove);

// 工单文件
router.post('/orderFiles', subfilter.createOrder, controller.orderFiles);

// 点击任务列表
router.get('/clickTask', controller.clickTaskList);
router.post('/clickTask', controller.clickTaskSave);