(function() {
	var app = angular.module("app.authority.creatVersionsLog", []);
	app.controller("creatVersionsLogCtrl", ['$scope', 'netManager', "SweetAlert",
		function($scope, netManager, SweetAlert) {

			$scope.summernoteText = '';
			$scope.versionNumber = '';
			
			// 插件配置项
			$scope.options = {
				height: 500,
				focus: true,
				airMode: true
			};

			// 提交
			$scope.submitText = function() {
				if($scope.summernoteText === '') {
					swal("提示", "不能提交空内容！", "warning");
				} else if($scope.versionNumber === '') {
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
								var sendData = {
									version: $scope.versionNumber,
									content: $scope.summernoteText
								};
								netManager.post('/system/addlog', sendData).then(function(res) {
									console.log(res);
									if(res.status === 200) {
										swal("提示", "已提交", "success");
									}
								}, function(err) {
									swal("提示", "提交失败", "success");
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
								$scope.versionNumber = ''
								swal("提示", "已清空", "success");
							}
						});
				}

			};
			
			// 最新版本号
			function logVersion() {
				netManager.get('/system/version').then(function(res) {
					if(res.statusText === "OK") {
						$scope.versionNumberPlaceholder = "当前版本为："+res.data;
					}
				}, function(err) {
					swal("提示", err, "success");
				});
			}
			logVersion();
		}
	]);
}())