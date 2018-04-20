(function() {
	var app = angular.module('app');
	app.config([
		'$stateProvider',
		'$urlRouterProvider',
		'$ocLazyLoadProvider',
		'IdleProvider',
		function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider) {
			// Configure Idle settings
			IdleProvider.idle(5); // in seconds
			IdleProvider.timeout(120); // in seconds

			$urlRouterProvider.rule(function($injector, $location) {
				var isLogin = $injector.get('netManager').isLoggedIn();
				if(isLogin) {
					$urlRouterProvider.otherwise("/main/summary");
				} else {
					$location.path('login');
				}
			});

			$ocLazyLoadProvider.config({
				// Set to true if you want to see what and when is dynamically loaded
				debug: true
			});

			$stateProvider
				.state('login', {
					url: '/login',
					templateUrl: "views/login.html?" + App.config.version,
					controller: "loginController",
					data: {
						pageTitle: 'Login',
						bgClass: 'gray-bg'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								}
							]);
						}]
					}

				})
				.state('unauthorized', {
					url: '/unauthorized',
					templateUrl: "views/unauthorized.html?" + App.config.version,
					controller: "unauthorizedController",
					data: {
						pageTitle: 'unauthorized',
						bgClass: 'gray-bg'
					}
				})
				.state('main', {
					abstract: true,
					url: "/main",
					templateUrl: "views/main.html?" + App.config.version,
					controller: "mainController",
					data: {
						pageTitle: 'main'
					},
					resolve: {
						'account': ['netManager', 'permissionFn', 'shareData', function(netManager, permissionFn, shareData) {
							return netManager.get('/me')
								.then(function(response) {
									var data = response.data || {};
									var role = data.role || {};
									var userPermissionList = role.routes || [];
									shareData.permissionList = userPermissionList;
									permissionFn.setPermissions(userPermissionList);
									return response.data;
								})
								.catch(function(error) {
									netManager.logout();
								});
						}],
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								}
							]);
						}]
					}
				})
				.state('main.summary', {
					url: "/summary",
					templateUrl: "views/main/summary.html?" + App.config.version,
					controller: 'summaryController',
					data: {
						pageTitle: '首页'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									name: 'summernote',
									files: ['css/plugins/summernote/summernote.css', 'css/plugins/summernote/summernote-bs3.css', 'js/plugins/summernote/summernote.min.js', 'js/plugins/summernote/angular-summernote.min.js']
								}, {
									serie: true,
									name: 'angular-chartist',
									files: ['js/plugins/chartist/chartist.min.js', 'css/plugins/chartist/chartist.min.css', 'js/plugins/chartist/angular-chartist.min.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								}, {
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									name: 'app.summary',
									files: ['scripts/summary.js']
								}
							]);
						}]
					}
				})
				.state('main.daily', {
					abstract: true,
					url: "/daily",
					templateUrl: "views/common/common.html"
				})
				.state('main.daily.import', {
					url: "/import",
					templateUrl: "views/main/daily/import.html?" + App.config.version,
					controller: 'DailyImportController',
					data: {
						pageTitle: 'dateImport'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								},
								{
									name: 'app.daily.import',
									files: ['scripts/daily/import.js']
								}
							]);
						}]
					}
				})
				.state('main.daily.list', {
					url: "/list",
					templateUrl: "views/main/daily/list.html?" + App.config.version,
					controller: 'DailyListController',
					data: {
						pageTitle: 'dateList'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									serie: true,
									files: ['js/plugins/daterangepicker/daterangepicker.js', 'css/plugins/daterangepicker/daterangepicker-bs3.css']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.min.js', 'js/plugins/chosen/angular-chosen.min.js']
								},
								{
									name: 'app.daily.list',
									files: ['scripts/daily/list.js']
								}
							]);
						}]
					}
				})
				.state('main.daily.report', {
					url: "/report",
					templateUrl: "views/main/daily/report.html?" + App.config.version,
					controller: 'DailyReportController',
					data: {
						pageTitle: 'dateReport'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									serie: true,
									name: 'chart.js',
									files: ['js/plugins/chartJs/Chart.min.js', 'js/plugins/chartJs/angular-chart.min.js']
								},
								{
									name: 'app.daily.report',
									files: ['scripts/daily/report.js']
								}
							]);
						}]
					}
				})
				.state('main.daily.operationSale', {
					url: "/operationSale",
					templateUrl: "views/main/daily/operationSale.html?" + App.config.version,
					controller: 'DailyOperationSaleController',
					data: {
						pageTitle: 'dateOperationSale'
					},
					params: {
						"currentPage": null
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									serie: true,
									name: 'chart.js',
									files: ['js/plugins/chartJs/Chart.min.js', 'js/plugins/chartJs/angular-chart.min.js']
								},
								{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},
								{
									name: 'app.daily.operationSale',
									files: ['scripts/daily/operationSale.js']
								}
							]);
						}]
					}
				})
				.state('main.base', {
					abstract: true,
					url: "/base",
					templateUrl: "views/common/common.html"
				})
				.state('main.base.categoryManage', {
					url: "/category",
					templateUrl: "views/main/base/categoryManage.html?" + App.config.version,
					data: {
						pageTitle: '品类管理'
					},
					controller: 'categoryManage',
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									name: 'app.base.categoryManage',
									files: ['scripts/base/categoryManage.js']
								}
							]);
						}]
					}
				})
				.state('main.base.goodsManage', {
					url: "/goodsManage",
					templateUrl: "views/main/base/goodsManage.html?" + App.config.version,
					controller: 'goodsManageCtrl',
					data: {
						pageTitle: 'goodsManage'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								},
								{
									name: 'app.base.goodsManage',
									files: ['scripts/base/goodsManageCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.base.shopManage', {
					url: "/shopManage",
					templateUrl: "views/main/base/shopManage.html?" + App.config.version,
					controller: 'shopManageCtrl',
					data: {
						pageTitle: 'shopManage'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									name: 'app.base.shopManage',
									files: ['scripts/base/shopManageCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.base.stockManage', {
					url: "/stockManage",
					templateUrl: "views/main/base/stockManage.html?" + App.config.version,
					controller: 'stockManageCtrl',
					data: {
						pageTitle: 'stockManage'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									serie: true,
									files: ['js/plugins/daterangepicker/daterangepicker.js', 'css/plugins/daterangepicker/daterangepicker-bs3.css']
								},
								{
									name: 'app.base.stockManage',
									files: ['scripts/base/stockManageCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.base.storeLog', {
					url: "/storeLog",
					templateUrl: "views/main/base/storeLog.html?" + App.config.version,
					data: {
						pageTitle: 'storeLog'
					},
					controller: 'storeLogCtrl',
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									name: 'app.base.storeLog',
									files: ['scripts/base/storeLog.js']
								}
							]);
						}]
					}
				})
				.state('main.base.commodityManagement', {
					url: "/commodityManagement",
					templateUrl: "views/main/base/commodityManagement.html?" + App.config.version,
					controller: 'commodityManagementCtrl',
					data: {
						pageTitle: 'commodityManagement'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								},
								{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},
								{
									name: 'app.base.commodityManagement',
									files: ['scripts/base/commodityManagementCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.base.storeManagement', {
					url: "/storeManagement",
					templateUrl: "views/main/base/storeManagement.html?" + App.config.version,
					controller: 'storeManagementCtrl',
					data: {
						pageTitle: '仓库管理'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.min.js', 'js/plugins/chosen/angular-chosen.min.js']
								},
								{
									name: 'app.base.storeManagement',
									files: ['scripts/base/storeManagementCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.base.storeSummary', {
					url: "/storeSummary",
					templateUrl: "views/main/base/storeSummary.html?" + App.config.version,
					controller: 'storeSummaryCtrl',
					data: {
						pageTitle: '库存汇总'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									name: 'cgNotify',
									files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
								},
								{
									name: 'app.base.storeSummary',
									files: ['scripts/base/storeSummary.js']
								}
								/*
								{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.min.js', 'js/plugins/chosen/angular-chosen.min.js']
								},
								{
									name: 'app.base.storeSummary',
									files: ['scripts/base/storeSummary.js']
								}*/
							]);
						}]
					}
				})

				.state('main.count', {
					abstract: true,
					url: "/count",
					templateUrl: "views/common/common.html"
				})
				.state('main.count.counter', {
					url: "/counter",
					templateUrl: "views/main/count/counter.html?" + App.config.version,
					controller: 'counterCtrl',
					data: {
						pageTitle: 'counter'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								name: 'app.count.counter',
								files: ['scripts/count/counterCtrl.js']
							}]);
						}]
					}
				})
				.state('main.count.formula', {
					url: "/formula",
					templateUrl: "views/main/count/formula.html?" + App.config.version,
					controller: 'formulaCtrl',
					data: {
						pageTitle: 'formula'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									name: 'app.count.formula',
									files: ['scripts/count/formulaCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.rank', {
					abstract: true,
					url: "/rank",
					templateUrl: "views/common/common.html"
				})
				.state('main.rank.sellerRank', {
					url: "/sellerRank",
					templateUrl: "views/main/rank/sellerRank.html?" + App.config.version,
					data: {
						pageTitle: 'sellerRank'
					},
					controller: 'sellerRankCtrl',
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									name: 'app.rank.sellerRank',
									files: ['scripts/rank/sellerRankCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.authority', {
					abstract: true,
					url: "/authority",
					templateUrl: "views/common/common.html"
				})
				.state('main.analysis.task', {
					url: "/task",
					templateUrl: "views/main/analysis/task.html?" + App.config.version,
					controller: 'taskCtrl',
					data: {
						pageTitle: '评论任务'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								serie: true,
								files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
							}, {
								serie: true,
								name: 'datatables',
								files: ['js/plugins/dataTables/angular-datatables.min.js']
							}, {
								serie: true,
								name: 'datatables.buttons',
								files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
							}, {
								insertBefore: '#loadBefore',
								name: 'localytics.directives',
								files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
							}, {
								name: 'datePicker',
								files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
							}, {
								files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
							}, {
								name: 'oitozero.ngSweetAlert',
								files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
							}, {
								name: 'app.analysis.task',
								files: ['scripts/analysis/task.js']
							}]);
						}]
					}
				})
				.state('main.authority.rolesManage', {
					url: "/rolesManage",
					templateUrl: "views/main/authority/rolesManage.html?" + App.config.version,
					controller: 'rolesManageCtrl',
					data: {
						pageTitle: 'rolesManage'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
								},
								{
									name: 'ui.tree',
									files: ['css/plugins/uiTree/angular-ui-tree.min.css', 'js/plugins/uiTree/angular-ui-tree.min.js']
								},
								{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.min.js', 'js/plugins/chosen/angular-chosen.min.js']
								},
								{
									name: 'app.authority.rolesManage',
									files: ['scripts/authority/rolesManageCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.authority.userManage', {
					url: "/userManage",
					templateUrl: "views/main/authority/userManage.html?" + App.config.version,
					controller: 'userManageCtrl',
					data: {
						pageTitle: 'userManage'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								files: ['js/plugins/jasny/jasny-bootstrap.min.js']
							}, {
								serie: true,
								files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
							}, {
								serie: true,
								name: 'datatables',
								files: ['js/plugins/dataTables/angular-datatables.min.js']
							}, {
								serie: true,
								name: 'datatables.buttons',
								files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
							}, {
								serie: true,
								files: ['js/plugins/daterangepicker/daterangepicker.js', 'css/plugins/daterangepicker/daterangepicker-bs3.css']
							}, {
								name: 'daterangepicker',
								files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
							}, {
								insertBefore: '#loadBefore',
								name: 'localytics.directives',
								files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
							}, {
								files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
							}, {
								name: 'oitozero.ngSweetAlert',
								files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
							}, {
								name: 'app.authority.userManage',
								files: ['scripts/authority/userManageCtrl.js']
							}])
						}]
					}
				})
				.state('main.authority.teamsManage', {
					url: "/teamsManage",
					templateUrl: "views/main/authority/teamsManage.html?" + App.config.version,
					controller: 'teamsManageCtrl',
					data: {
						pageTitle: 'teamsManage'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.min.js', 'js/plugins/chosen/angular-chosen.min.js']
								},
								{
									name: 'app.authority.teamsManage',
									files: ['scripts/authority/teamsManageCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.authority.creatVersionsLog', {
					url: "/creatVersionsLog",
					templateUrl: "views/main/authority/creatVersionsLog.html?" + App.config.version,
					controller: 'creatVersionsLogCtrl',
					data: {
						pageTitle: '添加日志'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									name: 'chart.js',
									files: ['js/plugins/chartJs/Chart.min.js', 'js/plugins/chartJs/angular-chart.min.js']
								},
								{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},
								{
									name: 'summernote',
									files: ['css/plugins/summernote/summernote.css', 'css/plugins/summernote/summernote-bs3.css', 'js/plugins/summernote/summernote.min.js', 'js/plugins/summernote/angular-summernote.min.js']
								},
								{
									name: 'app.daily.operationSale',
									files: ['scripts/daily/operationSale.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									name: 'app.authority.creatVersionsLog',
									files: ['scripts/authority/creatVersionsLogCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.purchase', {
					abstract: true,
					url: "/purchase",
					templateUrl: "views/common/common.html"
				})
				.state('main.purchase.program', {
					url: "/program",
					templateUrl: "views/main/purchase/program.html?" + App.config.version,
					controller: 'programCtrl',
					data: {
						pageTitle: '采购计划'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								files: ['js/plugins/jasny/jasny-bootstrap.min.js']
							}, {
								serie: true,
								files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
							}, {
								serie: true,
								name: 'datatables',
								files: ['js/plugins/dataTables/angular-datatables.min.js']
							}, {
								serie: true,
								name: 'datatables.buttons',
								files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
							}, {
								serie: true,
								files: ['js/plugins/daterangepicker/daterangepicker.js', 'css/plugins/daterangepicker/daterangepicker-bs3.css']
							}, {
								name: 'daterangepicker',
								files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
							}, {
								insertBefore: '#loadBefore',
								name: 'localytics.directives',
								files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
							}, {
								files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
							}, {
								name: 'oitozero.ngSweetAlert',
								files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
							}, {
								name: 'app.purchase.program',
								files: ['scripts/purchase/program.js']
							}]);
						}]
					}
				})
				.state('main.purchase.summary', {
					url: "/summary",
					templateUrl: "views/main/purchase/summary.html?" + App.config.version,
					controller: 'summaryCtrl',
					data: {
						pageTitle: '采购记录'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								files: ['js/plugins/jasny/jasny-bootstrap.min.js']
							}, {
								serie: true,
								files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
							}, {
								serie: true,
								name: 'datatables',
								files: ['js/plugins/dataTables/angular-datatables.min.js']
							}, {
								serie: true,
								name: 'datatables.buttons',
								files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
							}, {
								name: 'datePicker',
								files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
							}, {
								files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
							}, {
								name: 'oitozero.ngSweetAlert',
								files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
							}, {
								name: 'app.purchase.summary',
								files: ['scripts/purchase/summary.js']
							}]);
						}]
					}
				})
				.state('main.purchase.statistics', {
					url: "/statistics",
					templateUrl: "views/main/purchase/statistics.html?" + App.config.version,
					controller: 'statisticsCtrl',
					data: {
						pageTitle: '采购统计'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								serie: true,
								files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
							}, {
								serie: true,
								name: 'datatables',
								files: ['js/plugins/dataTables/angular-datatables.min.js']
							}, {
								serie: true,
								name: 'datatables.buttons',
								files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
							}, {
								name: 'datePicker',
								files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
							}, {
								files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
							}, {
								name: 'oitozero.ngSweetAlert',
								files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
							}, {
								name: 'app.purchase.statistics',
								files: ['scripts/purchase/statistics.js']
							}]);
						}]
					}
				})
				.state('main.purchase.supplier', {
					url: "/supplier",
					templateUrl: "views/main/purchase/supplier.html?" + App.config.version,
					controller: 'supplierCtrl',
					data: {
						pageTitle: '供应商管理'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								serie: true,
								files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
							}, {
								serie: true,
								name: 'datatables',
								files: ['js/plugins/dataTables/angular-datatables.min.js']
							}, {
								serie: true,
								name: 'datatables.buttons',
								files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
							}, {
								name: 'datePicker',
								files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
							}, {
								files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
							}, {
								name: 'oitozero.ngSweetAlert',
								files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
							}, {
								name: 'app.purchase.supplier',
								files: ['scripts/purchase/supplier.js']
							}]);
						}]
					}
				})
				.state('main.sample', {
					abstract: true,
					url: "/sample",
					templateUrl: "views/common/common.html"
				})
				.state('main.sample.buy', {
					url: "/buy",
					templateUrl: "views/main/sample/buy.html?" + App.config.version,
					controller: 'buyCtrl',
					data: {
						pageTitle: '样品购买'
					},
					resolve: {
						loadPlugin: function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								name: 'app.sample.buy',
								files: ['scripts/sample/buyCtrl.js']
							}, {
								files: ['js/plugins/jasny/jasny-bootstrap.min.js']
							}, {
								serie: true,
								files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
							}, {
								serie: true,
								name: 'datatables',
								files: ['js/plugins/dataTables/angular-datatables.min.js']
							}, {
								serie: true,
								name: 'datatables.buttons',
								files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
							}, {
								serie: true,
								files: ['js/plugins/daterangepicker/daterangepicker.js', 'css/plugins/daterangepicker/daterangepicker-bs3.css']
							}, {
								name: 'daterangepicker',
								files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
							}])
						}
					}
				})
				.state('main.sample.apply', {
					url: "/apply",
					templateUrl: "views/main/sample/apply.html?" + App.config.version,
					controller: 'applyCtrl',
					data: {
						pageTitle: '样品申请'
					},
					resolve: {
						loadPlugin: function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								name: 'app.sample.apply',
								files: ['scripts/sample/applyCtrl.js']
							}, {
								files: ['js/plugins/jasny/jasny-bootstrap.min.js']
							}, {
								serie: true,
								files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
							}, {
								serie: true,
								name: 'datatables',
								files: ['js/plugins/dataTables/angular-datatables.min.js']
							}, {
								serie: true,
								name: 'datatables.buttons',
								files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
							}, {
								serie: true,
								files: ['js/plugins/daterangepicker/daterangepicker.js', 'css/plugins/daterangepicker/daterangepicker-bs3.css']
							}, {
								name: 'daterangepicker',
								files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
							}])
						}
					}
				})
				.state('main.sample.loan', {
					url: "/loan",
					templateUrl: "views/main/sample/loan.html?" + App.config.version,
					controller: 'loanCtrl',
					data: {
						pageTitle: '样品借出'
					},
					resolve: {
						loadPlugin: function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								name: 'app.sample.loan',
								files: ['scripts/sample/loanCtrl.js']
							}, {
								files: ['js/plugins/jasny/jasny-bootstrap.min.js']
							}, {
								serie: true,
								files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
							}, {
								serie: true,
								name: 'datatables',
								files: ['js/plugins/dataTables/angular-datatables.min.js']
							}, {
								serie: true,
								name: 'datatables.buttons',
								files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
							}, {
								serie: true,
								files: ['js/plugins/daterangepicker/daterangepicker.js', 'css/plugins/daterangepicker/daterangepicker-bs3.css']
							}, {
								name: 'daterangepicker',
								files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
							}])
						}
					}
				})
				.state('main.files', {
					abstract: true,
					url: "/files",
					templateUrl: "views/common/common.html"
				})
				.state('main.files.views', {
					url: "/views",
					templateUrl: "views/main/files/views.html?" + App.config.version,
					controller: 'fileViewsCtrl',
					data: {
						pageTitle: '知识库'
					},
					resolve: {
						loadPlugin: function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								name: 'app.files.views',
								files: ['scripts/files/fileViewsCtrl.js']
							}])
						}
					}
				})
				.state('main.files.manage', {
					url: "/manage",
					templateUrl: "views/main/files/manage.html?" + App.config.version,
					controller: 'fileManageCtrl',
					data: {
						pageTitle: '资料管理'
					},
					resolve: {
						loadPlugin: function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
							}, {
								name: 'oitozero.ngSweetAlert',
								files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
							}, {
								insertBefore: '#loadBefore',
								name: 'localytics.directives',
								files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
							}, {
								name: 'app.files.manage',
								files: ['scripts/files/fileManageCtrl.js']
							}])
						}
					}
				})
				// .state('main.margin', {
				// 	abstract: true,
				// 	url: "/margin",
				// 	templateUrl: "views/common/common.html"
				// })
				// .state('main.margin.group', {
				// 	url: "/group",
				// 	templateUrl: "views/main/margin/group.html?" + App.config.version,
				// 	controller: 'groupCtrl',
				// 	data: {
				// 		pageTitle: '小组毛利率'
				// 	},
				// 	resolve: {
				// 		loadPlugin: function($ocLazyLoad) {
				// 			return $ocLazyLoad.load([{
				// 				serie: true,
				// 				files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
				// 			}, {
				// 				serie: true,
				// 				name: 'datatables',
				// 				files: ['js/plugins/dataTables/angular-datatables.min.js']
				// 			}, {
				// 				serie: true,
				// 				name: 'datatables.buttons',
				// 				files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
				// 			}, {
				// 				serie: true,
				// 				files: ['js/plugins/daterangepicker/daterangepicker.js', 'css/plugins/daterangepicker/daterangepicker-bs3.css']
				// 			}, {
				// 				name: 'daterangepicker',
				// 				files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
				// 			}, {
				// 				name: 'app.margin.group',
				// 				files: ['scripts/margin/groupCtrl.js']
				// 			}])
				// 		}
				// 	}
				// })
				// .state('main.margin.gross', {
				// 	url: "/gross",
				// 	templateUrl: "views/main/margin/gross.html?" + App.config.version,
				// 	controller: 'grossCtrl',
				// 	data: {
				// 		pageTitle: 'SKU毛利率'
				// 	},
				// 	resolve: {
				// 		loadPlugin: function($ocLazyLoad) {
				// 			return $ocLazyLoad.load([{
				// 				serie: true,
				// 				files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
				// 			}, {
				// 				serie: true,
				// 				files: ['js/plugins/dataTables/dataTables.fixedColumns.min.js', 'css/plugins/dataTables/fixedColumns.bootstrap.min.css']
				// 			}, {
				// 				serie: true,
				// 				name: 'datatables',
				// 				files: ['js/plugins/dataTables/angular-datatables.min.js']
				// 			}, {
				// 				serie: true,
				// 				name: 'datatables.buttons',
				// 				files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
				// 			}, {
				// 				serie: true,
				// 				files: ['js/plugins/daterangepicker/daterangepicker.js', 'css/plugins/daterangepicker/daterangepicker-bs3.css']
				// 			}, {
				// 				name: 'daterangepicker',
				// 				files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
				// 			}, {
				// 				name: 'app.margin.gross',
				// 				files: ['scripts/margin/grossCtrl.js']
				// 			}])
				// 		}
				// 	}
				// })
				.state('main.analysis', {
					abstract: true,
					url: "/analysis",
					templateUrl: "views/common/common.html"
				})
				.state('main.analysis.review', {
					url: "/review",
					templateUrl: "views/main/analysis/review.html?" + App.config.version,
					controller: 'reviewCtrl',
					data: {
						pageTitle: 'review分析'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									serie: true,
									files: ['js/plugins/daterangepicker/daterangepicker.js', 'css/plugins/daterangepicker/daterangepicker-bs3.css']
								},
								{
									name: 'daterangepicker',
									files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
								},
								{
									serie: true,
									name: 'chart.js',
									files: ['js/plugins/chartJs/Chart.min.js', 'js/plugins/chartJs/angular-chart.min.js']
								},
								{
									name: 'app.analysis.reivew',
									files: ['scripts/analysis/reivewCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.analysis.keyword', {
					url: "/keyword",
					templateUrl: "views/main/analysis/keyword.html?" + App.config.version,
					controller: 'keywordCtrl',
					data: {
						pageTitle: '关键字分析'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/daterangepicker/daterangepicker.js', 'css/plugins/daterangepicker/daterangepicker-bs3.css']
								},
								{
									name: 'daterangepicker',
									files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
								},
								{
									serie: true,
									name: 'chart.js',
									files: ['js/plugins/chartJs/Chart.min.js', 'js/plugins/chartJs/angular-chart.min.js']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									name: 'app.analysis.keyword',
									files: ['scripts/analysis/keywordCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.workOrder', {
					abstract: true,
					url: "/workOrder",
					templateUrl: "views/common/common.html"
				})
				.state('main.workOrder.clickTask', {
					url: "/clickTask",
					templateUrl: "views/main/workOrder/clickTask.html?" + App.config.version,
					controller: 'clickTaskCtrl',
					data: {
						pageTitle: '点击任务'
					},
					resolve: {
						loadPlugin: function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								name: 'app.workOrder.clickTask',
								files: ['scripts/workOrder/clickTaskCtrl.js']
							}, {
								files: ['js/plugins/jasny/jasny-bootstrap.min.js']
							}, {
								serie: true,
								files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
							}, {
								serie: true,
								name: 'datatables',
								files: ['js/plugins/dataTables/angular-datatables.min.js']
							}, {
								serie: true,
								name: 'datatables.buttons',
								files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
							}, {
								serie: true,
								files: ['js/plugins/daterangepicker/daterangepicker.js', 'css/plugins/daterangepicker/daterangepicker-bs3.css']
							}, {
								name: 'datePicker',
								files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
							}])
						}
					}
				})
				.state('main.workOrder.notice', {
					url: "/notice",
					templateUrl: "views/main/workOrder/notice.html?" + App.config.version,
					controller: 'noticeCtrl',
					data: {
						pageTitle: '公告管理'
					},
					resolve: {
						loadPlugin: function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
							}, {
								name: 'ui.footable',
								files: ['js/plugins/footable/angular-footable.js']
							}, {
								name: 'datePicker',
								files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
							}, {
								files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
							}, {
								files: ['css/plugins/touchspin/jquery.bootstrap-touchspin.min.css', 'js/plugins/touchspin/jquery.bootstrap-touchspin.min.js']
							}, {
								files: ['js/plugins/layDate/laydate.js']
							}, {
								name: 'oitozero.ngSweetAlert',
								files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
							}, {
								name: 'app.workOrder.notice',
								files: ['scripts/workOrder/noticeCtrl.js']
							}])
						}
					}
				})
				.state('main.workOrder.productGather', {
					url: "/productGather",
					templateUrl: "views/main/workOrder/productGather.html?" + App.config.version,
					data: {
						pageTitle: '商品集合'
					},
					controller: 'productGatherCtrl',
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								/*{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},*/
								{
									name: 'app.workOrder.productGather',
									files: ['scripts/workOrder/productGatherCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.workOrder.woRlues', {
					url: "/woRlues",
					templateUrl: "views/main/workOrder/woRlues.html?" + App.config.version,
					data: {
						pageTitle: '工单分配规则'
					},
					controller: 'woRluesCtrl',
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},
								{
									name: 'app.workOrder.woRlues',
									files: ['scripts/workOrder/woRluesCtrl.js']
								}
							]);
						}]
					}
				})

				.state('main.workOrder.accountingClassManage', {
					url: "/accountingClassManage",
					templateUrl: "views/main/workOrder/accountingClassManage.html?" + App.config.version,
					data: {
						pageTitle: '工单类型管理'
					},
					controller: 'accountingClassManageCtrl',
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								serie: true,
								files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
							}, {
								serie: true,
								name: 'datatables',
								files: ['js/plugins/dataTables/angular-datatables.min.js']
							}, {
								serie: true,
								name: 'datatables.buttons',
								files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
							}, {
								name: 'datePicker',
								files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
							}, {
								files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
							}, {
								files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
							}, {
								name: 'oitozero.ngSweetAlert',
								files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
							}, {
								files: ['css/plugins/touchspin/jquery.bootstrap-touchspin.min.css', 'js/plugins/touchspin/jquery.bootstrap-touchspin.min.js']
							}, {
								name: 'app.workOrder.accountingClassManage',
								files: ['scripts/workOrder/accountingClassManageCtrl.js']
							}])
						}]
					}
				})
				.state('main.workOrder.createOrder', {
					url: "/createOrder",
					templateUrl: "views/main/workOrder/createOrder.html?" + App.config.version,
					controller: 'createOrderCtrl',
					data: {
						pageTitle: '创建工单'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
							}, {
								name: 'oitozero.ngSweetAlert',
								files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
							}, {
								insertBefore: '#loadBefore',
								name: 'localytics.directives',
								files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
							}, {
								files: ['css/plugins/slick/slick.css', 'css/plugins/slick/slick-theme.css', 'js/plugins/slick/slick.min.js']
							}, {
								name: 'slick',
								files: ['js/plugins/slick/angular-slick.min.js']
							}, {
								name: 'app.workOrder.createOrder',
								files: ['scripts/workOrder/createOrderCtrl.js']
							}])
						}]
					}
				})
				.state('main.workOrder.dealingOrder', {
					url: "/dealingOrder/:currentPage",
					templateUrl: "views/main/workOrder/dealingOrder.html?" + App.config.version,
					controller: 'dealingOrderCtrl',
					data: {
						pageTitle: '待处理工单'
					},
					params: {
						"currentPage": null
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
							}, {
								name: 'ui.footable',
								files: ['js/plugins/footable/angular-footable.js']
							}, {
								name: 'datePicker',
								files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
							}, {
								insertBefore: '#loadBefore',
								name: 'localytics.directives',
								files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
							}, {
								files: ['css/plugins/slick/slick.css', 'css/plugins/slick/slick-theme.css', 'js/plugins/slick/slick.min.js']
							}, {
								name: 'slick',
								files: ['js/plugins/slick/angular-slick.min.js']
							}, {
								name: 'app.workOrder.dealingOrder',
								files: ['scripts/workOrder/dealingOrderCtrl.js']
							}])
						}]
					}
				})
				.state('main.workOrder.dealedOrder', {
					url: "/dealedOrder/:currentPage",
					templateUrl: "views/main/workOrder/dealedOrder.html?" + App.config.version,
					controller: 'dealedOrderCtrl',
					data: {
						pageTitle: '已处理工单'
					},
					params: {
						"currentPage": null
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
							}, {
								name: 'ui.footable',
								files: ['js/plugins/footable/angular-footable.js']
							}, {
								name: 'datePicker',
								files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
							}, {
								files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
							}, {
								insertBefore: '#loadBefore',
								name: 'localytics.directives',
								files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
							}, {
								name: 'oitozero.ngSweetAlert',
								files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
							}, {
								files: ['css/plugins/slick/slick.css', 'css/plugins/slick/slick-theme.css', 'js/plugins/slick/slick.min.js']
							}, {
								name: 'slick',
								files: ['js/plugins/slick/angular-slick.min.js']
							}, {
								name: 'app.workOrder.dealedOrder',
								files: ['scripts/workOrder/dealedOrderCtrl.js']
							}])
						}]
					}
				})
				.state('main.workOrder.finishOrder', {
					url: "/finishOrder/:currentPage",
					templateUrl: "views/main/workOrder/finishOrder.html?" + App.config.version,
					controller: 'finishOrderCtrl',
					data: {
						pageTitle: '已完结工单'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
								files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
							}, {
								name: 'ui.footable',
								files: ['js/plugins/footable/angular-footable.js']
							}, {
								name: 'datePicker',
								files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
							}, {
								files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
							}, {
								insertBefore: '#loadBefore',
								name: 'localytics.directives',
								files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
							}, {
								name: 'oitozero.ngSweetAlert',
								files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
							}, {
								files: ['css/plugins/slick/slick.css', 'css/plugins/slick/slick-theme.css', 'js/plugins/slick/slick.min.js']
							}, {
								name: 'slick',
								files: ['js/plugins/slick/angular-slick.min.js']
							}, {
								name: 'app.workOrder.finishOrder',
								files: ['scripts/workOrder/finishOrderCtrl.js']
							}])
						}]
					}
				})
				.state('main.workOrder.customerList', {
					url: "/customerList",
					templateUrl: "views/main/workOrder/customerList.html?" + App.config.version,
					controller: 'customerListCtrl',
					data: {
						pageTitle: '客服任务分配表'
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},
								{
									name: 'app.workOrder.customerList',
									files: ['scripts/workOrder/customerListCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.workOrder.woConfiguration', {
					url: "/woConfiguration",
					templateUrl: "views/main/workOrder/woConfiguration.html?" + App.config.version,
					data: {
						pageTitle: '工单配置'
					},
					controller: 'woConfigurationCtrl',
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									serie: true,
									files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
								},
								{
									serie: true,
									name: 'datatables',
									files: ['js/plugins/dataTables/angular-datatables.min.js']
								},
								{
									serie: true,
									name: 'datatables.buttons',
									files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
								},
								{
									name: 'datePicker',
									files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								/*{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},*/
								{
									name: 'app.workOrder.woConfiguration',
									files: ['scripts/workOrder/woConfigurationCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.workOrder.toDeal', { //处理
					url: "/toDeal/:id/:fromPage",
					templateUrl: "views/main/workOrder/toDeal.html?" + App.config.version,
					controller: 'toDealCtrl',
					params: {
						"id": null,
						"fromPage": null
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},
								{
									name: 'app.workOrder.toDeal',
									files: ['scripts/workOrder/toDealCtrl.js']
								}
							]);
						}]
					}
				})
				.state('main.workOrder.turnOrder', { //转派
					url: "/turnOrder/:id/:log",
					templateUrl: "views/main/workOrder/turnOrder.html?" + App.config.version,
					controller: 'turnOrderCtrl',
					params: {
						"id": null,
						"log": null
					},
					resolve: {
						loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									insertBefore: '#loadBefore',
									name: 'localytics.directives',
									files: ['css/plugins/chosen/bootstrap-chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
								},
								{
									files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
								},
								{
									name: 'oitozero.ngSweetAlert',
									files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
								},
								{
									name: 'app.workOrder.turnOrder',
									files: ['scripts/workOrder/turnOrderCtrl.js']
								}
							]);
						}]
					}
				})

		}
	]);
})();