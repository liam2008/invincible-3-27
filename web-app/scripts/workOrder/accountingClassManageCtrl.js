(function() {
	var app = angular.module('app.workOrder.accountingClassManage', []);
	app.controller('accountingClassManageCtrl', ['$scope', 'netManager', 'DTOptionsBuilder', 'SweetAlert',
		function($scope, netManager, DTOptionsBuilder, SweetAlert) {
			// 数据表格配置
			$scope.dtOptions = DTOptionsBuilder.newOptions()
				.withDOM('<"html5buttons"B>lTfgitp')
				.withButtons([{
					text: '添加工单类型',
					action: function(e, dt, node, config) {
						// 初始化
						$scope.addWorkOrderClass = {};
						$scope.addWorkOrderClass.asin = false
						$scope.formAdd.submitted = false;
						$scope.$digest();
						$('#addWorkOrderClassModal').modal('show');
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

			// 初始化
			initialize();

			// 添加保存
			$scope.addworkOrderClass = function() {
				$scope.formAdd.submitted = true;
				if($scope.formAdd.$valid) {
					var sendData = {
						name: $scope.addWorkOrderClass.addWorkOrderName,
						tips: $scope.addWorkOrderClass.addExplain,
						remark: $scope.addWorkOrderClass.addRemark,
						isAsin: $scope.addWorkOrderClass.asin,
						handlingHours: $scope.addWorkOrderClass.handlingHours,
						reminderHours: $scope.addWorkOrderClass.reminderHours
					};
					netManager.post('/workOrder/orderType', sendData).then(function(res) {
						if(res.data.errmsg) {
							swal('名称已存在', '请重新输入名称！', 'error');
						} else {
							$('#addWorkOrderClassModal').modal('hide');
							swal("添加成功!", "", "success");
							initialize();
						}
					});
				}
			};

			// 编辑弹窗
			$scope.editWorkOrderClass = {};
			$scope.edit = function(item) {
				$scope.editWorkOrderClass.ID = item._id;
				$scope.editWorkOrderClass.editWorkOrderName = item.name;
				$scope.editWorkOrderClass.editNumber = item.type;
				$scope.editWorkOrderClass.editExplain = item.tips;
				$scope.editWorkOrderClass.editRemark = item.remark;
				$scope.editWorkOrderClass.asin = item.isAsin;
				$scope.editWorkOrderClass.type = item.type;
				$scope.editWorkOrderClass.handlingHours = item.handlingHours;
				$scope.editWorkOrderClass.reminderHours = item.reminderHours;
				$scope.formEdit.submitted = true;
			};

			// 编辑点击保存
			$scope.saveEdit = function() {
				if($scope.formEdit.$valid) {
					var sendModifyData = {
						_id: $scope.editWorkOrderClass.ID,
						name: $scope.editWorkOrderClass.editWorkOrderName,
						tips: $scope.editWorkOrderClass.editExplain,
						remark: $scope.editWorkOrderClass.editRemark,
						isAsin: $scope.editWorkOrderClass.asin,
						handlingHours: $scope.editWorkOrderClass.handlingHours,
						reminderHours: $scope.editWorkOrderClass.reminderHours,
					};
					netManager.post('/workOrder/orderType', sendModifyData).then(function(res) {
						if(res.data.errmsg) {
							swal('名称已存在', '请重新输入名称！', 'error');
						} else {
							$('#editWorkOrderClassModal').modal("hide");
							swal('编辑成功！', '', 'success');
							initialize();
						}
					});
				}
			};

			// 初始化
			function initialize() {
				netManager.get('/workOrder/orderType').then(function(res) {
					$scope.workOrderList = res.data;
				});
			}

		}
	]);
})();