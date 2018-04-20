(function() {
	var app = angular.module('app.workOrder.notice', []);
	app.controller('noticeCtrl', ['$scope', 'netManager',
		function($scope, netManager) {

			laydate.render({
				elem: '#startTime',
				type: 'datetime'
			});
			laydate.render({
				elem: '#endTime',
				type: 'datetime'
			});

			function loadList() {
				$scope.isLoad = false;
				netManager.get('/workOrder/orderNotice').then(function(res) {
					$scope.noticeList = res.data;
					setTimeout(function() {
						$scope.isLoad = true;
						$scope.$digest();
						$('.footable').trigger('footable_redraw')
					})
				})
			}
			loadList()

			$scope.onSave = function(val) {
				$scope.activeItem = val ? JSON.parse(JSON.stringify(val)) : {};
				$('#saveModal').modal('show')
			}
			$scope.onRemove = function(val) {
				swal({
					title: '确定删除吗？',
					text: '你将无法恢复该公告！',
					type: 'warning',
					showCancelButton: true,
					closeOnConfirm: false,
					cancelButtonText: "取消",
					confirmButtonText: "确定",
				}, function() {
					netManager.delete('/workOrder/orderNotice/' + val._id).then(function(res) {
						swal('删除！', '你的该公告已经被删除。', 'success');
						loadList()
					}).catch(function(err) {
						swal('错误！', '请重新尝试！', 'error');
					})
				})
			}
			$scope.onStatus = function(val) {
				if(val.status) {
					//如果当前时间在起止时间区间内（正常公告中）
					val.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
					$scope.activeItem = val;
					$scope.saveModal(true)
				} else if(!val.status && moment() < moment(val.startTime)) {
					//如果当前时间<开始时间（还没开始公告，状态已失效）
					val.startTime = val.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
					$scope.activeItem = val;
					$scope.saveModal(true)
				}
			}
			$scope.saveModal = function(onStatus) {
				if(!onStatus) {
					$scope.activeItem.startTime = $('#startTime').val();
					$scope.activeItem.endTime = $('#endTime').val();
				};
				if(!$scope.activeItem.title || $scope.activeItem.title == '') {
					swal('错误！', '标题不能为空！', 'warning');
					return
				}
				if(!$scope.activeItem.content || $scope.activeItem.content == '') {
					swal('错误！', '内容不能为空！', 'warning');
					return
				}
				if($scope.activeItem.startTime == '') {
					swal('错误！', '开始时间不能为空！', 'warning');
					return
				}
				if($scope.activeItem.endTime == '') {
					swal('错误！', '结束时间不能为空！', 'warning');
					return
				}
				netManager.post('/workOrder/orderNotice', $scope.activeItem).then(function(res) {
					$('#saveModal').modal('hide');
					if($scope.activeItem._id) {
						swal('编辑！', '你的该公告已经被编辑。', 'success');
					} else {
						swal('添加！', '你的该公告已经被添加。', 'success');
					};
					loadList()
				}).catch(function(err) {
					swal('错误！', '请重新尝试！', 'error');
				})
			}

		}
	])
})();