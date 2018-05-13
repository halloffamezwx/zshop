requirejs.config({
	"baseUrl": "/static/js/lib",
	"paths": {
		"publicTip": "/static/js/app/public-tip"
    }
});

requirejs(["jquery", "publicTip"], function($, publicTip){
	$(function() {
		var $password = $("#password"); 
		var $passwordConfirm = $("#passwordConfirm");
		var $oldPassword = $("#oldPassword");

		$password.blur(function () {
			var password = $(this).val();
			if (password.trim() == '') {
				publicTip.showTipForStr("新的密码必填");
				$("#passwordCell").addClass('weui-cell_warn');
				return;
			} 
			var passwordConfirm = $passwordConfirm.val();
			if (passwordConfirm != '' && passwordConfirm != password) {
				publicTip.showTipForStr("新的密码和确认密码不一致");
				$("#passwordCell").addClass('weui-cell_warn');
				return;
			}
			$("#passwordCell").removeClass('weui-cell_warn');
		});

		$passwordConfirm.blur(function () {
			var password = $password.val();
			if (password.trim() == '') {
				publicTip.showTipForStr("请先输入新的密码");
				$("#passwordCell").addClass('weui-cell_warn');
				return;
			}
			var passwordConfirm = $(this).val();
			if (passwordConfirm.trim() == '') {
				publicTip.showTipForStr("确认密码必填");
				$("#passwordConfirmCell").addClass('weui-cell_warn');
				return;
			} 
			if (passwordConfirm != password) {
				publicTip.showTipForStr("新的密码和确认密码不一致");
				$("#passwordConfirmCell").addClass('weui-cell_warn');
				return;
			}
			$("#passwordConfirmCell").removeClass('weui-cell_warn');
		});

		$oldPassword.blur(function () {
			var oldPassword = $(this).val();
			if (oldPassword.trim() == '') {
				publicTip.showTipForStr("原的密码必填");
				$("#oldPasswordCell").addClass('weui-cell_warn');
				return;
			}

			$.ajax({
				type: 'post',
				dataType: 'json',
				url: '/zshop/userapi/checkPassword',
				data: {oldPassword: oldPassword}
			}).done(function (r) {
				$("#oldPasswordCell").removeClass('weui-cell_warn');
			}).fail(function (jqXHR, textStatus) { // Not 200
				publicTip.showTip(jqXHR.responseJSON);
				$("#oldPasswordCell").addClass('weui-cell_warn');
			});
		});

		$("#confirmBtn").click(function () {
			if ( $("#confirmBtn").hasClass('weui-btn_loading') ) {
				return;
			}

			var oldPassword = $oldPassword.val();
			var password = $password.val(); 
			var passwordConfirm = $passwordConfirm.val();

			if (oldPassword.trim() == '') {
				publicTip.showTipForStr("原的密码必填");
				$("#oldPasswordCell").addClass('weui-cell_warn');
				return;
			}
			if (password.trim() == '') {
				publicTip.showTipForStr("新的密码必填");
				$("#passwordCell").addClass('weui-cell_warn');
				return;
			}
			if (passwordConfirm.trim() == '') {
				publicTip.showTipForStr("确认密码必填");
				$("#passwordConfirmCell").addClass('weui-cell_warn');
				return;
			}
			if (password != passwordConfirm) {
				publicTip.showTipForStr("新的密码和确认密码不一致");
				$("#passwordCell").addClass('weui-cell_warn');
				$("#passwordConfirmCell").addClass('weui-cell_warn');
				return;
			}

			var userReq = {
                oldPassword: oldPassword,
				password: password,
				passwordConfirm: passwordConfirm
            };
			
			$("#confirmBtn").addClass('weui-btn_loading');
			$("#confirmLoading").addClass('weui-loading');
			$.ajax({
				type: 'post',
				dataType: 'json',
				contentType: 'application/json',
				url: '/zshop/userapi/uptPass',
				data: JSON.stringify(userReq)
			}).done(function (r) {
				publicTip.showConfirm('修改成功！重新登录？', function(){
					window.location.href = "/zshop/login";
				});
				$("#confirmBtn").removeClass('weui-btn_loading');
				$("#confirmLoading").removeClass('weui-loading');
			}).fail(function (jqXHR, textStatus) { // Not 200
				publicTip.showTip(jqXHR.responseJSON);
				if (jqXHR.responseJSON.code == 'index:error_password') {
					$("#oldPasswordCell").addClass('weui-cell_warn');
				}
				$("#confirmBtn").removeClass('weui-btn_loading');
				$("#confirmLoading").removeClass('weui-loading');
			});
			
		});
		
	});
	
})