(function() {
	var app = angular.module('app.workOrder.woRlues', []);
	app.controller('woRluesCtrl', ['$scope', 'netManager', 'DTOptionsBuilder', 'SweetAlert',
		function($scope, netManager, DTOptionsBuilder, SweetAlert) {
			// 数据表格配置
			// 工单分配规则
			$scope.dtOptions = DTOptionsBuilder.newOptions()
				.withDOM('<"html5buttons"B>lTfgitp')
				.withButtons([{
					text: '添加分配规则',
					action: function(e, dt, node, config) {
						// 初始化
						$scope.addProductRules = {};
						$scope.formRuleAdd.submitted = false;
						$scope.$digest();
						$('#addRule').modal('show');
					}
				}])
				.withOption('language', {
					"sProcessing": "处理中...",
					"sLengthMenu": "显示 _MENU_ 项结果",
					"sZeroRecords": "没有匹配结果",
					"sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
					"sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
					"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
					"sSearch": "搜索:",
					"sEmptyTable": "表中数据为空",
					"sLoadingRecords": "载入中...",
					"oPaginate": {
						"sFirst": "首页",
						"sPrevious": "上页",
						"sNext": "下页",
						"sLast": "末页"
					}
				});

			// 添加保存
			$scope.saveRules = function() {
				var sendData = {
					goods: $scope.addProductRules.productGather,
					type: $scope.addProductRules.woType,
					customer: $scope.addProductRules.conductor
				};
				var flag = 1;
				for(var i in sendData) {
					if(!sendData[i]) {
						swal('请检查是否正确选择必填选项！', '', 'warning');
						flag = 0;
					}
				}
				if(flag === 1) {
					netManager.post('/workOrder/orderAllot', sendData).then(function(res) {
						$('#addRule').modal("hide");
						swal('添加成功！', '', 'success');
						allocationRule();
					}).catch(function(err) {
						swal('添加失败', '已存在相同分配！', 'error');
					})
				}
			};

			// 编辑弹窗
			$scope.editProductRules = {};
			$scope.editItem = function(item) {
				console.log('编辑数据', item);
				$scope.editProductRules.id = item._id;
				$scope.editProductRules.productGather = item.goods._id;
				$scope.editProductRules.woType = item.type.type;
				$scope.editProductRules.conductor = item.customer._id;
				/*$scope.editWorkOrderClass.ID = item._id;
				$scope.editWorkOrderClass.editWorkOrderName = item.name;
				$scope.editWorkOrderClass.editNumber = item.type;
				$scope.editWorkOrderClass.editRemark = item.tips;
				$scope.editWorkOrderClass.asin = item.isAsin;
				$scope.formEdit.submitted = true;*/
			};

			// 编辑点击保存
			$scope.saveRulesEdit = function() {
				var sendData = {
					_id: $scope.editProductRules.id,
					goods: $scope.editProductRules.productGather,
					type: $scope.editProductRules.woType,
					customer: $scope.editProductRules.conductor
				};
				var flag = 1;
				for(var i in sendData) {
					if(!sendData[i]) {
						swal('请检查是否正确选择必填选项！', '', 'warning');
						flag = 0;
					}
				}
				if(flag === 1) {
					netManager.post('/workOrder/orderAllot', sendData).then(function(res) {
						$('#editRule').modal("hide");
						swal('编辑成功！', '', 'success');
						allocationRule();
					}).catch(function(err) {
						swal('编辑失败', '已存在相同分配！', 'error');
					})
				}
			};

			// 删除
			$scope.removeItem = function(item, index) {
				console.log('删除', item);
				SweetAlert.swal({
						title: "你确定删除吗?",
						text: "你将删除此条数据!",
						type: "warning",
						showCancelButton: true,
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						closeOnConfirm: false,
						closeOnCancel: true
					},
					function(isConfirm) {
						if(isConfirm) {
							// netManager.delete('/workOrder/orderAllot?id='+item._id).then(function(res) {
							// netManager.delete('/workOrder/orderAllot/:id='+item._id).then(function(res) {
							netManager.delete('/workOrder/orderAllot/'+item._id).then(function(res) {
								if(res.status === 200) {
									$scope.allocationRuleList.splice($scope.allocationRuleList.indexOf(item), 1);
									swal('删除成功！', '', 'success');
								} else {
									swal("删除失败", "请检查！", "error");
								}
							}, function(err) {
								console.error(err);
							});
						}
					});
			};

			// 工单商品集合选项
			/*function productGather() {
				netManager.get('/workOrder/orderGoods').then(function(res) {
					// console.log('工单商品集合', res)
					if(res.status === 200) {
						$scope.productList = res.data;
					}
				});
			}
			productGather();*/
			// 工单类型
			function problemTypes() {
				netManager.get('/workOrder/orderTypes').then(function(res) {
					if(res.status === 200) {
						$scope.problemTypesList = res.data;
						console.log('工单类型选项', res.data);
					}
				});
			}
			problemTypes();

			// 工单分配规则列表
			function allocationRule() {
				netManager.get('/workOrder/orderAllot').then(function(res) {
					console.log('工单分配规则', res)
					if(res.status === 200) {
						for(var i = 0; i < res.data.list.length; i++) {
							var obj = {};
							for(var j = 0; j < $scope.problemTypesList.length; j++) {
								if(res.data.list[i].type === $scope.problemTypesList[j].type) {
									obj.type = $scope.problemTypesList[j].type;
									obj.name = $scope.problemTypesList[j].name;
								}
							}
							res.data.list[i].type = obj;
						}
						$scope.allocationRuleList = res.data.list;
						$scope.customers = res.data.customer;
						$scope.productList = res.data.goods;
					}
				});
			}
			allocationRule();

			// 获取处理人
			// $scope.customers = angular.fromJson(window.sessionStorage.getItem('customers'));
			// console.log('处理人', $scope.customers)

		}
	]);
})();