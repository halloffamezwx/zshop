requirejs.config({
    "baseUrl": "/static/js/lib"
});

requirejs(["jquery"], function($){
	$(function() {
		var tipTimeOutId;
		function showTip(msg) {
			$("#errorTip").html(msg);
			clearTimeout(tipTimeOutId);
			$("#errorTip").show(800);
			
			tipTimeOutId = setTimeout(function(){ 
				$("#errorTip").hide(800);
			}, 2000);
		}
		
		$("#loginBtn").click(function () {
			var mobile = $("#mobile").val();
			var password = $("#password").val(); 

			if (mobile.trim() == '' || password.trim() == '') {
				showTip("手机号和密码必填");
				return;
			}
			if ( !/^1\d{10}$/.test(mobile) ) {
				showTip("手机号格式不正确");
				return;
			}

			var userReq = {
                mobile: mobile,
                password: password
            };
			
			$.ajax({
				type: 'post',
				dataType: 'json',
				contentType: 'application/json',
				url: '/zshop/api/signin',
				data: JSON.stringify(userReq)
			}).done(function (r) {
				console.log(JSON.stringify(r));
				window.location.href = '/zshop/';
			}).fail(function (jqXHR, textStatus) { // Not 200
				showTip(jqXHR.responseJSON.message);
			});
			
		});
		
	});
	
})