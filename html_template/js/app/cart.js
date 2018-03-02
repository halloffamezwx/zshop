requirejs.config({
    "baseUrl": "js/lib",
    "shim": {
        "jquery.Spinner": ["jquery"]
    }
});

requirejs(["jquery", "jquery.Spinner"], function($){
	$(function() {
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
		});
		
		$("#cart-all").click();
		$(".Spinner").Spinner({value:1, len:3, max:15});
	});
	
})