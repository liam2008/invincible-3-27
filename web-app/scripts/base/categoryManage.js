(function() {
	var app = angular.module('app.base.categoryManage', []);
	app.controller('categoryManage', ['$scope', 'netManager', 'DTOptionsBuilder', 'SweetAlert',
		function($scope, netManager, DTOptionsBuilder, SweetAlert) {
			// 数据表格配置
			$scope.dtOptions = DTOptionsBuilder.newOptions()
				.withDOM('<"html5buttons"B>lTfgitp')
				.withButtons([{
					text: '添加品类',
					action: function(e, dt, node, config) {
						//初始化
						$scope.addCategoryData = {};
						$scope.formAdd.submitted = false;
						$scope.$digest();
						$('#addCategoryModal').modal('show');
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

			//初始化
			initialize();
			//添加品类
			
			//添加检验初值
			$scope.addIsNotChinese = true ;
			$scope.addIsShortName = true ;
			$scope.addIsChinese = true ;
			
			$scope.addCategory = function() {
				$scope.formAdd.submitted = true;
				/* 重新赋值是为了排除当第一次输入不符合，然后在输入空格这种情况*/
				$scope.addIsChinese = true ;
				//正则检验
				var ChineseReg = /^[\u0391-\uFFE5]+$/g ;
				var shortNameReg = /^[a-zA-Z]{3}$/g ;
				//当时中文的时候就是false
				var isNotChinese = !ChineseReg.test($scope.addCategoryData.name);
				var isShortName = shortNameReg.test($scope.addCategoryData.shortName);
				/*中文名输入框需要输入中文的时候即值不为undefined,null和空时，才对输入字符串进行检验。*/
				if($scope.addCategoryData.chineseName !== undefined && $scope.addCategoryData.chineseName !== '' && $scope.addCategoryData.chineseName !== null){
					var isChinese = ChineseReg.test($scope.addCategoryData.chineseName);
					    $scope.addIsChinese = isChinese ;
				}
				$scope.addIsNotChinese = isNotChinese ;
				$scope.addIsShortName = isShortName ;
				
				if($scope.addIsNotChinese && $scope.addIsShortName && $scope.addIsChinese){
					if($scope.formAdd.$valid) {
						var sendData = {
							name: $scope.addCategoryData.name || null,
							shortName: $scope.addCategoryData.shortName || null,
							chineseName: $scope.addCategoryData.chineseName || null,
						};	
						
						netManager.post('/category/save', sendData).then(function(res) {
							if(res.status === 200) {
								$('#addCategoryModal').modal('hide');
								swal("添加成功!", "", "success");
								initialize();
							} 
						}, function(err) {
							swal("添加失败", "请检查品类名！", "error");
						});
					}
				}
			};
			//点击编辑
			$scope.editIsNotChinese = true ;
			$scope.editIsShortName = true ;
			$scope.editIsChinesee = true ;
			//编辑检验初值
			$scope.edit = function(item) {
				$scope.activeItem = JSON.parse(JSON.stringify(item));
				$scope.formEdit.submitted = true;
				//点击保存
				$scope.save = function() {
					/* 重新赋值是为了排除当第一次输入不符合，然后在输入空格这种情况*/
					$scope.editIsChinesee = true ;
					//检验正则
					var ChineseReg = /^[\u0391-\uFFE5]+$/g ;
					var shortNameReg = /^[a-zA-Z]{3}$/g ;
					var isNotChinese = !ChineseReg.test($scope.activeItem.name);
					var isShortName = shortNameReg.test($scope.activeItem.shortName);
					/*中文名输入框需要输入中文的时候即值不为undefined,null和空时，才对输入字符串进行检验。*/
					if($scope.activeItem.chineseName !== null && $scope.activeItem.chineseName !==undefined && $scope.activeItem.chineseName !==''){
						var isChinese = ChineseReg.test($scope.activeItem.chineseName);
						    $scope.editIsChinesee = isChinese ;
					}
					//视图判断变量
					$scope.editIsNotChinese = isNotChinese ;
					$scope.editIsShortName = isShortName ;
					if($scope.editIsNotChinese && $scope.editIsShortName && $scope.editIsChinesee)	{
						if($scope.formEdit.$valid) {
							var sendModifyData = {
									id: $scope.activeItem._id,
									chineseName: $scope.activeItem.chineseName || null,
									name: $scope.activeItem.name || null,
									shortName: $scope.activeItem.shortName || null
								};
								console.log("sendModifyData", sendModifyData)
								netManager.post('/category/update',sendModifyData).then(function(res) {
										console.log("resEdit", res)
										if(res.data.nModified === 1 ) {
												$('#editModal').modal("hide");
												swal('编辑成功！', '', 'success');
												//重新渲染
												initialize();
										}else {
											swal("编辑失败", "请检查品类名！", "error");
										}
								}, function(err) {
									console.error(err);
								});
						}
					}
						
				};
			};
			//删除品类
			$scope.delete = function(item) {
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
							var sendId = {
								id: item._id
							};
							netManager.get('/category/remove', sendId).then(function(res) {
								console.log("删除响应", res)
								if(res.data.ok === 1) {
									$scope.categoryList.splice($scope.categoryList.indexOf(item), 1);
									swal('删除成功！', '', 'success');
								} else {
									swal('删除失败！', '', 'error');
								}
							});
						}
				});
			};
			function initialize() {
				//获取数据
				netManager.get('/category/list').then(function(res) {
					$scope.categoryList = res.data;
				});
			}

		}
	]);
})();