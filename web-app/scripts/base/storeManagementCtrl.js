(function() {
	var app = angular.module('app.base.storeManagement', []);
	app.controller('storeManagementCtrl', ['$scope', 'netManager', 'DTOptionsBuilder', 'SweetAlert',
		function($scope, netManager, DTOptionsBuilder, SweetAlert, $q) {
			$scope.dtOptions = DTOptionsBuilder.newOptions()
				.withDOM('<"html5buttons"B>lTfgitp')
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
				})
				.withButtons([{
					text: '注册仓库',
					action: function(e, dt, node, config) {
						$scope.registerStoreArray = {};
						$('#registerModal').modal('show');
					}
				}])

			init();

			//初始化页面
			function init() {
				$scope.isLoad = true;
				netManager.get('/stores/houses').then(function(res) {
					$scope.storeList = res.data;
					$scope.isLoad = false;
				}, function(err) {
					console.error(err);
				});
			}

			// 仓库添加
			$scope.saveRegisterStore = function() {
				// 验证
				console.log("添加",$scope.registerStoreArray.name);
				if(!$scope.registerStoreArray.name) {
					swal('添加失败', '仓库名称不能为空', 'error');
				}else {
					SweetAlert.swal({
						title: "你确定添加吗?",
						text: "",
						type: "warning",
						showCancelButton: true,
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						closeOnConfirm: false,
						closeOnCancel: true
					},
					function(isConfirm) {
						if(isConfirm) {
							var sendRegisterData = {
								name: $scope.registerStoreArray.name
							};
							netManager.post('/stores/ihouse', sendRegisterData).then(function(res) {
								if(res.status === 200) {
									var addStoreName = res.data.name;
									$scope.registerStoreArray = {};
									$('#registerModal').modal('hide');
									swal('添加成功', addStoreName, 'success');
									init();
								}
							}).catch(function(error) {
								swal('提示', "仓库名已经存在", 'warning');
							})
						}
					});
				}
			}

			// 仓库更新
			var editStoreItem = {};
			$scope.editItem = function(item, index) {
				$scope.editStoreArray = {
					id: item._id,
					name: item.name
				}
				$('#editModal').modal('show');
			}
			$scope.saveEditStore = function() {
				$scope.editStore.submitted = true;
				if($scope.editStore.$valid) {
					SweetAlert.swal({
						title: "你确定提交吗?",
						text: "",
						type: "warning",
						showCancelButton: true,
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						closeOnConfirm: false,
						closeOnCancel: true
					},
					function(isConfirm) {
						if(isConfirm) {
							var sendEditData = {
								_id: $scope.editStoreArray.id,
								name: $scope.editStoreArray.name
							};
							console.log(sendEditData);
							netManager.post('/stores/uhouse', sendEditData).then(function(res) {
								if(res.status === 200) {
									$scope.editStoreArray = {};
									$('#editModal').modal('hide');
									swal('编辑成功', sendEditData.name, 'success');
									init();
								}
							}).catch(function(res) {
								swal('提示', "仓库名已经存在", 'warning');
							})
						}
					});
				}
			}
		}
	]);
}());