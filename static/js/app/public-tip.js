define(["jquery"], function($){
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
				window.location.href = '/zshop/login?loginSuccUrl=' + window.location.pathname;
			} else {
				showAlert(result.message);
			}
		});
	}

	var tipTimeOutId;
	var showTip = function (resp) {
		//var msgObj = JSON.parse(msg);
		if (resp.code == 'login:must_login') {
			window.location.href = '/zshop/login?loginSuccUrl=' + window.location.pathname;
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
	var showTipForStr = function (tipMsg) {
		var msgObj = new Object();
		msgObj.message = tipMsg;
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

	let toastTimeOutId;
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
	