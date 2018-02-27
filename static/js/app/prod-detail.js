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

requirejs(["jquery", "publicTip", "swiper-4.1.6.min", "jquery.Spinner"], function($, publicTip, Swiper){
	$(function() {
		var mySwiper = new Swiper ('.swiper-container', {
			loop: true,
			// 分页器
			pagination: {
			    el: '.swiper-pagination',
				clickable: true
			}
		});
		
		var gavJsonArr = JSON.parse($("#gavJsonStr").val());
		let gavMap = new Map();
		let gavObMap = new Map();

		for (let i = 0; i < gavJsonArr.length; i++) {
			if (!gavJsonArr[i].prodId) continue;

			let gavArr = gavMap.get(gavJsonArr[i].prodId);
			let gavOb = gavObMap.get(gavJsonArr[i].prodId);
			if (!gavArr) gavArr = new Array();
			if (!gavOb) gavOb = new Map();

			gavArr.push(gavJsonArr[i]);
			gavOb.set(gavJsonArr[i].attriId, gavJsonArr[i].attriValue);

			gavMap.set(gavJsonArr[i].prodId, gavArr);
			gavObMap.set(gavJsonArr[i].prodId, gavOb);
		}

		let selFlag = false;
		$(".gavUl li").click(function () {
			if ($(this).hasClass("active") || $(this).hasClass("disabled")) {
				return;
			}
			let selGroupAttriId = $(this).attr("groupAttriId");
			let selGroupAttriValue = $(this).find("a").html();
			$(".active." + selGroupAttriId).removeClass("active");
			$(this).addClass("active");

			let activeMap = new Map();
			$(".active").each(function () {
				activeMap.set($(this).attr("groupAttriId"), $(this).find("a").html());
			});

			let matchProdId;
			for (let gavItem of gavMap.entries()) {
				let gavArr = gavItem[1];
				let isMatch = true; 
				for (let i = 0; i < gavArr.length; i++) {
					if ( activeMap.get(gavArr[i].attriId) != gavArr[i].attriValue ) {
						isMatch = false;
						break;
					}
				}

				if (isMatch) {
					matchProdId = gavItem[0];
					break;
				}
			}
			if (matchProdId) {
				window.location.href = '/zshop/prodDetail/' + matchProdId;
			} else {
				$("#addCart").css("background-color", "gray");
				if (!selFlag) {
					$(".gavUl li:not(." + selGroupAttriId + ")").removeClass("active");
					selFlag = true;
				}

				$(".gavUl li:not(." + selGroupAttriId + ")").each(function () {
					if ( $(this).attr("disableFlag") == "ture" ) {
						return;
					}
					let itGaId = $(this).attr("groupAttriId");
					let itGaValue = $(this).find("a").html();

					let isMatch = false;
					for (let gavItem of gavObMap.entries()) {
						let gavOb = gavItem[1];
						 
						if (gavOb.get(selGroupAttriId) == selGroupAttriValue && gavOb.get(itGaId) == itGaValue) {
							isMatch = true;
							break;
						}
					}
					
					if (isMatch) {
						$(this).removeClass("disabled");
					} else {
						if ( !$(this).hasClass("disabled") ) {
							$(this).addClass("disabled");
							$(this).removeClass("active");
						}
					}
				});
			}
		});

		let max = 5;
		let min = 1;
		let stock = parseInt($("#pstock").val());
		if (stock < max) {
			max = stock;
		}
		if (stock < min) {
			min = stock;
		}
		$("#pcs").Spinner({value:min, len:3, max:max});
		
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
			if (selFlag) {
				return;
			}
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
				url: '/zshop/userapi/collection/act',
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