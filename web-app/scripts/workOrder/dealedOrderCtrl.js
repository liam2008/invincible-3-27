(function() {
	var app = angular.module('app.workOrder.dealedOrder', []);

	app.controller('dealedOrderCtrl', ['$scope', 'netManager', 'SweetAlert', '$timeout', '$stateParams',
		function($scope, netManager, SweetAlert, $timeout, $stateParams) {
			//初始化传递参数
			$scope.initData = {
				startDate: moment().subtract('1', 'months').format('YYYY-MM-DD'),
				endDate: moment().format('YYYY-MM-DD')
			};

			$scope.optionData = {
				itemsPerPage: 10,
				currentPage: $stateParams.currentPage || 1,
				startDate: moment($scope.initData.startDate).format('YYYY-MM-DD'),
				endDate: moment($scope.initData.endDate).format('YYYY-MM-DD'),
				pageChanged: function() {
					init();
				}
			};

			$scope.handleList = [{
				id: 0,
				name: '待处理'
			}, {
				id: 1,
				name: '处理中'
			}];

			//渲染页面
			init();

			//init
			function init() {
				getserverData();
			}

			//分页设置
			$scope.pageChanged = function() {
				getserverData();
			};
			$scope.handlePagination = function(size) {
				getserverData();
			};

			// 重新获取数据条目
			function getserverData() {
				$scope.isLoad = true;
				var sendData = angular.extend({}, $scope.optionData, {
					startDate: moment($scope.optionData.startDate).format('YYYY-MM-DD'),
					endDate: moment($scope.optionData.endDate).format('YYYY-MM-DD'),
					asin: $scope.optionData.asin,
					handle: $scope.optionData.handle,
					type: $scope.optionData.type,
					currentPage: $scope.optionData.currentPage,
					itemsPerPage: $scope.optionData.itemsPerPage
				});
				console.log('sendData', sendData);
				netManager.get('/workOrder/dealtList', sendData).then(function(res) {
					console.log('restableList', res.data);
					$scope.tableList = res.data.list;
					$scope.totalItems = res.data.totalItems;
					window.sessionStorage.setItem('currentPage', $scope.optionData.currentPage);
					$timeout(function() {
						$('.footable').trigger('footable_redraw');
					}, 100);
				}, function(err) {
					console.error(err);
				});
			}

			//点击查询
			$scope.checkFn = function() {
				getserverData();
			};

			//重置
			$scope.resetFn = function() {
				$stateParams.currentPage = 1;
				$scope.optionData = {
					startDate: moment().subtract('1', 'months').format('YYYY-MM-DD'),
					endDate: moment().format('YYYY-MM-DD'),
					currentPage: $stateParams.currentPage
				};
				getserverData();
			}

			//添加备注文本
			$scope.remarkText = {};

			//操作备注
			$scope.operateRemark = function(value, index) {
				// console.log(index, value)
				$scope.remarkText.remark = "";
				$scope.itemData = value;
				/* var targetElements = document.querySelectorAll('.addRemarkList');
				if(targetElements[index].style.display === 'none') {
					//显现
					$scope.remarkText.remark = '';
					targetElements[index].style.display = 'block';
				} else {
					//隐藏
					$scope.remarkText.remark = '';
					targetElements[index].style.display = 'none';
				} */
			}

			//保存备注
			// $scope.saveRemark = function(tableItem, index) {
			$scope.saveRemark = function() {
				var targetElements = document.querySelectorAll('.addRemarkList');
				var sendRemark = {
					_id: $scope.itemData.ID,
					content: $scope.remarkText.remark
				};
				if($scope.remarkText.remark !== '' && $scope.remarkText.remark !== undefined) { //备注为空时不能保存
					netManager.post("/workOrder/saveRemark", sendRemark).then(function(res) {
						if(res.status === 200) {
							//页面信息同步
							$scope.itemData.remarks = res.data;
							// console.log("resRemark", res);
							//清空并关闭文本框
							$scope.remarkText.remark = '';
							// targetElements[index].style.display = 'none';
						}
					}, function(err) {
						console.error("saveRemark", err);
					});
				}
			}
			// 工单类型
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
			}
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