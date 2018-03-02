requirejs.config({
    "baseUrl": "js/lib"
});

requirejs(["jquery"], function($){
	$(function() {
		var tipTimeOutId;
		
		$("#loginBtn").click(function () {
			clearTimeout(tipTimeOutId);
			$("#errorTip").show(800);
			
			tipTimeOutId = setTimeout(function(){ 
				$("#errorTip").hide(800);
			}, 2000);
		});
		
	});
	
})