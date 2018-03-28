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
		var gavObMap = new Map();

		for (var i = 0; i < gavJsonArr.length; i++) {
			if (!gavJsonArr[i].prodId) continue;

			var gavObA = gavObMap.get(gavJsonArr[i].prodId);
			if (!gavObA) gavObA = new Map();
			gavObA.set(gavJsonArr[i].attriId, gavJsonArr[i].attriValue);

			gavObMap.set(gavJsonArr[i].prodId, gavObA);
		}

		function changeLiDisStatus() {
			$(".gavUl li").each(function () {
				if ( $(this).attr("disableFlag") == "true" ) {
					return;
				}
				var itGaId = $(this).attr("groupAttriId");
				var itGaValue = $(this).find("a").html();
				
				if ( $(".active." + itGaId).length > 0 ) {
					if ( $(this).hasClass("disabled") ) {
						$(this).removeClass("disabled");
					}
					return;
				}

				var activeMap = new Map();
				$(".active").each(function () {
					activeMap.set($(this).attr("groupAttriId"), $(this).find("a").html());
				});

				var isMatch = false;
				for (var gavItem of gavObMap.entries()) {
					var gavOb = gavItem[1];
					if (gavOb.get(itGaId) != itGaValue) {
						continue;
					}

					var isMatchActive = true;
					for (var activeItem of activeMap.entries()) {
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

		var selFlag = false;
		var disableAddCart = false;
		$(".gavUl li").click(function () {
			if ($(this).hasClass("disabled")) {
				return;
			}
			
			var selGroupAttriId = $(this).attr("groupAttriId");
			var selGroupAttriValue = $(this).find("a").html();

			if ( $(this).hasClass("active") ) {
				$(this).removeClass("active");
				disableAddCart = true;
				if (!selFlag) selFlag = true;
				$("#addCart").css("background-color", "gray");
				changeLiDisStatus();
			} else {
				$(".active." + selGroupAttriId).removeClass("active");
				$(this).addClass("active");

				var activeMap = new Map();
				$(".active").each(function () {
					activeMap.set($(this).attr("groupAttriId"), $(this).find("a").html());
				});

				var matchProdId;
				for (var gavItem of gavObMap.entries()) {
					var isMatch = true; 
					var gavOb = gavItem[1];

					for (var gavObItem of gavOb.entries()) {
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
					disableAddCart = true;
					$("#addCart").css("background-color", "gray");
					if (!selFlag) {
						$(".gavUl li:not(." + selGroupAttriId + ")").removeClass("active");
						selFlag = true;
					}
					changeLiDisStatus();
				}
			}
		});

		var max = 5;
		var min = 1;
		var stock = parseInt($("#pstock").val());
		if (stock < max) {
			max = stock;
		}
		if (stock < min) {
			min = stock;
		}
		$("#pcs").Spinner({value:min, len:3, max:max});
		
		var isLoadDetail = false;
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
			if (disableAddCart) {
				return;
			}
			if (stock <= 0) {
				publicTip.showAlert("库存为空");
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
				//var cardProdNum = parseInt($("#cardProdNum").html());
				//cardProdNum = cardProdNum + 1;
				$("#cardProdNum").html(r.cartSize);
				$("#cardProdNum").show();
			}).fail(function (jqXHR, textStatus) { 
				publicTip.showLoadingToast(false);
				publicTip.showTip(jqXHR.responseJSON);
			});
		});

		$("#buyNowBtn").click(function () {
			if (stock <= 0) {
				publicTip.showAlert("库存为空");
				return;
			}
			publicTip.showLoadingToast(true, "操作中");
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: '/zshop/userapi/buyNow',
				data: {
					pid: $("#pid").val(), 
					pcount: $("#pcs").find("input").val()
				}
			}).done(function (r) {
				window.location.href = "/zshop/user/settlement/" + r.orderId;
			}).fail(function (jqXHR, textStatus) { 
				publicTip.showLoadingToast(false);
				publicTip.showTip(jqXHR.responseJSON);
			});
		});

		$("#collectionHref").click(function () {
			var id = $("#collectionId").val();
			var msg = '取消收藏';
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

		var $iosActionsheet = $('#iosActionsheet');
        var $iosMask = $('#iosMask');

        function hideActionSheet() {
            $iosActionsheet.removeClass('weui-actionsheet_toggle');
            $iosMask.fadeOut(200);
        }

        $iosMask.on('click', hideActionSheet);
        $('#iosActionsheetCancel').on('click', hideActionSheet);
        $("#kefuHref").on("click", function(){
            $iosActionsheet.addClass('weui-actionsheet_toggle');
            $iosMask.fadeIn(200);
		});
		
		$("#callKfNumD").on("click", function(){
			document.getElementById("callKfNumA").click();
            hideActionSheet();
        });
	});
	
})