(function() {
	var app = angular.module('app.goodsRegulate.commodityManagement', []);
	app.controller('commodityManagementCtrl', ['$scope', 'netManager', 'DTOptionsBuilder', 'SweetAlert',
		function($scope, netManager, DTOptionsBuilder, SweetAlert) {
			$scope.dtOptionsNew = DTOptionsBuilder.newOptions();
			$scope.where = {};

			init();

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

			//初始化页面
			function init(value) {
				if(!value) {
					var senfObj = {};
				} else {
					var senfObj = value;
				}
				$scope.isLoad = true;
				netManager.get('/product/list', senfObj).then(function(res) {
					var productList = res.data;
					// 排序--后端返回的数据是先按照状态排序，再按照时间排序的
					var arrTrue = [];
					var arrFalse = [];
					for(var i = 0; i < productList.length; i++) {
						if(productList[i].deleted === true) {
							// 作废状态
							arrTrue.push(productList[i]);
						} else {
							// 正常状态
							arrFalse.push(productList[i]);
						}
					}
					productList = arrFalse.concat(arrTrue);
					var tableOption = new Table();
					tableOption.init(productList);
					$scope.tableOption = tableOption;
					$scope.isLoad = false;
				}).catch(function(res) {
					swal('错误', res.data.error, 'error')
				})
			}

			// 根据产品的状态来进行列表的排序-正常的在前，作废的在后
			function compare(propertyName) {
				return function(object1, object2) {
					var value1 = object1[propertyName];
					var value2 = object2[propertyName];
					if(value2 < value1) {
						return 1;
					} else if(value2 < value1) {
						return -1;
					} else {
						return 0;
					}
				}
			};

			//视图显示控制
			$scope.handleActive = function(val) {
				delete $scope.err;
				$scope.activeItem = {};
				if(!val.activeShow) {
					init();
					$scope.activeShow = val.activeShow;
				} else if(val.activeShow === '新增产品') {
					$scope.process = '0';
					$scope.addCheckedFalse = true;
					$scope.addCheckedTrue = false;

					$scope.activeItem.details = [];
					$scope.notSave = {};
					$scope.notSave.storeNumber = "1";
					$scope.notSave.storeSku = '';

					// 用于子项添加判断的数组
					$scope.arrSku = [];
					$scope.activeShow = val.activeShow;
				} else {
					$scope.index = val.activeItem;
					$scope.activeItem.details = [];

					// 不需要保存到数据库的数据
					$scope.notSave = {};
					$scope.notSave.storeNumber = "1";
					$scope.notSave.storeSku = '';

					var editItem = $scope.tableOption.tableList[$scope.index];

					// 判断是否需要加工的标志
					var processFlag = editItem.combination.length;
					if(processFlag === 0) {
						$scope.process = '0';
						$scope.checkedFalse = true;
						$scope.checkedTrue = false;
					} else {
						$scope.process = '1';
						$scope.checkedFalse = false;
						$scope.checkedTrue = true;
					}

					// 修改记录
					netManager.get('/product/info', {
						store_sku: editItem.store_sku
					}).then(function(res) {
						$scope.productMessage = res.data;
						$scope.activeItem = {
							'editName_cn': $scope.productMessage.name_cn,
							'editStore_sku': $scope.productMessage.store_sku,
							'editClassify': $scope.productMessage.classify,
							'editName_en': $scope.productMessage.name,
							'details': $scope.productMessage.combination,
							'editCount': 1,
							'histories': $scope.productMessage.histories
						};
					}).catch(function(res) {
						swal('错误', res.data.error, 'error')
					})

					// 用于子项添加判断的数组
					$scope.arrSku = [];
					$scope.activeShow = val.activeShow;
				}
			};

			// 产品分类列表
			$scope.classify = [{
				classifyItem: "Amazon Launchpad(FAL)"
			}, {
				classifyItem: "Appliances(JAP)"
			}, {
				classifyItem: "Apps & Games(RAG)"
			}, {
				classifyItem: "Arts, Crafts & Sewing(YAC)"
			}, {
				classifyItem: "Automotive(QAM)"
			}, {
				classifyItem: "Baby(RBB)"
			}, {
				classifyItem: "Beauty & Personal Care(GBP)"
			}, {
				classifyItem: "Books(SBK)"
			}, {
				classifyItem: "Camera & Photo(XCP)"
			}, {
				classifyItem: "CDs & Vinyl(CCV)"
			}, {
				classifyItem: "Cell Phones & Accessories(DCL)"
			}, {
				classifyItem: "Clothing, Shoes & Jewelry(FCS)"
			}, {
				classifyItem: "Collectible Coins(YCC)"
			}, {
				classifyItem: "Computers & Accessories(DCA)"
			}, {
				classifyItem: "Digital Music(YDM)"
			}, {
				classifyItem: "Electronics(DET)"
			}, {
				classifyItem: "Entertainment Collectibles(SEC)"
			}, {
				classifyItem: "Gift Cards(HGC)"
			}, {
				classifyItem: "Grocery & Gourmet Food(SGG)"
			}, {
				classifyItem: "Health & Household(GHH)"
			}, {
				classifyItem: "Home & Kitchen(JHK)"
			}, {
				classifyItem: "Industrial & Scientific(GIS)"
			}, {
				classifyItem: "Kindle Store(KKS)"
			}, {
				classifyItem: "Kitchen & Dining(JKD)"
			}, {
				classifyItem: "Magazine Subscriptions(ZMS)"
			}, {
				classifyItem: "Movies & TV(DMT)"
			}, {
				classifyItem: "Musical Instruments(YMI)"
			}, {
				classifyItem: "Office Products(BOP)"
			}, {
				classifyItem: "Patio, Lawn & Garden(JPL)"
			}, {
				classifyItem: "Pet Supplies(CPS)"
			}, {
				classifyItem: "Prime Pantry(HPP)"
			}, {
				classifyItem: "Software(RSW)"
			}, {
				classifyItem: "Sports & Outdoors(YSO)"
			}, {
				classifyItem: "Sports Collectibles(YSC)"
			}, {
				classifyItem: "Tools & Home Improvement(JHI)"
			}, {
				classifyItem: "Toys & Games(RTG)"
			}, {
				classifyItem: "Video Games(RVG)"
			}];

			// 产品SKU选择
			function getProductSkuList() {
				netManager.get('/purchase/productList').then(function(res) {
					$scope.productSkuList = res.data;
				}).catch(function(res) {
					swal('错误', res.data.error, 'error')
				});
			}
			getProductSkuList();

			$scope.submitSku = function(sku) {
				$scope.notSave.storeSku = sku.storeSku;
				$scope.proNameId = sku.id;
				$scope.proNameCN = sku.nameCN;
				$scope.proNameEN = sku.nameEn;
				$('#skuModal').modal('hide')
			};

			// 产品子项添加
			$scope.handleAddDetail = function() {
				var length = $scope.arrSku.length;
				// 新增
				if($scope.activeShow === '新增产品') {
					// 组合对象
					var combinationObject = {
						'_id': $scope.proNameId,
						'store_sku': $scope.notSave.storeSku,
						'name_cn': $scope.proNameCN
					};
					if($scope.notSave.storeSku !== "" && $scope.notSave.storeNumber !== "") {
						if(length === 0) {
							$scope.activeItem.details.push({
								store_sku: combinationObject,
								count: parseInt($scope.notSave.storeNumber) || 1
							})
							$scope.arrSku.push($scope.notSave.storeSku);
						} else {
							var flagSku = "";
							for(var i = 0; i < $scope.arrSku.length; i++) {
								if($scope.arrSku[i] === $scope.notSave.storeSku) {
									swal('添加失败!', '提示：库存SKU不能重复');
									flagSku = "0";
									break
								}
							}
							if(flagSku !== "0") {
								$scope.activeItem.details.push({
									store_sku: combinationObject,
									count: parseInt($scope.notSave.storeNumber)
								})
								$scope.arrSku.push($scope.notSave.storeSku);
							}
						}
					} else {
						swal('添加失败!', '提示：添加库存SKU或数量不能为空');
					}
				} else {
					if($scope.notSave.storeSku !== "" && $scope.notSave.storeNumber !== "") {
						// 数组拷贝 
						var arrayCopy = $scope.activeItem.details.slice(0);
						var combinationObject = {
							'_id': $scope.proNameId,
							'store_sku': $scope.notSave.storeSku,
							'name_cn': $scope.proNameCN
						};
						// 判断编辑是否有组合信息
						if(arrayCopy.length === 0) {
							if(length === 0) {
								$scope.activeItem.details.push({
									store_sku: combinationObject,
									count: parseInt($scope.notSave.storeNumber)
								})
								$scope.arrSku.push($scope.notSave.storeSku);
							} else {
								var flagSku = "";
								for(var i = 0; i < $scope.arrSku.length; i++) {
									if($scope.arrSku[i] === $scope.notSave.storeSku) {
										swal('添加失败!', '提示：库存SKU不能重复');
										flagSku = "0";
										break
									}
								}
								if(flagSku !== "0") {
									$scope.activeItem.details.push({
										store_sku: combinationObject,
										count: parseInt($scope.notSave.storeNumber)
									})
									$scope.arrSku.push($scope.notSave.storeSku);
								}
							}
						} else {
							var flagSku = "";
							for(var i = 0; i < arrayCopy.length; i++) {
								if(arrayCopy[i].store_sku.store_sku === $scope.notSave.storeSku) {
									swal('添加失败!', '提示：库存SKU不能重复');
									flagSku = "0";
									break
								}
							}
							// 验证后没有重复的信息
							if(flagSku !== '0') {
								$scope.activeItem.details.push({
									store_sku: combinationObject,
									count: parseInt($scope.notSave.storeNumber)
								})
								$scope.arrSku.push($scope.notSave.storeSku);
							}
						}
					} else {
						swal('添加失败!', '提示：添加库存SKU或数量不能为空');
					}
				}
			};

			// 子项移除
			$scope.handleRemoveDetail = function(item) {
				$scope.activeItem.details.splice($scope.activeItem.details.indexOf(item), 1);
				// 这个是删除添加数组判断的中间数组的元素
				$scope.arrSku.splice($scope.arrSku.indexOf(item.storeSku), 1);
			};

			// 产品添加
			$scope.briefFlag = false;
			$scope.abbreviation = false;
			$scope.saveItemAdd = function() {
				// 验证
				var inputEl = document.querySelectorAll('input[valid]');
				var selectEl = document.querySelectorAll('select[valid]');
				for(var i = 0; i < inputEl.length; i++) {
					if(inputEl[i].getAttribute('valid').search('required') >= 0) {
						if(inputEl[i].value.trim() != '') inputEl[i].style.borderColor = '#e5e6e7';
						else {
							inputEl[i].value = '';
							inputEl[i].style.borderColor = '#ed5565';
							inputEl[i].placeholder = '不能为空！';
							return;
						}
					}
				}
				// 简称验证
				var stringS = $scope.activeItem.addName_brief;
				var reg = /^[a-zA-Z0-9]{1,5}$/;
				$scope.result = reg.test(stringS);
				if($scope.result === false) {
					$scope.abbreviation = true;
				} else {
					$scope.abbreviation = false;
					// 产品分类判断
					var classifyString = $scope.activeItem.productClassify;
					if(!classifyString) {
						$scope.briefFlag = true;
					} else {
						$scope.briefFlag = false;
						// 选择是时，组合信息清单不能为空，且总数量要大于1
						if($scope.process === '1') {
							var combitionLength = $scope.activeItem.details.length;
							if(combitionLength === 0) {
								swal("提示", '清单不能为空！', 'error');
							} else {
								var sum = 0;
								for(var z = 0; z < combitionLength; z++) {
									sum += $scope.activeItem.details[z].count;
								}
								if(sum <= 1) {
									swal("提示", '清单总数量应大于1！', 'error');
								} else {
									itemSave('add');
								}
							}
						} else {
							itemSave('add');
						}
					}

				}
			};

			// 编辑保存
			$scope.saveItemEdit = function() {
				// 验证
				var inputEl = document.querySelectorAll('input[valid]');
				var selectEl = document.querySelectorAll('select[valid]');
				for(var i = 0; i < inputEl.length; i++) {
					if(inputEl[i].getAttribute('valid').search('required') >= 0) {
						if(inputEl[i].value.trim() != '') inputEl[i].style.borderColor = '#e5e6e7';
						else {
							inputEl[i].value = '';
							inputEl[i].style.borderColor = '#ed5565';
							inputEl[i].placeholder = '不能为空！';
							return;
						}
					}
				}
				// 选择是时，组合信息清单不能为空，且总数量要大于1
				if($scope.process === '1') {
					var combitionLength = $scope.activeItem.details.length;
					if(combitionLength === 0) {
						swal("提示", '清单不能为空！', 'error');
					} else {
						var sum = 0;
						for(var z = 0; z < combitionLength; z++) {
							sum += $scope.activeItem.details[z].count;
						}
						if(sum <= 1) {
							swal("提示", '清单总数量应大于1！', 'error');
						} else {
							itemSave('edit');
						}
					}
				} else {
					itemSave('edit');
				}
			};

			// 添加和保存的函数
			function itemSave(flag) {
				var title = "";
				var text = "";
				if(flag === 'edit') {
					title = "你确定修改吗？";
					text = "你将修改此条数据！";
				} else {
					title = "你确定添加吗？";
					text = "你将添加此条数据！";
				}
				SweetAlert.swal({
						title: title,
						text: text,
						type: "warning",
						showCancelButton: true,
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						closeOnConfirm: false,
						closeOnCancel: true
					},
					function(isConfirm) {
						if(isConfirm) {
							var combinationArrayObject = combinationFunction($scope.activeItem.details);
							if(flag === 'edit') {
								var editChineseName = Trim($scope.activeItem.editName_cn, "g");
								var editComfirmData = {
									'store_sku': $scope.activeItem.editStore_sku,
									'name': $scope.activeItem.editName_en,
									'name_cn': editChineseName,
									'combination': combinationArrayObject
								};
								netManager.post('/product/update', editComfirmData).then(function(res) {
									console.log("状态", res.status);
									if(res.data) $scope.handleActive({});
									swal('成功', '', 'success');
								}).catch(function(res) {
									swal('提示', "产品中文名不能重复", 'error');
								})
							} else {
								// 根据产品分类ID匹配产品分类的简称
								var addChineseName = Trim($scope.activeItem.addName_cn, "g");
								var addComfirmData = {
									'name': $scope.activeItem.addName_en,
									'name_cn': addChineseName,
									'name_brief': $scope.activeItem.addName_brief,
									'classify': $scope.activeItem.productClassify,
									'combination': combinationArrayObject
								};
								netManager.post('/product/save', addComfirmData).then(function(res) {
									if(res.data) $scope.handleActive({});
									getProductSkuList();
									swal('成功', '', 'success');
								}).catch(function(res) {
									swal('提示', "产品中文名不能重复", 'error');
								})
							}
						}
					});
			}

			// 作废处理
			$scope.cancellation = function(value, index) {
				SweetAlert.swal({
						title: "你确定作废吗?",
						text: "你将作废此条数据!",
						type: "warning",
						showCancelButton: true,
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						closeOnConfirm: false,
						closeOnCancel: true
					},
					function(isConfirm) {
						if(isConfirm) {
							var cancellationItem = $scope.tableOption.tableList[index];
							netManager.get('/product/remove', {
								store_sku: cancellationItem.store_sku
							}).then(function(res) {
								if(res.data) $scope.handleActive({});
								swal('成功', '', 'success');
							}).catch(function(res) {
								swal('错误', res.data.error, 'error');
							})
						}
					});
			};

			// 恢复处理
			$scope.recover = function(value, index) {
				SweetAlert.swal({
						title: "你确定恢复吗?",
						text: "你将恢复此条数据!",
						type: "warning",
						showCancelButton: true,
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						closeOnConfirm: false,
						closeOnCancel: true
					},
					function(isConfirm) {
						if(isConfirm) {
							var cancellationItem = $scope.tableOption.tableList[index];
							console.log(cancellationItem.store_sku);
							netManager.get('/product/remove', {
								store_sku: cancellationItem.store_sku
							}).then(function(res) {
								if(res.data) $scope.handleActive({});
								swal('成功', '', 'success');
							}).catch(function(res) {
								swal('错误', res.data.error, 'error');
							})
						}
					});
			};

			// 取消
			$scope.abolishItem = function() {
				$scope.activeItem = {};
				$scope.notSave.storeNumber = 1;
			};

			// 组合子项函数
			function combinationFunction(value) {
				var arrCombition = [];
				for(var i = 0; i < value.length; i++) {
					arrCombition.push({
						count: value[i]['count'],
						store_sku: value[i]['store_sku']['_id'],
						index: value[i]['store_sku']['store_sku']
					});
				}
				return arrCombition;
			}

			// 去掉中文名称的所有空格
			function Trim(str, is_global) {
				var wentToTheSpace;
				wentToTheSpace = str.replace(/(^\s+)|(\s+$)/g, "");
				if(is_global.toLowerCase() == "g") {
					wentToTheSpace = wentToTheSpace.replace(/\s/g, "");
				}
				return wentToTheSpace;
			}

			// 搜索
			$scope.searchItem = function() {
				if(!$scope.where.name) {
					$scope.where.name = '';
				}
				if(!$scope.where.name_cn) {
					$scope.where.name_cn = '';
				}
				if(!$scope.where.roductClassify) {
					$scope.where.roductClassify = '';
				}
				var findData = {
					'name': $scope.where.name,
					'name_cn': $scope.where.name_cn,
					'classify': $scope.where.roductClassify
				};
				console.log("搜索", findData);
				init(findData);
			};

			// 选择否的时候清空组合的信息--编辑
			$scope.checkFalse = function() {
				$scope.process = '0';
				$scope.checkedFalse = true;
				$scope.checkedTrue = false;
				$scope.activeItem.details = [];
				$scope.notSave.storeSku = '';
			};
			$scope.checkTrue = function() {
				$scope.process = '1';
				$scope.checkedFalse = false;
				$scope.checkedTrue = true;
				// 选择是的时候，将原先加载的数据显示出来
				$scope.activeItem.details = $scope.productMessage.combination;
			};
			// 选择否的时候清空组合的信息--新增
			$scope.addCheckFalse = function() {
				$scope.process = '0';
				$scope.addCheckedFalse = true;
				$scope.addCheckedTrue = false;
				$scope.activeItem.details = [];
				$scope.notSave.storeSku = '';
			};
			$scope.addCheckTrue = function() {
				$scope.process = '1';
				$scope.addCheckedFalse = false;
				$scope.addCheckedTrue = true;
			};
		}
	]);
}());