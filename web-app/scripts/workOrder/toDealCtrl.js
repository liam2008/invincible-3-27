(function() {
	var app = angular.module('app.workOrder.toDeal', []);

	app.controller('toDealCtrl', ['$scope', '$filter', 'netManager', '$stateParams', '$state',
		function($scope, $filter, netManager, $stateParams, $state) {
			var id = $stateParams.id;
			$scope.fromPage = $stateParams.fromPage;

			init();

			//完结处理
			$scope.endOrder = function() {
				var dealData = {
					log: $scope.handleData.log,
					id: id,
					state: 2
				};
				console.log('dealData', dealData);
				netManager.post('/workOrder/dealOrder', dealData).then(function(res) {
					$state.go($scope.fromPage, {
						'currentPage': window.sessionStorage.getItem('currentPage')
					});
				}, function(err) {
					swal("保存失败", err.description, "error");
					console.error(err);
				});
			};

			//取消转派
			$scope.cancel = function() {
				$state.go($scope.fromPage, {
					'currentPage': window.sessionStorage.getItem('currentPage')
				});
			};

			//转派
			$scope.sendTurn = function() {
				$state.go('main.workOrder.turnOrder', {
					id: id,
					log: $scope.handleData.log
				});
			};

			//初始化
			function init() {
				$scope.ativeTab = $scope.fromPage == 'main.workOrder.dealingOrder' ? 0 : 1;
				netManager.get('/workOrder/openOrder', {
					id: $stateParams.id
				}).then(function(res) {
					$scope.handleData = res.data
				})
			}

			//上传配置
			$scope.files = [];
			$scope.upload = function(file) {
				$scope.files = [];
				$scope.$digest();
				for(var i = 0; i < file.files.length; i++) {
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
			$scope.download = function(val) {
				if(['jpg', 'png'].indexOf(val.name.split('.')[1]) != -1) {
					window.open(val.path)
				} else {
					window.open(App.config.server + '/files/download?path=' + val.path + '&name=' + val.name)
				}
			};
			$scope.saveUpload = function(item) {
				if(item) {
					swal({
						title: "确定删除吗？",
						text: "你将无法恢复该虚拟文件！",
						type: "warning",
						showCancelButton: true,
						closeOnConfirm: false
					}, function() {
						netManager.post('/workOrder/orderFiles', {
							id: $stateParams.id,
							delFileItem: item._id
						}).then(function(res) {
							if($scope.handleData.fileInfo.indexOf(item) != -1) {
								$scope.handleData.fileInfo.splice($scope.handleData.fileInfo.indexOf(item), 1);
								swal("删除！", "你的文件已经被删除。", "success");
							}
						})
					})
				} else if($scope.files.length) {
					netManager.post('/workOrder/orderFiles', {
						id: $stateParams.id,
						addFileInfo: $scope.files
					}).then(function(res) {
						netManager.get('/workOrder/openOrder', {
							id: $stateParams.id
						}).then(function(res) {
							$scope.files = [];
							$('#file').val(null);
							$scope.handleData.fileInfo = res.data.fileInfo;
							swal("成功！", "你的文件已经上传成功。", "success");
						})
					})
				}
			};

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
				})
			};
			problemTypes();

		}
	]);
}());