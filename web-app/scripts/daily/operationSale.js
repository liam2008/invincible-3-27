(function() {
	var app = angular.module("app.daily.operationSale", []);
	app.controller("DailyOperationSaleController", ['$scope', 'netManager', '$timeout',
		function($scope, netManager, $timeout) {

			//初始化数据
			$scope.totalItems = 0;

			var time = new Date();
			time.setHours(17);
			time.setMinutes(30);
			time.setSeconds(0);
			if(moment().format('YYYY-MM-DD HH:mm:ss') < moment(time).format('YYYY-MM-DD HH:mm:ss')) {
				$scope.startDate = moment().subtract(2, 'days').format('YYYY-MM-DD');
				$scope.endDate = moment().subtract(2, 'days').format('YYYY-MM-DD');
			} else {
				$scope.startDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
				$scope.endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
			};

			$scope.queryData = {
				startDate: $scope.startDate,
				endDate: $scope.endDate,
				currentPage: 1,
				pageChanged: function() {
					init();
				}
			};

			//初始化
			init();

			//条件查询
			$scope.queryItems = function() {
				init()
			};
			//重置查询条件
			$scope.resetFn = function() {
				$scope.queryData = {
					startDate: moment(dd).format('YYYY-MM-DD'),
					endDate: moment(dd).format('YYYY-MM-DD'),
					currentPage: 1,
					pageChanged: function() {
						init();
					}
				};
				init()
			}
			//翻页
			$scope.pageChanged = function() {
				init();
			}

			function init() {
				//查询数据
				var sendData = {
					startTime: $scope.queryData.startDate ? moment($scope.queryData.startDate).format('YYYY-MM-DD') : null,
					endTime: $scope.queryData.endDate ? moment($scope.queryData.endDate).format('YYYY-MM-DD') : null,
					team: $scope.queryData.group ? $scope.queryData.group : null,
					manager: $scope.queryData.groupmate ? $scope.queryData.groupmate : null,
					level: $scope.queryData.operationRank ? $scope.queryData.operationRank : null,
					currentPage: $scope.queryData.currentPage,
					itemsPerPage: 10
				};
				console.log("sendData", sendData);
				netManager.get('/daily/sales', sendData).then(function(res) {
					console.log("resInit", res.data);
					$scope.tableList = res.data.salesList || 0;
					$scope.totalItems = res.data.totalItems || 0;
					//条件初始化
					$scope.teamList = res.data.teamList;
					$scope.managerList = res.data.managerList;
					//excel导出数据源
					$scope.merchandiseList = res.data.merchandiseList;
				}, function(err) {
					console.error(err);
				})
			}

			//点击导出excel
			$scope.exprotExcel = function() {
				$timeout(function() {
					var excelList = $scope.merchandiseList;
					console.log("excelList", excelList);
					var excelData = [];
					excelList.forEach(function(excel) {
						excelData.push({
							"排名": excel.ranking,
							"类目组": excel.team,
							"专员": excel.manager,
							"运营分级": excel.level,
							"ASIN": excel.asin,
							"销售额": excel.salesVolume,
							"销售总额": excel.totalSales,
							"本月销量": excel.monthlySales
						});
					})
					genExcel(excelData);
				}, 0);

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
					}; //这里的数据是用来定义导出的格式类型
					var wb = {
						SheetNames: ['Sheet1'],
						Sheets: {},
						Props: {}
					};
					console.log('XLSX.utils', XLSX.utils);
					wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(excelData);
					saveAs(new Blob([s2ab(XLSX.write(wb, wopts))], {
						type: "application/octet-stream"
					}), "运营销售情况" + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType));
					console.log("success");
				}

			};
			//ending controller
		}
	]);
}())