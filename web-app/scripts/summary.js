(function() {
	var app = angular.module('app.summary', []);

	app.filter('trustedHtml', ['$sce', function($sce) {
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}]);

	app.controller('summaryController', ['$scope', '$sce', '$window', 'account','netManager', "SweetAlert",
		function($scope, $sce, $window, account, netManager, SweetAlert) {
			// 初始化数据
			$scope.updateLogDocument = false;
			$scope.lookUpdateLogVessel = true;
			$scope.lookUpdateLogVesselButton = true;
			$scope.canceLlookUpdateLogVesselButton = false;
			$scope.lookUpdateLogVesselText = false;
			$scope.editStyle = false;
			
			// 只有开发人员这个角色能编辑更新日志
			
			console.log("角色的admin：",account.role.type);
			function judgeRole() {
				var roleToken = "admin";
				if(roleToken === account.role.type) {
					$scope.editStyle = true;
				}
			}
			judgeRole();

			// 查看更新日志点击事件
			$scope.lookUpdateLog = function() {
				$scope.updateLogDocument = true;
				$scope.lookUpdateLogVesselButton = false;
				$scope.canceLlookUpdateLogVesselButton = true;
			};

			// 取消更新日志查看事件
			$scope.cancelLookUpdateLog = function() {
				$scope.updateLogDocument = false;
				$scope.lookUpdateLogVesselButton = true;
				$scope.canceLlookUpdateLogVesselButton = false;
			};

			// 更新日志列表
			/* 页面显示条数的切换：默认条数*/
			$scope.toggleVolume = '5';
			function requestUpdateLog() {
				var sendItemVolume = {
					limit:$scope.toggleVolume
				};
				netManager.get('/system/updatelog', sendItemVolume).then(function(res) {
					console.log("$scope.toggleVolume", $scope.toggleVolume)
					$scope.updateLogContentGetFromServer = res.data;
					console.log("res", res.data)
				}, function(err) {
					console.error(err);
				});
			}
			requestUpdateLog();
			
			//切换页面显示的更新条数
			
			/*思路：
			 * 1、点击视图按钮，传递相应的参数
			 * 2、接受参数并改变服务端限制标志limit
			 * 3、重新请求
			 */
			$scope.toggleDisplay = function(volume) {
				$scope.toggleVolume = volume;
				requestUpdateLog();
			}
			
			// 推送日志内容
			function pushLog() {
				netManager.get('/system/pushlog').then(function(res) {
					if(res.status === 200 && res.data !== "") {
						$('#updateLog').modal('show');
						$scope.pushLogData = res.data;
					}
				}, function(err) {
					console.error(err);
				});
			}
			pushLog();

			// 更新弹窗关闭事件
			$scope.closeUpdateModal = function(value) {
				$('#updateLog').modal('hide');
			};

			// 编辑日志
			$scope.summernoteText = '';
			$scope.versionNumber = '';

			// 插件配置项
			$scope.options = {
				height: 500,
				focus: true,
				airMode: true
			};

			// 编辑弹窗
			$scope.editLog = function(valueItem) {
				$scope.item = valueItem;
				$scope.editVersionNumber = $scope.item.version;
				$scope.summernoteText = $scope.item.content;
				$('#editLogContent').modal('show');
			}

			// 编辑提交
			$scope.submitText = function() {
				if($scope.summernoteText === '') {
					swal("提示", "不能提交空内容！", "warning");
				} else if($scope.editVersionNumber === '') {
					swal("提示", "版本号不能为空！", "warning");
				} else {
					SweetAlert.swal({
							title: "你确定提交内容吗？",
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
								$scope.sendData = {
									_id: $scope.item._id,
									version: $scope.editVersionNumber,
									content: $scope.summernoteText
								};
								console.log(Object.prototype.toString.call($scope.sendData.id));
								netManager.post('/system/editlog', $scope.sendData).then(function(res) {
									console.log("编辑",res);
									$('#editLogContent').modal('hide');
									swal("提示", "已提交", "success");
									requestUpdateLog();
								}, function(err) {
									console.log(err);
									swal("提示", "提交失败", "error");
								});
							}
						});
				}

			};
			
			// 清空
			$scope.clearContent = function() {
				if($scope.summernoteText === '') {

				} else {
					SweetAlert.swal({
							title: "你确定清空内容吗？",
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
								$scope.summernoteText = '';
								$scope.editVersionNumber = ''
								$('#editLogContent').modal('hide');
								swal("提示", "已清空", "success");
							}
						});
				}

			};
			

		}
	]);
}());