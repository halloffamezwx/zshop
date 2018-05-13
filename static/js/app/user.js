requirejs.config({
	"baseUrl": "/static/js/lib",
	"paths": {
		"publicTip": "/static/js/app/public-tip"
    }
});

requirejs(["jquery", "weui.min", "publicTip"], function($, weui, publicTip){
	
	$(function(){
		var $gallery = $("#gallery"), $galleryImg = $("#galleryImg");

		/* $("#headFile").on("change", function(e){
			var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
			if (files.length > 0) {
				var file = files[0];
				console.log(file);

				if (url) {
					src = url.createObjectURL(file);
				} else {
					src = e.target.result;
				}

				$("#headImage").attr("src", src);
			}
		}); */
		$(".weui-uploader__file").on("click", function(){
			$galleryImg.attr("style", this.getAttribute("style"));
			$gallery.fadeIn(100);
			event.stopPropagation();
		});
		$gallery.on("click", function(){
			$gallery.fadeOut(100);
		}); 

		$("#headDiv").on("click", function(){
			$("#uploaderInput").click();
		});

		var $name = $("#name");
		var $userId = $("#userId");
		var $email = $("#email");
		var emailRegex = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

		$name.blur(function () {
			var name = $name.val();
			if (name.trim() == '') {
				publicTip.showTipForStr("用户名称必填");
				$("#nameCell").addClass('weui-cell_warn');
			} else {
				$("#nameCell").removeClass('weui-cell_warn');
			}
		});

		$userId.blur(function () {
			var userId = $userId.val();
			if (userId.trim() == '') {
				publicTip.showTipForStr("用户ID必填");
				$("#userIdCell").addClass('weui-cell_warn');
				return;
			} 
			if (userId.length > 30) {
				publicTip.showTipForStr("用户ID最多30个字符");
				$("#userIdCell").addClass('weui-cell_warn');
				return;
			}

			$.ajax({
				type: 'post',
				dataType: 'json',
				url: '/zshop/userapi/checkUserInfo',
				data: {userId: userId}
			}).done(function (r) {
				if (r.countInt > 0) {
					publicTip.showTipForStr("该用户ID已被占用");
					$("#userIdCell").addClass('weui-cell_warn');
				} else {
					$("#userIdCell").removeClass('weui-cell_warn');
				}
			}).fail(function (jqXHR, textStatus) { // Not 200
				publicTip.showTip(jqXHR.responseJSON);
				$("#userIdCell").addClass('weui-cell_warn');
			});

		});

		$email.blur(function () {
			var email = $email.val();
			if (email.trim() == '') {
				return;
			}
			if (!emailRegex.test(email)) {
				publicTip.showTipForStr("电子邮箱格式不正确");
				$("#emailCell").addClass('weui-cell_warn');
				return;
			} 
				
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: '/zshop/userapi/checkUserInfo',
				data: {email: email}
			}).done(function (r) {
				if (r.countInt > 0) {
					publicTip.showTipForStr("该电子邮箱已被占用");
					$("#emailCell").addClass('weui-cell_warn');
				} else {
					$("#emailCell").removeClass('weui-cell_warn');
				}
			}).fail(function (jqXHR, textStatus) { // Not 200
				publicTip.showTip(jqXHR.responseJSON);
				$("#emailCell").addClass('weui-cell_warn');
			});
		});

		var weuiUploadFun = null;
		$("#confirmBtn").on("click", function(){
			if ( $("#confirmBtn").hasClass('weui-btn_loading') || 
			     $("#confirmBtn").hasClass('weui-btn_disabled') ) {
				return;
			}

			var name = $name.val();
			var userId = $userId.val(); 
			var email = $email.val();

			if (name.trim() == '') {
				publicTip.showTipForStr("用户名称必填");
				$("#nameCell").addClass('weui-cell_warn');
				return;
			}

			if (userId.trim() == '') {
				publicTip.showTipForStr("用户ID必填");
				$("#userIdCell").addClass('weui-cell_warn');
				return;
			}
			if (userId.length > 30) {
				publicTip.showTipForStr("用户ID最多30个字符");
				$("#userIdCell").addClass('weui-cell_warn');
				return;
			}

			if ( email != '' && !emailRegex.test(email) ) {
				publicTip.showTipForStr("电子邮箱格式不正确");
				$("#emailCell").addClass('weui-cell_warn');
				return;
			}

			$("#confirmBtn").addClass('weui-btn_loading');
			$("#confirmLoading").addClass('weui-loading');
			if (weuiUploadFun) {
				weuiUploadFun();
			} else {
				$.ajax({
					type: 'post',
					dataType: 'json',
					url: '/zshop/userapi/uptUserInfo?noImage=true',
					data: {
						name: name, 
						userId: userId, 
						email: email
					}
				}).done(function (r) {
					window.location.href = '/zshop?actTabbar=my';
				}).fail(function (jqXHR, textStatus) { // Not 200
					publicTip.showTip(jqXHR.responseJSON);
					if (jqXHR.responseJSON.code == 'uptUserInfo:repeat_userId') {
						$("#userIdCell").addClass('weui-cell_warn');
					} else if (jqXHR.responseJSON.code == 'uptUserInfo:repeat_email') {
						$("#emailCell").addClass('weui-cell_warn');
					}
					$("#confirmBtn").removeClass('weui-btn_loading');
					$("#confirmLoading").removeClass('weui-loading');
				});
			}
		});

		//var uploadCount = 0;
		weui.uploader('#uploader', {
			url: '/zshop/userapi/uptUserInfo',
			auto: false,
			type: 'file',
			fileVal: 'uploaderInput',
			compress: {
				width: 1600,
				height: 1600,
				quality: .8
			},
			onBeforeQueued: function(files) {
				// `this` 是轮询到的文件, `files` 是所有文件
		
				if(["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(this.type) < 0){
					weui.alert('请上传图片');
					return false; // 阻止文件添加
				}
				if(this.size > 10 * 1024 * 1024){
					weui.alert('请上传不超过10M的图片');
					return false;
				}
				$("#uploaderFiles").html('');
				//publicTip.showLoadingToast(true, "压缩图片中");
				$("#confirmBtn").addClass('weui-btn_disabled');
		
				//if (files.length > 5) { // 防止一下子选择过多文件
				//	weui.alert('最多只能上传5张图片，请重新选择');
				//	return false;
				//}
				//if (uploadCount + 1 > 5) {
				//	weui.alert('最多只能上传5张图片');
				//	return false;
				//}
		
				//++uploadCount;
		
				// return true; // 阻止默认行为，不插入预览图的框架
			},
			onQueued: function(){
				//console.log(this);
				$(".weui-uploader__file").unbind();
				$(".weui-uploader__file").on("click", function(){
					$galleryImg.attr("style", this.getAttribute("style"));
					$gallery.fadeIn(100);
					event.stopPropagation();
				});

				weuiUploadFun = this.upload;
				//publicTip.showLoadingToast(false);
				$("#confirmBtn").removeClass('weui-btn_disabled');
		
				// console.log(this.status); // 文件的状态：'ready', 'progress', 'success', 'fail'
				// console.log(this.base64); // 如果是base64上传，file.base64可以获得文件的base64
		
				// this.upload(); // 如果是手动上传，这里可以通过调用upload来实现；也可以用它来实现重传。
				// this.stop(); // 中断上传
		
				// return true; // 阻止默认行为，不显示预览图的图像
			},
			onBeforeSend: function(data, headers){
				//console.log(this, data, headers);
				// 可以扩展此对象来控制上传参数
				$.extend(data, { 
					name: $("#name").val(), 
					userId: $("#userId").val(), 
					email: $("#email").val()
				}); 
				// $.extend(headers, { Origin: 'http://127.0.0.1' }); // 可以扩展此对象来控制上传头部
		
				// return false; // 阻止文件上传
			},
			onProgress: function(procent){
				//console.log(this, procent);
				// return true; // 阻止默认行为，不使用默认的进度显示
			},
			onSuccess: function (ret) {
				//console.log(this, ret);
				window.location.href = '/zshop?actTabbar=my';
				// return true; // 阻止默认行为，不使用默认的成功态
			},
			onError: function(err){
				//console.log(this, err);
				// return true; // 阻止默认行为，不使用默认的失败态
				var responeJsonObj = JSON.parse(this.xhr.responseText);
				publicTip.showTip(responeJsonObj);
				if (responeJsonObj.code == 'uptUserInfo:repeat_userId') {
					$("#userIdCell").addClass('weui-cell_warn');
				} else if (responeJsonObj.code == 'uptUserInfo:repeat_email') {
					$("#emailCell").addClass('weui-cell_warn');
				}
				$("#confirmBtn").removeClass('weui-btn_loading');
				$("#confirmLoading").removeClass('weui-loading');
			}
		});

	});
	
})