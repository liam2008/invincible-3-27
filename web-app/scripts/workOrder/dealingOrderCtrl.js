(function() {
	var app = angular.module('app.workOrder.dealingOrder', []);

	app.controller('dealingOrderCtrl', ['$scope', 'netManager', 'SweetAlert', '$timeout', '$state', '$stateParams',
		function($scope, netManager, SweetAlert, $timeout, $state, $stateParams) {
			//数据模型
			$scope.where = {
				currentPage: 1,
				pageSize: 10
			};
			$scope.pageCount = 1;

			//分页查询
			$scope.handlePagination = function(page) {
				$scope.isLoad = true;
				$scope.checkAll = false;
				$scope.checkList = [];
				$scope.where.currentPage = page;
				if(page.pageSize) {
					$scope.where.currentPage = 1;
					$scope.where.pageSize = page.pageSize;
				};
				if($scope.where.startTime != null) {
					$scope.where.startTime = moment($scope.where.startTime).format('YYYY-MM-DD')
				};
				if($scope.where.endTime != null) {
					$scope.where.endTime = moment($scope.where.endTime).format('YYYY-MM-DD')
				};
				netManager.get('/workOrder/newOrderList', $scope.where).then(function(res) {
					$scope.tableList = res.data.list;
					$scope.asinList = res.data.asinList;
					$scope.pageCount = res.data.pageCount;
					$scope.fromPage = $state.current.name;
					window.sessionStorage.setItem('customers', angular.toJson(res.data.customers));
					window.sessionStorage.setItem('currentPage', page);
					$timeout(function() {
						$('.footable').trigger('footable_redraw');
					}, 100);
					$scope.isLoad = false;
				})
			}
			$scope.handlePagination($stateParams.currentPage || 1)

			//重置查询条件
			$scope.resetFn = function() {
				$scope.where = {
					currentPage: 1,
					pageSize: 10
				};
				$scope.handlePagination(1)
			}

			//改变处理状态
			$scope.toggleHandleState = function(value) {
				var send = {
					_id: value.id
				};
				netManager.post('/workOrder/handle', send).then(function(res) {
					value.handle = res.data.handle;
					value.handleTime = res.data.handleTime;
				});
			}
			//添加备注文本对象
			$scope.remarkText = {};
			//操作备注
			$scope.operateRemark = function(value, index) {
				$scope.remarkText.remark = "";
				$scope.itemData = value;
			}
			//保存备注
			$scope.saveRemark = function() {
				var sendRemark = {
					_id: $scope.itemData.id,
					content: $scope.remarkText.remark
				};
				if($scope.remarkText.remark != '' && $scope.remarkText.remark !== undefined) { //备注为空时不能保存
					netManager.post("/workOrder/saveRemark", sendRemark).then(function(res) {
						//页面信息同步
						$scope.itemData.remarks = res.data;
						//清空并关闭文本框
						$scope.remarkText.remark = '';
					});
				}
			}

			// 多选
			$scope.checkList = [];
			$scope.arrayCom = [];
			$scope.checked = function(val) {
				if(val.checkAll != undefined) {
					if(val.checkAll) {
						$scope.tableList.map(function(item) {
							item.check = true;
							$scope.checkList.push(item.id)
						});
					} else {
						$scope.tableList.map(function(item) {
							item.check = false;
						});
						$scope.checkList = [];
					}
				} else if(val.check != undefined) {
					val.check.check ? $scope.checkList.push(val.check.id) : $scope.checkList.splice($scope.checkList.indexOf(val.check.id), 1);
					$scope.checkList.length == $scope.tableList.length ? $scope.checkAll = true : $scope.checkAll = false;
				}
			}
			// 批量转派存储ids
			$scope.batchRedeploy = function() {
				$scope.handler = "";
				$scope.remark = "";
				$scope.log = "";
				for(var i = 0; i < $scope.checkList.length; i++) {
					$scope.arrayCom.push($scope.checkList[i])
				}
			}

			// 获取转派处理人数组
			$scope.customers = angular.fromJson(window.sessionStorage.getItem('customers'));

			// 批量转派保存
			$scope.saveData = function() {
				// 完结还是转派
				if(!$scope.arrayCom.length) {
					swal('请选择转派条目', '', 'error');
					return
				};
				if($scope.log) {
					netManager.post("/workOrder/dealOrders", {
						ids: $scope.arrayCom,
						log: $scope.log
					}).then(function(res) {
						swal('完结成功', '', 'success');
						$scope.handlePagination(1)
						$('#editRowA').modal('hide');
					})
				} else {
					// 验证 
					if(!$scope.handler !== true) {
						var sendDataParam = {
							ids: $scope.arrayCom,
							handler: $scope.handler,
							remark: $scope.remark
						};
						netManager.post("/workOrder/dealOrders", sendDataParam).then(function(res) {
							swal('转派成功', '', 'success');
							$scope.handlePagination(1);
							$('#editRowB').modal('hide');
						})
					} else {
						swal('处理人必填', '', 'error');
					}
				}
			}

			function problemTypes() {
				netManager.get('/workOrder/orderTypes').then(function(res) {
					$scope.problemTypesList = res.data;
					$scope.typeSelect = function(type) {
						for(var i = 0; i < $scope.problemTypesList.length; i++) {
							if($scope.problemTypesList[i].type == type) {
								return $scope.problemTypesList[i].name;
								break
							}
						}
					}
				});
			};
			problemTypes();
			
			function orderNotice() {
				$scope.noticeList = [];
				netManager.get('/workOrder/orderNotice').then(function(res) {
					for(var i = 0; i < res.data.length; i++) {
						if(res.data[i].status) $scope.noticeList.push({
							title: res.data[i].title,
							content: res.data[i].content
						})
					}
				})
			};
			orderNotice();

		}
	]);
}());