(function() {
	var app = angular.module('app.workOrder.createOrder', []);
	app.controller('createOrderCtrl', ['$scope', 'netManager', 'SweetAlert',
		function($scope, netManager, SweetAlert) {
			//初始化
			function init() {
				netManager.get('/workOrder/orderReady').then(function(res) {
					$scope.teamList = res.data.team;
					$scope.typeList = res.data.type;
					$scope.asinList = res.data.asin;
					$scope.shopList = res.data.shop;
				})
			};
			init();
			//上传配置
			$scope.files = [];
			$scope.upload = function(file) {
				$scope.files = [];
				$scope.$digest();
				for(var i = 0; i < file.files.length; i++) {
					console.log(file.files[i])
					var item = file.files[i];
					var reader = new FileReader();
					reader.readAsDataURL(item);
					reader.onload = function(name) {
						return function() {
							var info = this.result;
							$scope.files.push({
								name: name,
								data: info.substr(info.indexOf('base64,') + 7)
							});
							$scope.$digest()
						}
					}(item.name)
				}
			};
			//提交表单
			$scope.post = function() {
				$scope.formAdd.submitted = true;
				if($scope.formAdd.$valid) {
					if(!$scope.activeItem.isAsin) {
						delete $scope.initData.asin;
						delete $scope.initData.shop_name;
					};
					$scope.initData.fileInfo = $scope.files;
					netManager.post('/workOrder/createOrder', $scope.initData).then(function(res) {
						swal("保存成功!", 'success');
						$scope.formAdd.submitted = false;
						$scope.initData = null;
						$scope.files = [];
						$('#file').val(null)
					}).catch(function(err) {
						$scope.files = [];
						$('#file').val(null)
						swal("保存失败!", err.data.description, 'error');
					})
				}
			};
			//切换类型显示对应说明
			$scope.changeTips = function() {
				for(var i = 0; i < $scope.typeList.length; i++) {
					var type = $('#WOType').val().split(':')[1];
					if($scope.typeList[i].type == type) {
						$scope.activeItem = $scope.typeList[i];
						$scope.initData.content = $scope.typeList[i].remark;
						return
					}
				}
			}
			//取消
			$scope.cancel = function() {
				$scope.formAdd.submitted = false;
				$scope.initData = null;
			}
			
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