requirejs.config({
	"baseUrl": "/static/js/lib",
	"paths": {
		"publicTip": "/static/js/app/public-tip",
		"zepto": "zepto.min"
    },
    "shim": {
        "jquery.Spinner": ["jquery"]
    }
});

requirejs(["jquery", "vue", "vue-resource", "publicTip"], function($, Vue, vueResource, publicTip){
	Vue.use(vueResource);

	$(function() {
		var ocVm = new Vue({
			el: '#orderContent',
			http: {
				timeout: 5000
			},
			data: {
				sorders: [],
				loading: false,
				limit: 3,
				offset: 0,
				hasdata: false,
				loadMoreflag: false,
				status: parseInt($('#orderStatus').val())
			},
			created: function () {
				this.getOrderList(false, null);
			},
			methods: {
				wePayV: function (orderId) {
					wePay(orderId, this.getOrderList);
				},
				reminderV: function (orderId) {
					reminder(orderId);
				},
				confirmV: function (orderId) {
					confirm(orderId, this.getOrderList);
				},
				delV: function (orderId) {
					del(orderId, this.getOrderList);
				},
				cancelV: function (orderId) {
					cancel(orderId, this.getOrderList);
				},
				getOrderList: function (isLoadMore, statusIn) {
					var that = this;
					that.loading = true;
					that.loadMoreflag = isLoadMore;
					if (statusIn != null) {
						that.status = statusIn;
					}

					if (isLoadMore) {
						that.offset = that.offset + that.limit;
					} else {
						that.limit = 3;
						that.offset = 0;
					}	

					that.$resource('/zshop/userapi/getOrderList').save({limit: that.limit, offset: that.offset, status: that.status}).then(function (resp) {
						that.loading = false;
						var result = resp.json(); 
						
						if (result.length > 0) {
							that.hasdata = true;
						} else {
							that.hasdata = false;
						}

						if (isLoadMore) {
							that.sorders = that.sorders.concat(result);
						} else {
							that.sorders = result; 
						}
					}, function (resp) {
						that.loading = false;
						var respJson = resp.json();
						publicTip.showTipForStr(respJson.message, respJson.code);
					});
				}
			}
		});

		function wePay(orderId, getOrderList) {
			publicTip.showLoadingToast(true, '操作中');
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: '/zshop/userapi/confirmOrder',
				data: {orderId: orderId}
			}).done(function (r) {
				publicTip.showLoadingToast(false);
				var confirmMsg = "确认支付<font color='red'>" + r.totalPrice + "</font>元！<div style='margin-top: 8px;'>截止时间：" + r.payEndTime + "</div>";
				publicTip.showConfirm(confirmMsg, function() {
					payOrder(r.totalPrice, getOrderList, orderId);
				});
			}).fail(function (jqXHR, textStatus) { // Not 200
				publicTip.showLoadingToast(false);
				publicTip.showTip(jqXHR.responseJSON);
			});
		}

		function payOrder(totalPrice, getOrderList, orderId) {
			publicTip.showLoadingToast(true, "支付中");
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: '/zshop/userapi/payOrder',
				data: {
					orderId: orderId,
					totalPrice: totalPrice
				}
			}).done(function (r) {
				window.location.href = '/zshop/user/paySuccess/' + orderId;
			}).fail(function (jqXHR, textStatus) { // Not 200
				publicTip.showLoadingToast(false);
				publicTip.showTip(jqXHR.responseJSON);
			});
		}

		function reminder(orderId) {
			publicTip.showToast("已提醒");
		}

		function confirm(orderId, getOrderList) {
			publicTip.showConfirm("请确认是否已经收到货", function() {
				publicTip.showLoadingToast(true, '操作中');

				$.ajax({
					type: 'post',
					dataType: 'json',
					url: '/zshop/userapi/confirmReceipt',
					data: {orderId: orderId}
				}).done(function (r) {
					publicTip.showLoadingToast(false);
					getOrderList(false, null);
				}).fail(function (jqXHR, textStatus) { // Not 200
					publicTip.showLoadingToast(false);
					publicTip.showTip(jqXHR.responseJSON);
				});
			});
		}

		function del(orderId, getOrderList) {
			publicTip.showConfirm("确认删除订单？", function() {
				publicTip.showLoadingToast(true, '操作中');
				
				$.ajax({
					type: 'post',
					dataType: 'json',
					url: '/zshop/userapi/delOrder',
					data: {orderId: orderId}
				}).done(function (r) {
					publicTip.showLoadingToast(false);
					getOrderList(false, null);
				}).fail(function (jqXHR, textStatus) { // Not 200
					publicTip.showLoadingToast(false);
					publicTip.showTip(jqXHR.responseJSON);
				});
			});
		}

		function cancel(orderId, getOrderList) {
			publicTip.showConfirm("确认取消订单？", function() {
				publicTip.showLoadingToast(true, '操作中');
				
				$.ajax({
					type: 'post',
					dataType: 'json',
					url: '/zshop/userapi/cancelOrder',
					data: {orderId: orderId}
				}).done(function (r) {
					publicTip.showLoadingToast(false);
					getOrderList(false, null);
				}).fail(function (jqXHR, textStatus) { // Not 200
					publicTip.showLoadingToast(false);
					publicTip.showTip(jqXHR.responseJSON);
				});
			});
		}

	});	

})