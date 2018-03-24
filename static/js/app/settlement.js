requirejs.config({
	"baseUrl": "/static/js/lib",
	"paths": {
		"publicTip": "/static/js/app/public-tip"
    }
});

requirejs(["jquery", "publicTip"], function($, publicTip){
	$(function() { 
		$("#wePayBtn").click(function () {
			publicTip.showLoadingToast(true, "操作中");
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: '/zshop/userapi/confirmOrder',
				data: {orderId: $('#orderId').val()}
			}).done(function (r) {
				publicTip.showLoadingToast(false);
				publicTip.showConfirm("确认支付<font color='red'>" + r.totalPrice + "</font>元！", function(){

				});
			}).fail(function (jqXHR, textStatus) { // Not 200
				publicTip.showLoadingToast(false);
				publicTip.showTip(jqXHR.responseJSON);
			});
		});
	});
	
})