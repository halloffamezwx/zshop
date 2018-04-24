define(["jquery"], function($){
	var showAlert = function (msg, iKnowFun, exFun){
		$('#alertDialogContent').html(msg);
		//$('#alertDialogTitle').html(result.code);
		if (!iKnowFun) {
			iKnowFun = function(){
				$('#alertDialogContent').html('');
				$('#alertDialog').hide();
				if (exFun) exFun();
			}
		}
		$('#iKnow').one('click', iKnowFun);
		$('#alertDialog').show();
	}

	var showConfirm = function (msg, confirmFun, cancelFun) {
		$('#confirmDialogContent').html(msg);
		$('#confirmMain').unbind();
		$('#confirmMain').on('click', function(){
			$('#confirmDialogContent').html('');
			$('#confirmDialog').hide();
			confirmFun();
		});
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
				var loginSuccUrl = result.loginSuccUrl || window.location.pathname || "/zshop/";
				window.location.href = '/zshop/login?loginSuccUrl=' + loginSuccUrl;
			} else {
				showAlert(result.message);
			}
		});
	}

	var tipTimeOutId;
	var showTip = function (resp) {
		//var msgObj = JSON.parse(msg);
		if (resp.code == 'login:must_login') {
			var loginSuccUrl = resp.loginSuccUrl || window.location.pathname || "/zshop/";
			window.location.href = '/zshop/login?loginSuccUrl=' + loginSuccUrl;
		} else {
			$("#errorTip").html(resp.message);
			clearTimeout(tipTimeOutId);
			//$("#errorTip").show(800);
			$("#errorTip").show();
			
			tipTimeOutId = setTimeout(function(){ 
				$("#errorTip").hide();
				$("#errorTip").html('');
			}, 2000);
		}
	}
	var showTipForStr = function (tipMsg, tipCode) {
		var msgObj = new Object();
		msgObj.message = tipMsg;
		if (tipCode) {
			msgObj.code = tipCode;
		}
		showTip(msgObj);
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

	var toastTimeOutId;
	var showToast = function (msg) {
		if (!msg) {
			msg = "已完成";
		} 
		$("#publicToastContent").html(msg);
		clearTimeout(toastTimeOutId);
		$("#publicToast").show();
		
		toastTimeOutId = setTimeout(function(){ 
			$("#publicToast").hide();
			$("#publicToastContent").html('');
		}, 1000);
	}

	return {
		showAlert: showAlert,
		showConfirm: showConfirm,
		showError: showError,
		showTip: showTip,
		showTipForStr: showTipForStr,
		showLoadingToast: showLoadingToast,
		showToast: showToast
　　};
})
	