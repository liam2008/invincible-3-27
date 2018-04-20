(function() {
	var app = angular.module('app.workOrder.clickTask', []);
	app.controller('clickTaskCtrl', ['$scope', 'netManager', 'DTOptionsBuilder',
		function($scope, netManager, DTOptionsBuilder) {
			$scope.dtOptions = DTOptionsBuilder.newOptions()
				.withDOM('<"html5buttons"B>lTfgitp')
				.withButtons([{
					text: '任务添加',
					action: function(e, dt, node, config) {
						$scope.taskItem = {
							Status: '0',
							ExecuteNum: 1,
							Category: 'search-alias=aps',
							ExecuteTime: moment().subtract(16, 'hours').format('YYYY-MM-DD HH:mm:ss')
						};
						$scope.$digest();
						$('#saveTaskModal').modal('show');
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

			// 获取首页数据
			$scope.getTaskList = function() {
				// 新增任务权限默认为无
				$scope.isUpdateActive = false;

				// 如果是COO或者管理员 则有权限
				if(['COO', 'admin'].indexOf($scope.account.role.type) != -1) {
					$scope.isUpdateActive = true;
				}
				// 如果是黎广怡 和 温牡翠 也有权限
				else if($scope.account.name == '黎广怡' || $scope.account.name == '温牡翠') {
					$scope.isUpdateActive = true;
				}

				// 如果没有权限则把按钮删掉
				if($scope.isUpdateActive == false) {
					delete $scope.dtOptions.buttons[0];
				}

				if(['CSDDirector', 'CSDMember', 'admin'].indexOf($scope.account.role.type) == -1) {
					$scope.isNoteActive = false
				} else {
					$scope.isNoteActive = true
				};
				netManager.get('/workOrder/clickTask').then(function(res) {
					$scope.taskList = res.data;
					$scope.taskList.map(function(item) {
						item.Status = item.Status.toString();
						item.ExecuteTime = moment(item.ExecuteTime).subtract(16, 'hours').format('YYYY-MM-DD HH:mm');
						return item
					})
				})
			};
			$scope.getTaskList();

			// 编辑操作
			$scope.update = function(val) {
				$scope.taskItem = JSON.parse(JSON.stringify(val));
				$('#saveTaskModal').modal('show');
			};

			// 更改排名
			$scope.changeNote = function(val, index, Note) {
				if(index) {
					if(Note != val.Note) {
						val.Note = Note;
						$scope.saveReq(val, true)
					};
					$scope.showNote = false;
				} else {
					$scope.Note = JSON.parse(JSON.stringify(val.Note));
					$scope.showNote = val.Id;
				}
			};
			$scope.unShowNote = function() {
				setTimeout(function() {
					$scope.showNote = false;
				}, 1000)
			}

			// 任务保存
			$scope.saveTask = function() {
				var formControl = document.querySelectorAll('#saveTaskModal .form-control[required]');
				for(var i = 0; i < formControl.length; i++) {
					if(formControl[i].value.trim() != '') formControl[i].style.borderColor = '#e5e6e7';
					else {
						formControl[i].value = '';
						formControl[i].style.borderColor = '#ed5565';
						formControl[i].placeholder = '不能为空！';
						return;
					}
				};
				var data = JSON.parse(JSON.stringify($scope.taskItem));
				data.ExecuteTime = moment(data.ExecuteTime).add(16, 'hours').format('YYYY-MM-DD HH:mm');
				$scope.saveReq(data)
			};

			// 保存请求 
			$scope.saveReq = function(val, note) {
				if(note) {
					val.UpNote = true;
				} else if(!note && moment(val.ExecuteTime) <= moment()) {
					swal('提示', '执行时间不能太接近当前时间', 'warning')
					return;
				};
				netManager.post('/workOrder/clickTask', val).then(function(res) {
					if(val.Id) {
						if(res.data.error) {
							swal('更新失败', res.data.error, 'warning')
						} else {
							swal('更新成功', val.Asin, 'success');
							$('#saveTaskModal').modal('hide');
						}
					} else {
						if(res.data.error) {
							swal('添加失败', res.data.error, 'warning')
						} else {
							swal('添加成功', val.Asin, 'success');
							$('#saveTaskModal').modal('hide');
						}
					};
					$scope.getTaskList();
				})
			};

		}
	])
})();