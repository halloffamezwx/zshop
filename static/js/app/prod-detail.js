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

requirejs(["jquery", "publicTip", "jquery.Spinner", "swipe"], function($, publicTip){
	$(function() {
		function swipeFun() {
			var mySwipeElem = document.getElementById('mySwipe');
			window.mySwipe = Swipe(mySwipeElem, {
				//startSlide: 4,
				//auto: 2000,
				//continuous: true,
				//disableScroll: true,
				//stopPropagation: true,
				callback: function(index, element) {
					//var preIndex = index - 1;
					//if (preIndex == -1) {
					//	preIndex = mySwipe.getNumSlides() - 1;
					//}
					//$("#disc_" + preIndex).css("color", "#c8c9cb");
					$(".swipe-wrap-circle li").css("color", "#c8c9cb");
					$("#disc_" + index).css("color", "green");
				},
				//transitionEnd: function(index, element) {}
			});
		}
		swipeFun();

		let max = 5;
		let stock = parseInt($("#pstock").val());
		if (stock < max) {
			max = stock;
		}
		$("#pcs").Spinner({value:1, len:3, max:max});
		
		let isLoadDetail = false;
		$(".wy-header-titlebut").click(function () {
			var currentId = $(this).attr("id");
			$(".wy-product-content").hide();
			$("#" + currentId + "Div").show();
			
			$(".wy-header-titlebut").removeClass("wy-header-titlebut-active");
			$(this).addClass('wy-header-titlebut-active');

			if (currentId == "detail" && !isLoadDetail) {
				loadDetail();
			}
		});

		$("#detailDiv-reload").click(function () {
			loadDetail();
		});

		function loadDetail() {
			$("#detailDiv-reload").hide();
			$("#detailDiv-loading").show();
			
			$.ajax({
				type: 'get',
				dataType: 'html',
				url: $("#detailHtmlUrl").val()
			}).done(function (r) {
				isLoadDetail = true;
				$("#detailDiv").html(r);
			}).fail(function (jqXHR, textStatus) { 
				$("#detailDiv-loading").hide();
				$("#detailDiv-reload").show();
			});
		}
		
		$("#addCart").click(function () {
			publicTip.showLoadingToast(true, "加入中");
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: '/zshop/userapi/addCartProd',
				data: {
					pid: $("#pid").val(), 
					pcount: $("#pcs").find("input").val()
				}
			}).done(function (r) {
				//console.log(JSON.stringify(r));
				publicTip.showLoadingToast(false);
				publicTip.showToast("已加入");
				let cardProdNum = parseInt($("#cardProdNum").html());
				cardProdNum = cardProdNum + 1;
				$("#cardProdNum").html(cardProdNum);
				$("#cardProdNum").show();
			}).fail(function (jqXHR, textStatus) { 
				publicTip.showLoadingToast(false);
				publicTip.showTip(jqXHR.responseJSON);
			});
		});

		$("#collectionHref").click(function () {
			let id = $("#collectionId").val();
			let msg = '取消收藏';
			if (id.trim() == '') msg = '收藏';
			publicTip.showLoadingToast(true, msg + "中");
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: '/zshop/userapi/collection',
				data: {
					id: id, 
					pid: $("#pid").val()
				}
			}).done(function (r) {
				$("#collectionId").val(r.id);
				if (r.id) {
					$("#collectionHref").find("div").addClass('promotion-foot-menu-collection-on');
					$("#collectionHref").find("div").removeClass('promotion-foot-menu-collection');
					//$("#collectionHref").find("p").html('取消收藏');
					$("#collectionHref").find("p").css("color", "green");
				} else {
					$("#collectionHref").find("div").addClass('promotion-foot-menu-collection');
					$("#collectionHref").find("div").removeClass('promotion-foot-menu-collection-on');
					//$("#collectionHref").find("p").html('收藏');
					$("#collectionHref").find("p").css("color", "gray");
				}
				publicTip.showLoadingToast(false);
				publicTip.showToast("已" + msg);
			}).fail(function (jqXHR, textStatus) { 
				publicTip.showLoadingToast(false);
				publicTip.showTip(jqXHR.responseJSON);
			});
		});
	});
	
})