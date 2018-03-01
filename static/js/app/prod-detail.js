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
		let gavObMap = new Map();

		for (let i = 0; i < gavJsonArr.length; i++) {
			if (!gavJsonArr[i].prodId) continue;

			let gavOb = gavObMap.get(gavJsonArr[i].prodId);
			if (!gavOb) gavOb = new Map();
			gavOb.set(gavJsonArr[i].attriId, gavJsonArr[i].attriValue);

			gavObMap.set(gavJsonArr[i].prodId, gavOb);
		}

		function changeLiDisStatus() {
			$(".gavUl li").each(function () {
				if ( $(this).attr("disableFlag") == "true" ) {
					return;
				}
				let itGaId = $(this).attr("groupAttriId");
				let itGaValue = $(this).find("a").html();
				
				if ( $(".active." + itGaId).length > 0 ) {
					if ( $(this).hasClass("disabled") ) {
						$(this).removeClass("disabled");
					}
					return;
				}

				let activeMap = new Map();
				$(".active").each(function () {
					activeMap.set($(this).attr("groupAttriId"), $(this).find("a").html());
				});

				let isMatch = false;
				for (let gavItem of gavObMap.entries()) {
					let gavOb = gavItem[1];
					if (gavOb.get(itGaId) != itGaValue) {
						continue;
					}

					let isMatchActive = true;
					for (let activeItem of activeMap.entries()) {
						if (gavOb.get(activeItem[0]) != activeItem[1]) {
							isMatchActive = false;
							break;
						}
					}
					
					if (isMatchActive) {
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

		let selFlag = false;
		$(".gavUl li").click(function () {
			if ($(this).hasClass("disabled")) {
				return;
			}
			
			let selGroupAttriId = $(this).attr("groupAttriId");
			let selGroupAttriValue = $(this).find("a").html();

			if ( $(this).hasClass("active") ) {
				$(this).removeClass("active");
				changeLiDisStatus();
			} else {
				$(".active." + selGroupAttriId).removeClass("active");
				$(this).addClass("active");

				let activeMap = new Map();
				$(".active").each(function () {
					activeMap.set($(this).attr("groupAttriId"), $(this).find("a").html());
				});

				let matchProdId;
				for (let gavItem of gavObMap.entries()) {
					let isMatch = true; 
					let gavOb = gavItem[1];

					for (let gavObItem of gavOb.entries()) {
						if ( activeMap.get(gavObItem[0]) != gavObItem[1] ) {
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
					changeLiDisStatus();
				}
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