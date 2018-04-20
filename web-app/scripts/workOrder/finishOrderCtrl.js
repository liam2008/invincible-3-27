(function() {
	var app = angular.module('app.workOrder.finishOrder', []);
	app.controller('finishOrderCtrl', ['$scope', 'netManager', 'SweetAlert', '$timeout', '$state', '$stateParams',
		function($scope, netManager, SweetAlert, $timeout, $state, $stateParams) {
			//数据模型
			$scope.where = {
				state: 2,
				currentPage: 1,
				itemsPerPage: 10,
				startDate: moment().subtract('1', 'months').format('YYYY-MM-DD'),
				endDate: moment().format('YYYY-MM-DD')
			};
			$scope.pageCount = 1;

			//分页查询
			$scope.handlePagination = function(page) {
				$scope.isLoad = true;
				$scope.where.currentPage = page;
				if(page.itemsPerPage) {
					$scope.where.currentPage = 1;
					$scope.where.itemsPerPage = page.itemsPerPage;
				};
				$scope.where.startDate = moment($scope.where.startDate).format('YYYY-MM-DD');
				$scope.where.endDate = moment($scope.where.endDate).format('YYYY-MM-DD');
				netManager.get('/workOrder/dealtList', $scope.where).then(function(res) {
					$scope.tableList = res.data.list;
					$scope.pageCount = Math.ceil(res.data.totalItems / $scope.where.itemsPerPage);
					$scope.fromPage = $state.current.name;
					$timeout(function() {
						$('.footable').trigger('footable_redraw');
					});
					$scope.isLoad = false;
				})
			}
			$scope.handlePagination($stateParams.currentPage || 1)

			//重置查询条件
			$scope.resetFn = function() {
				$scope.where = {
					currentPage: 1,
					itemsPerPage: 10
				};
				$scope.handlePagination(1)
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