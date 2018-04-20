(function() {
	var app = angular.module('app.workOrder.productGather', []);
	app.controller('productGatherCtrl', ['$scope', 'netManager', 'DTOptionsBuilder', '$filter', 'SweetAlert',
		function($scope, netManager, DTOptionsBuilder, $filter, SweetAlert) {
			// 表格控件选择商品
			$scope.dtOptionsGoods = DTOptionsBuilder.newOptions()
				.withDOM('<"html5buttons"B>lTfgitp')
				.withButtons([{
					text: '保存选择',
					action: function(e, dt, node, config) {
						$scope.activeItem.merchandise = [];
						for(var i = 0; i < $scope.checkIdList.length; i++) {
							$scope.activeItem.merchandise.push({
								_id: $scope.checkIdList[i],
								asin: $scope.checkAsinList[i]
							})
						};
						$scope.$digest();
						$('#selectProduct').modal('hide');
					}
				}])
			// 表格控件商品集合列表
			$scope.dtOptions = DTOptionsBuilder.newOptions()
				.withDOM('<"html5buttons"B>lTfgitp')
				.withButtons([{
					text: '添加商品集合',
					action: function(e, dt, node, config) {
						$scope.activeItem = {
							name: '',
							remark: '',
							merchandise: []
						};
						$scope.$digest();
						$('#saveModal').modal('show');
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

			// 获取初始数据
			$scope.loadList = function() {
				netManager.get('/workOrder/orderGoods').then(function(res) {
					$scope.productList = res.data.list;
					$scope.merchandiseList = res.data.merchandise;
				})
			};
			$scope.loadList();
			// 编辑模态框
			$scope.saveModal = function(item) {
				$scope.activeItem = JSON.parse(JSON.stringify(item));
				$('#saveModal').modal('show');
			};
			// 选择商品操作
			$scope.selectProduct = function() {
				$scope.checkIdList = [];
				$scope.checkAsinList = [];
				$scope.activeItem.merchandise.map(function(item) {
					$scope.checkIdList.push(item._id);
					$scope.checkAsinList.push(item.asin)
				});
				// 除了当前 过滤已选择
				var goods = [];
				$scope.productList.map(function(item) {
					item.merchandise.map(function(m) {
						if($scope.activeItem._id) {
							if($scope.checkIdList.indexOf(m._id) == -1) goods.push(m._id)
						} else {
							goods.push(m._id)
						}
					})
				});
				var merchandiseList = [];
				$scope.merchandiseList.map(function(item) {
					if(goods.indexOf(item._id) == -1) merchandiseList.push(item)
				});

				// 商品选择弹窗列表清单
				var tableOption = new Table();
				tableOption.init(merchandiseList);
				$scope.tableOption = tableOption;
				$scope.allData = merchandiseList;

				// $scope.selectProductList = merchandiseList;
				$('#selectProduct').modal('show');
			};
			$scope.checkbox = function(item) {
				if(item) {
					if($scope.checkIdList.indexOf(item._id) == -1) {
						$scope.checkIdList.push(item._id);
						$scope.checkAsinList.push(item.asin)
					} else {
						$scope.checkIdList.splice($scope.checkIdList.indexOf(item._id), 1);
						$scope.checkAsinList.splice($scope.checkAsinList.indexOf(item.asin), 1)
					};
					// 计算全选
					var tableListAll = [];
					for(var i = 0; i < $scope.tableOption.tableList.length; i++) {
						tableListAll.push($scope.tableOption.tableList[i]._id);
					};
					$scope.checkAll = true;
					for(var i = 0; i < $scope.tableOption.tableList.length; i++) {
						if($scope.checkIdList.toString().indexOf($scope.tableOption.tableList[i]._id) == -1) {
							$scope.checkAll = false;
							return
						}
					}
				} else {
					if($scope.checkAll) {
						$scope.checkAll = false;
						$scope.tableOption.tableList.map(function(item) {
							if($scope.checkIdList.indexOf(item._id) != -1) {
								$scope.checkIdList.splice($scope.checkIdList.indexOf(item._id), 1)
								$scope.checkAsinList.splice($scope.checkAsinList.indexOf(item.asin), 1)
							}
						})
					} else if(!$scope.checkIdList.length || !$scope.checkAll) {
						$scope.checkAll = true;
						$scope.tableOption.tableList.map(function(item) {
							if($scope.checkIdList.indexOf(item._id) == -1) {
								$scope.checkIdList.push(item._id);
								$scope.checkAsinList.push(item.asin)
							}
						})
					}
				}
			};
			// 请求保存
			$scope.saveItem = function() {
				netManager.post('/workOrder/orderGoods', $scope.activeItem).then(function(res) {
					if(res.data.errmsg) {
						swal('名称已存在', '请重新输入名称！', 'error');
					} else {
						$('#saveModal').modal('hide');
						$scope.activeItem._id ? swal('编辑成功', '', 'success') : swal('添加成功', '', 'success');
						$scope.loadList();
					};
					$scope.checkIdList = [];
					$scope.checkAsinList = []
				})
			}

			//table 方法
			function Table() {
				this.initList = []; //初始化数
				this.searchList = []; //保存搜索出来
				this.tableList = []; //呈现在页面的数据
				this.itemsPerPage = 10;
				this.totalItems = 0;
				this.currentPage = 1;
				this.searchData = ''
			}
			Table.prototype = {
				constructor: Table,
				pageChangeFn: function() {
					var skip = (this.currentPage - 1) * this.itemsPerPage;
					if(this.searchData) { //有搜索内容
						this.tableList = angular.copy(this.searchList).splice(skip, this.itemsPerPage);
						this.totalItems = this.searchList.length;
					} else { //没有搜索内容
						this.tableList = angular.copy(this.initList).splice(skip, this.itemsPerPage);
						this.totalItems = this.initList.length;
					};
					// 计算全选
					var tableListAll = [];
					for(var i = 0; i < this.tableList.length; i++) {
						tableListAll.push(this.tableList[i]._id);
					};
					$scope.checkAll = true;
					for(var i = 0; i < this.tableList.length; i++) {
						if($scope.checkIdList.toString().indexOf(this.tableList[i]._id) == -1) {
							$scope.checkAll = false;
							return
						}
					}
				},
				searchFn: function() {
					if(!this.searchData) { //没有搜索内容
						this.currentPage = 1;
					}
					this.searchList = $filter('filter')(angular.copy(this.initList), this.searchData);
					this.pageChangeFn();
				},
				init: function(renderList) {
					this.initList = renderList;
					this.pageChangeFn();
				}
			};

			// 保存选择
			$scope.saveSelectItem = function() {
				$scope.activeItem.merchandise = [];
				for(var i = 0; i < $scope.checkIdList.length; i++) {
					$scope.activeItem.merchandise.push({
						_id: $scope.checkIdList[i],
						asin: $scope.checkAsinList[i]
					})
				};
				$('#selectProduct').modal('hide');
			}
			// 全部选择
			$scope.allSelect = function() {
				$scope.checkAll = false;
				$scope.checkIdList = [];
				$scope.checkAsinList = [];
			}

			// 列表中添加删除功能
			$scope.deleteItem = function(item) {
				SweetAlert.swal({
						title: "你确定删除吗?",
						text: "你将删除此条数据!",
						type: "warning",
						showCancelButton: true,
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						closeOnConfirm: false,
						closeOnCancel: true
					},
					function(isConfirm) {
						if(isConfirm) {
							netManager.delete('/workOrder/orderGoods/' + item._id).then(function(res) {
								if(res.data.errmsg) {
									swal('删除失败！', '', 'error');
								} else {
									$scope.productList.splice($scope.productList.indexOf(item), 1);
									swal('删除成功！', '', 'success');
								}
							})
						}
					});
			}

		}
	]);
})();