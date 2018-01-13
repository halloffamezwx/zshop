define(["zepto"], function($){
	var showAlert = function (msg, iKnowFun){
		$('#alertDialogContent').html(msg);
		//$('#alertDialogTitle').html(result.code);
		if (!iKnowFun) {
			iKnowFun = function(){
				$('#alertDialogContent').html('');
				$('#alertDialog').hide();
			}
		}
		$('#iKnow').one('click', iKnowFun);
		$('#alertDialog').show();
	}

	var showConfirm = function (msg, confirmFun, cancelFun) {
		$('#confirmDialogContent').html(msg);
		$('#confirmMain').unbind();
		$('#confirmMain').on('click', confirmFun);
		if (!cancelFun) {
			cancelFun = function(){
				$('#confirmDialogContent').html('');
				$('#confirmDialog').hide();
			}
		}
		$('#confirmAssist').unbind();
		$('#confirmAssist').on('click', cancelFun);
		$('#confirmDialog').show();
	}
	
	var showError = function (resp) {
		resp.json().then(function (result) {
			console.log('Error: ' + JSON.stringify(result));
			if (result.code == 'login:must_login') {
				window.location.href = '/zshop/login';
			} else {
				showAlert(result.message);
			}
		});
	}

	var tipTimeOutId;
	var showTip = function (resp) {
		//var msgObj = JSON.parse(msg);
		if (resp.code == 'login:must_login') {
			window.location.href = '/zshop/login';
		} else {
			$("#errorTip").html(resp.message);
			clearTimeout(tipTimeOutId);
			$("#errorTip").show(800);
			
			tipTimeOutId = setTimeout(function(){ 
				$("#errorTip").hide(800);
				$("#errorTip").html('');
			}, 2000);
		}
	}

	var showLoadingToast = function (flag, msg) {
		if (!msg) {
			msg = "数据加载中";
		} 
		$("#publicLoadingToastContent").html(msg);
		if (flag) {
			$("#publicLoadingToast").show();
		} else {
			$("#publicLoadingToast").hide();
		}
	}

	return {
		showAlert: showAlert,
		showConfirm: showConfirm,
		showError: showError,
		showTip: showTip,
		showLoadingToast: showLoadingToast
　　};
})
	