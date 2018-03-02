requirejs.config({
    "baseUrl": "js/lib",
    "shim": {
        "jquery.Spinner": ["jquery"]
    }
});

requirejs(["jquery", "swiper-4.1.6.min", "jquery.Spinner"], function($, Swiper){
	$(function() {
		var mySwiper = new Swiper ('.swiper-container', {
			loop: true,
			// 分页器
			pagination: {
			    el: '.swiper-pagination',
				clickable: true
			}
		});
		
		$(".wy-header-titlebut").click(function () {
			var currentId = $(this).attr("id");
			$(".wy-product-content").hide();
			$("#" + currentId + "Div").show();
			
			$(".wy-header-titlebut").removeClass("wy-header-titlebut-active");
			$(this).addClass('wy-header-titlebut-active');
		});
		
		$(".Spinner").Spinner({value:1, len:3, max:15});
	});
	
})