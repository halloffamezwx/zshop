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
				var isLessStock = false;

				$("input[name=cartpro]").each(function () {
					var cid = $(this).attr("id").replace(/cart-pto/g, "");
					var cidSpinner = $("#spinner_" + cid); 
					var count = cidSpinner.find("input").val();
					var stock = cidSpinner.attr("stock");

					if (parseInt(count) <= parseInt(stock)) {
						$(this).prop("checked", true);
					} else {
						isLessStock = true;
					}
				});
				if (isLessStock) {
					publicTip.showTipForStr("有商品库存不足");
				}
			} else {
				$("input[name=cartpro]").each(function () {
					$(this).prop("checked", false);
				});
			}
		});
		
		$("input[type=checkbox]").click(function () {
			var that = this;
			var id = $(that).attr("id");

			if (id != 'cart-all') {
				var cid = id.replace(/cart-pto/g, "");
				var cidSpinner = $("#spinner_" + cid); 
				var count = cidSpinner.find("input").val();
				var stock = cidSpinner.attr("stock");

				if (parseInt(count) > parseInt(stock)) {
					publicTip.showAlert('该商品库存不足', null, function () {
						$(that).prop("checked", false);
					});
					return;
				} 
			}
			
			var cartCheckedSize = $("input[name='cartpro']:checked").size();
			var cartSize = 0; //$("input[name='cartpro']").size();
			$("input[name='cartpro']").each(function () {
				var cid = $(this).attr("id").replace(/cart-pto/g, "");
				var cidSpinner = $("#spinner_" + cid); 
				var count = cidSpinner.find("input").val();
				var stock = cidSpinner.attr("stock");
				if (parseInt(count) <= parseInt(stock)) {
					cartSize++;
				} 
			});
			
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
					var price = $(this).html().replace(/¥/g, "");
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

		$("#settlement").click(function () {
			var cartIds = "";
			$("input[name='cartpro']:checked").each(function (index) {
				var cid = $(this).attr("id").replace(/cart-pto/g, "");
				if (index == 0) {
					cartIds = cid;
				} else {
					cartIds += "," + cid;
				}
			});	

			publicTip.showLoadingToast(true, "操作中");
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: '/zshop/userapi/settlementAct',
				data: {cartIds: cartIds}
			}).done(function (r) {
				window.location.href = "/zshop/user/settlement/" + r.orderId;
			}).fail(function (jqXHR, textStatus) { // Not 200
				publicTip.showLoadingToast(false);
				publicTip.showTip(jqXHR.responseJSON);
			});
		});
	});
	
})