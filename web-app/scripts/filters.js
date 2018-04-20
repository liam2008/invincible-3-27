(function() {
	'use strict';

	var app = angular.module('app');

	//状态
	app.filter('formateState', function() {
		return function(state) {
			return Smartdo.PRODUCT_STATE[state];
		}
	});

	//日期
	app.filter('formatDate', function() {
		return function(date) {
			return moment(date).format('YYYY-MM-DD')
		}
	});

	//版本
	app.filter('version', function() {
		return function(url) {
			return url + "?" + App.config.version;
		}
	});

	/***
	 * ASIN\tB06XFWSCWM\t站点\tUS\t发现跟卖\r\n跟卖页面：https://www.amazon.com/gp/offer-listing/B06XFWSCWM\r\n跟卖卖家：PitMarket\r\n卖家ID：A1XIHMMHL8P1DC
	 */
	//字符串按照html输出
	app.filter('trustHtml', function($sce) {
		return function(input, type) {
			if(type == 1 || type == 2 || type == 7 || type == 8) {
				var splitArr = input.split(/\t+|[\r\n]\s+/g);
				var asin = splitArr[1];
				var side = splitArr[3];
				var asinUrl, asinHtml, sideUrl, sideHtml, formatHtml = '';
				if(asin) {
					if(type == 1) { //异常
						asinUrl = 'https://www.amazon.' + Smartdo.SIDE_ADDR[side] + '/product-reviews/' + asin + '/ref=cm_cr_dp_d_ttl?ie=UTF8&reviewerType=all_reviews&sortBy=recent#';
					} else if(type == 2) {
						asinUrl = 'https://www.amazon.' + Smartdo.SIDE_ADDR[side] + '/gp/offer-listing/' + asin;
					} else {
						asinUrl = 'https://www.amazon.' + Smartdo.SIDE_ADDR[side] + '/dp/' + asin;
					}
					asinHtml = '<a href="' + asinUrl + '" target="_blank">' + asin + '</a>';
				}
				splitArr[1] = asinHtml;
				/*  if (type == 2) {
				      if (splitArr[5]) {//跟卖
				          sideUrl = splitArr[5].replace('跟卖页面：', '');
				          sideHtml = '跟卖页面：<a href="' + sideUrl + '" target="_blank">' + sideUrl + '</a>';
				      }
				      splitArr[5] = sideHtml;
				      for (var i = 0; i < splitArr.length; i++) {
				          if (i < 4) {
				              formatHtml += splitArr[i] + '&nbsp;&nbsp;'
				          } else {
				              formatHtml += splitArr[i] + '<br />';
				          }
				      }
				      return $sce.trustAsHtml(formatHtml);
				  };*/
				for(var i = 0; i < splitArr.length; i++) {
					if(i < 4) {
						formatHtml += splitArr[i] + '&nbsp;&nbsp;'
					} else {
						formatHtml += splitArr[i] + '<br />';
					}
				}
				return $sce.trustAsHtml(formatHtml);
			} else {
				return $sce.trustAsHtml(input);
			}
		}
	});

	//side站点地址对应的url,basicPath对应的src地址
	app.filter('formatFlag', function() {
		return function(side, basicPath) {
			return basicPath + Smartdo.SIDE_CONTURY[side] + '.png';
		}
	});

	// 有效时间
	app.filter('usefulTime', function() {
		return function(state) {
			var time = new Date();
			var startTime = new Date(state.split('~')[0]);
			var endTime = new Date(state.split('~')[1]);
			if(startTime <= time && time <= endTime) {
				return true
			} else {
				return false
			}
		}
	});

}());