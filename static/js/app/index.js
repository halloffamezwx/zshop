//define(["jquery", "vue", "vue-resource", "publicTip", "swipe"], function($, Vue, vueResource, publicTip){
define(["jquery", "vue", "vue-resource", "publicTip", "swiper-4.1.6.min", "public"], function($, Vue, vueResource, publicTip, Swiper, public){
	//alert("load finished");
	Vue.use(vueResource);
	
	$(function() {
		function swipeFun() {
			var mySwipeElem = document.getElementById('mySwipe');
			window.mySwipe = Swipe(mySwipeElem, {
				//startSlide: 4,
				auto: 2500,
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
				//transitionEnd: function(index, element) {}
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
			var tabbarItemJqObj = $(this);
			var currentId = tabbarItemJqObj.attr("id");

			//if (currentId == 'my' && $('#userName').html() == '') {
			if (currentId == 'my') {
				publicTip.showLoadingToast(true);
				$.ajax({
					type: 'post',
					dataType: 'json',
					url: '/zshop/userapi/getLoginUserInfo'
				}).done(function (r) {
					$('#userName').html(r.user.name);
					$('#userId').html(r.user.userId);
					$('#userHeadImage').attr("src", r.user.headImage);

					if (r.orderCount.paySize > 0) {
						$('#payBadge').html(r.orderCount.paySize);
						$('#payBadge').show();
					} else {
						$('#payBadge').hide();
					}
					if (r.orderCount.sendSize > 0) {
						$('#sendBadge').html(r.orderCount.sendSize);
						$('#sendBadge').show();
					} else {
						$('#sendBadge').hide();
					}
					if (r.orderCount.recvieSize > 0) {
						$('#recvieBadge').html(r.orderCount.recvieSize);
						$('#recvieBadge').show();
					} else {
						$('#recvieBadge').hide();
					}
					if (r.orderCount.evalSize > 0) {
						$('#evalBadge').html(r.orderCount.evalSize);
						$('#evalBadge').show();
					} else {
						$('#evalBadge').hide();
					}

					publicTip.showLoadingToast(false);
					changeTabbarStyle(tabbarItemJqObj, currentId);
				}).fail(function (jqXHR, textStatus) { 
					publicTip.showLoadingToast(false);
					jqXHR.responseJSON.loginSuccUrl = "/zshop?actTabbar=my";
					publicTip.showTip(jqXHR.responseJSON);
				});
			} else {
				changeTabbarStyle(tabbarItemJqObj, currentId);
			}
		});

		function changeTabbarStyle(tabbarItemJqObj, currentId) {
			var preId = $(".weui-bar__item_on").attr("id");

			$(".weui-bar__item_on img").attr("src", "/static/images/" + preId + ".png");
			$(".weui-bar__item_on").removeClass("weui-bar__item_on");
			tabbarItemJqObj.addClass("weui-bar__item_on");
			
			//$("div.weui-tab__panel[style='display: block;']").hide();
			$(".weui-tab__panel").hide();
			$("#" + currentId + "_content").show();
			$("#" + currentId + "_img").attr("src", "/static/images/" + currentId + "_on.png");	
			
			//mySwipe.next();
			//if (currentId == 'index' && preId != 'index') {
			//	$(".swipe-wrap-circle li").css("color", "#c8c9cb");
			//	$(".swipe-wrap-circle li:first-child").css("color", "green");
			//	swipeFun();
			//}
		}

		var actTabbar = public.getQueryString()["actTabbar"];
		if (actTabbar) {
			$("#" + actTabbar).click();
		}
		
		$('#signoutHref').on('click', function(){
			publicTip.showConfirm('确认退出登录？', function(){
				window.location.href = "/zshop/signout";
			});
		});

		function hideSearchResult(){
			$('#searchResult').hide();
			$('#searchInput').val('');
		}
		function cancelSearch(){
			hideSearchResult();
			$('#searchBar').removeClass('weui-search-bar_focusing');
			$('#searchText').show();
		}

		var gcVm = new Vue({
			el: '#goods_content',
			http: {
				timeout: 5000
			},
			data: {
				key: '',
				sprods: [],
				loading: false,
				limit: 3,
				offset: 0,
				hasdata: false,
				loadMoreflag: false,
				ordertype: 0
			},
			methods: {
				searchTextClick: function () {
					$('#searchBar').addClass('weui-search-bar_focusing');
					$('#searchInput').focus();
				},
				searchClearClick: function () {
					hideSearchResult();
					$('#searchInput').focus();
				},
				searchCancelClick: function () {
					cancelSearch();
					$('#searchInput').blur();
				},
				searchInputBlur: function () {
					if(!$('#searchInput').val().length) cancelSearch();
				},
				searchInputInput: function () {
					if($('#searchInput').val().length) {
						$('#searchResult').show();
					} else {
						$('#searchResult').hide();
					}
				},
				search: function (isLoadMore, tipKey, ot) {
					$('#searchResult').hide();
					var that = this;
					that.loading = true;
					that.loadMoreflag = isLoadMore;

					if (ot) {
						if (ot == 1) {
							if (that.ordertype == 1) {
								that.ordertype = 2;
							} else {
								that.ordertype = 1;
							}
						} else if (ot == 3) {
							if (that.ordertype == 3) {
								that.ordertype = 4;
							} else {
								that.ordertype = 3;
							}
						} else {
							that.ordertype == ot;
						}
					} else {
						if (!isLoadMore) {
							that.ordertype = 0;
						}
					}
					
					if (tipKey) {
						that.key = tipKey;
					} 
					if (!that.key || that.key.trim() == '') {
						that.loading = false;
						publicTip.showAlert("搜索关键字不能为空");
						return;
					}

					if (isLoadMore) {
						that.offset = that.offset + that.limit;
					} else {
						that.limit = 3;
						that.offset = 0;
					}	

					that.$resource('/zshop/api/search/' + that.key + "/"+ that.limit + "/" + that.offset + "/" + that.ordertype).get().then(function (resp) {
						that.loading = false;

						resp.json().then(function (result) {
							//console.log(JSON.stringify(result));
							var rows = result.prods.rows;
							if (rows.length > 0) {
								that.hasdata = true;
							} else {
								that.hasdata = false;
							}

							if (isLoadMore) {
								that.sprods = that.sprods.concat(rows);
								//for (let i = 0; i < rows.length; i++) {
								//	that.sprods.push(rows[i]);
								//}
							} else {
								that.sprods = rows; //result.prods.count;
							}
							
						});
					}, function (resp) {
						that.loading = false;
						publicTip.showError(resp);
					});
				}
			}
		}); 

	});
	
})
	