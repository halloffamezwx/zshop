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

requirejs(["jquery", "publicTip", "jquery.Spinner"], function($, publicTip){
	$(function() {
		$(".Spinner").each(function(){
			var stock = $(this).attr("stock");
			var count = $(this).attr("count");
			var cid = $(this).attr("cid");

			var max = 5;
			if (stock < max) {
				max = stock;
			}
			if (count > max) {
				max = count;
			}
			$(this).Spinner({
				value:count, 
				len:3, 
				max:max, 
				changeValue:changeValue(cid)
			});

			function changeValue(cid) {
				return function (newValue, chgFailFun, chgSuccFun) {
					publicTip.showLoadingToast(true, "操作中");
					$.ajax({
						type: 'post',
						dataType: 'json',
						url: '/zshop/userapi/chgCartProdCount',
						data: {cid: cid, newValue: newValue}
					}).done(function (r) {
						chgSuccFun();
						var tPrice = Math.floor(getTotalPrice() * 100) / 100;
						$("#totalPrice").html("￥" + tPrice);
						publicTip.showLoadingToast(false);
					}).fail(function (jqXHR, textStatus) { // Not 200
						chgFailFun();
						publicTip.showLoadingToast(false);
						publicTip.showTip(jqXHR.responseJSON);
					});
				}
			}
		});

		$("#cart-all").click(function () {
			if ( $(this).prop('checked') ) { 
				$("input[name=cartpro]").each(function () {
					$(this).prop("checked", true);
				});
			} else {
				$("input[name=cartpro]").each(function () {
					$(this).prop("checked", false);
				});
			}
		});
		
		$("input[type=checkbox]").click(function () {
			var cartCheckedSize = $("input[name='cartpro']:checked").size();
			var cartSize = $("input[name='cartpro']").size();
			
			if ( cartCheckedSize >= 1 ) {
				$("#settlement").css("background-color", "green");
			} else {
				$("#settlement").css("background-color", "gray");
			}
			
			if (cartCheckedSize == cartSize) {
				$("#cart-all").prop("checked", true);
			} else {
				$("#cart-all").prop("checked", false);
			}
			var tPrice = Math.floor(getTotalPrice() * 100) / 100;
			$("#totalPrice").html("￥" + tPrice);
		});
		
		var cartSize = $("input[name='cartpro']").size();
		if ( cartSize > 0 ) {
			$("#cart-all").click();
		}
		
		function getTotalPrice(){
			var totalPrice = 0.00;
			$('p[id^=pricep_]').each(function(){
				var pricepId = $(this).attr("id");
				var cid = pricepId.split("_")[1];
				var isCheck = $("#cart-pto" + cid).prop('checked');

				if (isCheck) {
					var price = $(this).html().replace(/¥/g,"");
					var count = $("#spinner_" + cid).find("input").val();
					var onePrice = parseFloat(price) * parseInt(count);
					totalPrice += onePrice;
				}
			});
			console.log('totalPrice=' + totalPrice);
			return totalPrice;
		}
		//getTotalPrice();

		$(".wy-dele").click(function () {
			var that = this;

			publicTip.showConfirm('确认删除此商品？', function(){
				var cid = $(that).attr("cid");
				publicTip.showLoadingToast(true, "操作中");
				$.ajax({
					type: 'post',
					dataType: 'json',
					url: '/zshop/userapi/delCartProd',
					data: {cid: cid}
				}).done(function (r) {
					console.log(JSON.stringify(r));
					window.location.reload();
				}).fail(function (jqXHR, textStatus) { // Not 200
					publicTip.showLoadingToast(false);
					publicTip.showTip(jqXHR.responseJSON);
				});
			});
			
		});
	});
	
})