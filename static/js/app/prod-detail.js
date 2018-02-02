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
		
		$(".Spinner").Spinner({value:1, len:3, max:15});
	});
	
})