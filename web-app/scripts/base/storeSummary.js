(function() {
	var app = angular.module('app.base.storeSummary', []);

	app.controller('storeSummaryCtrl', ['$scope', 'netManager', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'SweetAlert', '$filter', '$timeout',
		function($scope, netManager, DTOptionsBuilder) {
			$scope.dtOptionsNew = DTOptionsBuilder.newOptions();
			/* 订单明细表返回结果字段
			 * *
			 * *purchase_id：订单号
			 * *difference: 未交货数量
			 * *plan_deliver_date: 计划交货时间
			 * *plan_deliver_quantity：计划交货数量
			 * *actual_quantity：实际交货数量
			 * *purchase_quantity：采购数量
			 * *
			 * *=============
			 * *
			 * 库存汇总返回明字段
			 * *
			 * store_sku： 库存SKU
			 * * cn_name： 中文名称
			 * * product_qty： 生成中
			 * * transport_qty： 运输中
			 * * panyu_stock_qty： 番禺仓
			 * * virtual_stock_qty：工厂/货代虚拟仓
			 * * overseas_transport_qty：国内发往海外仓
			 * * fba_return_qty： FBA退仓
			 * * overseas_stock_qty： 海外仓（在仓）
			 * * fba_transport_qty： FBA（在途）
			 * * fba_stock_qty： FBA（在仓）
			 * * msku：MSKU
			 * * shop_name：店铺
			 * * total_qty：合计             * 
			 */

			//初始化数据
			$scope.totalItems = 0;

			// 查询数据
			$scope.queryData = {
				currentPage: 1,
				pageSize: 10
			};
			init(1);
			// 初始化
			function init(page) {
				var sendData = {
					store_sku: $scope.queryData.store_sku || "",
					shop_name: $scope.queryData.shop_name || "",
					cn_name: $scope.queryData.chineseName || "",
					msku: $scope.queryData.msku || "",
					currentPage: page,
					pageSize: 10
				};
				netManager.get('/stores/summary', sendData).then(function(res) {
					console.log('初始化', res);
					if(res.status === 200) {
						$scope.tableList = res.data.list;
						// 分页数据
						$scope.totalItems = res.data.total;
					}
				}, function(err) {
					console.error(err);
				});
			}

			$scope.queryData = {};
			// 打开海外仓在仓弹窗
			$scope.lookOverseaLocationRecord = function(store_sku, item) {
				$scope.productNameS = item.cn_name;
				$scope.productSkuS = item.store_sku;
				var sendData = {
					store_sku: store_sku //'CPS-ZFQ0000003'
				};
				netManager.get('/stores/overseas', sendData).then(function(res) {
					if(res.status === 200) {
						$scope.overseas = res.data;
					}
				}, function(err) {
					console.error(err);
				});
			}

			// 打开采购订单生产明细表
			$scope.activeShow = 'inventorySummary';
			$scope.productionDetailRecord = function(store_sku, item) {
				$scope.productName = item.cn_name;
				$scope.productSku = item.store_sku;
				//$scope.activeShow = val.show;
				var sendData = {
					store_sku: store_sku
				};
				netManager.get('/stores/purchases', sendData).then(function(res) {
					if(res.status === 200) {
						var arr = [];
						for(var i in res.data) {
							arr.push(res.data[i])
						}
						$scope.tableDatil = arr.slice(0);
					}
				}, function(err) {
					console.error(err);
				});
			}

			// 返回
			$scope.returnUp = function(val) {
				$scope.activeShow = val.show;
			}

			// 查询
			$scope.searchOne = {};
			$scope.search = function(flag) {
				if(flag === 'list') {
					init(1);
				} else {
					console.log($scope.searchOne)
				}
			}

			// 重置
			$scope.resetFn = function(flag) {
				if(flag === 'list') {
					$scope.queryData = {
						store_sku: "",
						shop_name: ""
					};
					init(1);
				} else {
					$scope.searchOne = {
						orderNumber: ""
					};
				}
			}

			// 翻页
			$scope.pageChanged = function() {
				init($scope.queryData.currentPage);
			}

			// 根据“生产中”、“运输中”、“番禺仓”、“工厂/货代虚拟仓”、“国内发往海外仓”、“在仓”、“合计”进行排序 --- 等待接口完成
			$scope.sortState = "DESC";
			/*window.localStorage.setItem('product_qty', '');
			window.localStorage.setItem('transport_qty', '');
			window.localStorage.setItem('panyu_stock_qty', '');
			window.localStorage.setItem('virtual_stock_qty', '');
			window.localStorage.setItem('overseas_transport_qty', '');
			window.localStorage.setItem('overseas_stock_qty', '');
			window.localStorage.setItem('total_qty', '');*/
			$scope.localStorage = "";
			$scope.sortFn = function(flag) {
				var sendData = {
					flag: flag
				};
				switch(flag) {
					case 'product_qty':
						// localStorageSave('product_qty');
						scopeSave('product_qty');
						break;
					case 'transport_qty':
						// localStorageSave('transport_qty');
						scopeSave('transport_qty');
						break;
					case 'panyu_stock_qty':
						// localStorageSave('panyu_stock_qty');
						scopeSave('panyu_stock_qty');
						break;
					case 'virtual_stock_qty':
						// localStorageSave('virtual_stock_qty');
						scopeSave('virtual_stock_qty');
						break;
					case 'overseas_transport_qty':
						// localStorageSave('overseas_transport_qty');
						scopeSave('overseas_transport_qty');
						break;
					case 'overseas_stock_qty':
						// localStorageSave('overseas_stock_qty');
						scopeSave('overseas_stock_qty');
						break;
					case 'total_qty':
						// localStorageSave('total_qty');
						scopeSave('total_qty');
						break;
				}
			}

			// 升序与降序
			function sortFn(page, sort, recordState) {
				var sortSendData = sort + ":" + recordState;
				var sendData = {
					currentPage: page,
					pageSize: 10,
					sort: sortSendData
				};
				netManager.get('/stores/summary', sendData).then(function(res) {
					if(res.status === 200) {
						$scope.tableList = res.data.list;
						// 分页数据
						$scope.totalItems = res.data.total;
					}
				}, function(err) {
					console.error(err);
				});
			}

			// 存储状态
			/*function localStorageSave(flag) {
				if(window.localStorage.getItem(flag) === "") {
					sortFn(1, flag, 'DESC');
					window.localStorage.setItem(flag, 'DESC');
				} else if(window.localStorage.getItem(flag) === 'DESC') {
					sortFn(1, flag, "ASC");
					window.localStorage.setItem(flag, 'ASC');
				} else {
					sortFn(1, flag, "DESC");
					window.localStorage.setItem(flag, 'DESC');
				}
			}*/

			function scopeSave(flag) {
				if($scope.localStorage === "") {
					sortFn(1, flag, 'DESC');
					$scope.localStorage = "DESC";
				} else if($scope.localStorage === 'DESC') {
					sortFn(1, flag, "ASC");
					$scope.localStorage = "ASC";
				} else {
					sortFn(1, flag, "DESC");
					$scope.localStorage = "DESC";
				}
			}

			$scope.exportExcel = function() {
				netManager.get('/stores/summary', {
					pageSize: 3000,
				}).then(function(res) {
					var excelList = res.data.list;
					var excelData = [];
					var index = 0;
					excelList.map(function(item) {
						++index;
						for(var i = 0; i < item.msku.length; i++) {
							excelData.push({
								'序号': index,
								'库存SKU编号': item.store_sku,
								'中文名称': item.cn_name,
								'本地仓库-在途-生产中': item.product_qty,
								'本地仓库-在途-运输中': item.transport_qty,
								'本地仓库-在仓-番禺仓': item.panyu_stock_qty,
								'本地仓库-在仓-工厂/货代虚拟仓': item.virtual_stock_qty,
								'海外仓-在途-国内发往海外仓': item.overseas_transport_qty,
								'海外仓-在途-FBA退仓': item.fba_return_qty[i],
								'海外仓-在仓': item.overseas_stock_qty,
								'FBA库存-在途': item.fba_transport_qty[i],
								'FBA库存-在仓': item.fba_stock_qty[i],
								'MSKU': item.msku[i],
								'店铺': item.shop_name[i],
								'合计': item.total_qty
							})
						}
					});
					genExcel(excelData);

					function s2ab(s) {
						if(typeof ArrayBuffer !== 'undefined') {
							var buf = new ArrayBuffer(s.length);
							var view = new Uint8Array(buf);
							for(var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
							return buf;
						} else {
							var buf = new Array(s.length);
							for(var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
							return buf;
						}
					}

					function genExcel(excelData) {
						var wopts = {
							bookType: 'xlsx',
							bookSST: false,
							type: 'binary'
						};
						var wb = {
							SheetNames: ['Sheet1'],
							Sheets: {},
							Props: {}
						};
						wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(excelData);
						saveAs(new Blob([s2ab(XLSX.write(wb, wopts))], {
							type: "application/octet-stream"
						}), "库存汇总" + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType));
					}
				})
			}

		}
	]);
}());