//define(["jquery", "swipe"], function($){
define(["jquery", "swiper-4.1.6.min"], function($, Swiper){
	//alert("load finished");
	
	$(function() {
		function swipeFun() {
			var mySwipeElem = document.getElementById('mySwipe');
			window.mySwipe = Swipe(mySwipeElem, {
				//startSlide: 4,
				auto: 2000,
				//continuous: true,
				//disableScroll: true,
				//stopPropagation: true,
				callback: function(index, element) {
					//var preIndex = index - 1;
					//if (preIndex == -1) {
					//	preIndex = mySwipe.getNumSlides() - 1;
					//}
					//$("#disc_" + preIndex).css("list-style-type", "circle");
					//$("#disc_" + index).css("list-style-type", "disc");
					//$("#disc_" + preIndex).css("color", "#c8c9cb");
					$(".swipe-wrap-circle li").css("color", "#c8c9cb");
					$("#disc_" + index).css("color", "green");
				},
				//transitionEnd: function(index, element) {
				//	
				//}
			});
		}
		//swipeFun();
		
		var mySwiper = new Swiper ('.swiper-container', {
			loop: true,
			autoplay : {
			    delay:2000
		    },
			// 分页器
			pagination: {
			    el: '.swiper-pagination',
				clickable: true
			}
		});
		
		$(".weui-tabbar__item").click(function () {
			var currentId = $(this).attr("id");
			var preId = $(".weui-bar__item_on").attr("id");
			
			$(".weui-bar__item_on img").attr("src", "./images/" + preId + ".png");
			$(".weui-bar__item_on").removeClass("weui-bar__item_on");
			$(this).addClass("weui-bar__item_on");
			
			//$("div.weui-tab__panel[style='display: block;']").hide();
			$(".weui-tab__panel").hide();
			$("#" + currentId + "_content").show();
			$("#" + currentId + "_img").attr("src", "./images/" + currentId + "_on.png");	
			
			//mySwipe.next();
		});
		
		$("#loadmore-button").click(function () {
			$("#loadmore-button").hide();
			$("#loadmore-loading").show();
			setTimeout(function () {
				$("#loadmore-loading").hide();
				$("#noData").show();
			}, 1000);
		});
		
		var $searchBar = $('#searchBar'),
		$searchResult = $('#searchResult'),
		$searchText = $('#searchText'),
		$searchInput = $('#searchInput'),
		$searchClear = $('#searchClear'),
		$searchCancel = $('#searchCancel');

		function hideSearchResult(){
			$searchResult.hide();
			$searchInput.val('');
		}
		function cancelSearch(){
			hideSearchResult();
			$searchBar.removeClass('weui-search-bar_focusing');
			$searchText.show();
		}

		$searchText.on('click', function(){
			$searchBar.addClass('weui-search-bar_focusing');
			$searchInput.focus();
		});
		$searchInput
			.on('blur', function () {
				if(!this.value.length) cancelSearch();
			})
			.on('input', function(){
				if(this.value.length) {
					$searchResult.show();
				} else {
					$searchResult.hide();
				}
			})
		;
		$searchClear.on('click', function(){
			hideSearchResult();
			$searchInput.focus();
		});
		$searchCancel.on('click', function(){
			cancelSearch();
			$searchInput.blur();
		});	
	});
	
})
	