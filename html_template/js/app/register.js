requirejs.config({
    "baseUrl": "js/lib"
});

requirejs(["jquery", "weui.min"], function($, weui){
	
	$(function(){
		/* var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>',
			$gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
			$uploaderInput = $("#uploaderInput"),
			$uploaderFiles = $("#uploaderFiles")
			;

		$uploaderInput.on("change", function(e){
			var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
			for (var i = 0, len = files.length; i < len; ++i) {
				var file = files[i];
				console.log(file);

				if (url) {
					src = url.createObjectURL(file);
				} else {
					src = e.target.result;
				}

				$uploaderFiles.append($(tmpl.replace('#url#', src)));
			}
		});
		$uploaderFiles.on("click", "li", function(){
			$galleryImg.attr("style", this.getAttribute("style"));
			$gallery.fadeIn(100);
		});
		$gallery.on("click", function(){
			$gallery.fadeOut(100);
		}); */

		$("#headDiv").on("click", function(){
			$("#headFile").click();
		});

		var uploadCount = 0,
	    	uploadList = [];
		var uploadCountDom = document.getElementById("uploadCount");
		weui.uploader('#uploader', {
			url: 'http://localhost:8081',
		    auto: false,
		    type: 'file',
		    fileVal: 'fileVal',
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
			    if (files.length > 5) { // 防止一下子选择过多文件
				    weui.alert('最多只能上传5张图片，请重新选择');
				    return false;
			    }
			    if (uploadCount + 1 > 5) {
				    weui.alert('最多只能上传5张图片');
				    return false;
			    }
		
			    ++uploadCount;
		
			    // return true; // 阻止默认行为，不插入预览图的框架
		    },
		    onQueued: function(){
			    console.log(this);
		
			    // console.log(this.status); // 文件的状态：'ready', 'progress', 'success', 'fail'
			    // console.log(this.base64); // 如果是base64上传，file.base64可以获得文件的base64
		
			    // this.upload(); // 如果是手动上传，这里可以通过调用upload来实现；也可以用它来实现重传。
			    // this.stop(); // 中断上传
		
			    // return true; // 阻止默认行为，不显示预览图的图像
		    },
		    onBeforeSend: function(data, headers){
			    console.log(this, data, headers);
			    // $.extend(data, { test: 1 }); // 可以扩展此对象来控制上传参数
			    // $.extend(headers, { Origin: 'http://127.0.0.1' }); // 可以扩展此对象来控制上传头部
		
			    // return false; // 阻止文件上传
		    },
		    onProgress: function(procent){
			    console.log(this, procent);
			    // return true; // 阻止默认行为，不使用默认的进度显示
		    },
		    onSuccess: function (ret) {
			    console.log(this, ret);
			    // return true; // 阻止默认行为，不使用默认的成功态
		    },
		    onError: function(err){
			    console.log(this, err);
			    // return true; // 阻止默认行为，不使用默认的失败态
		    }
		});

		// 缩略图预览
		document.querySelector('#uploaderFiles').addEventListener('click', function (e) {
			var target = e.target;

			while (!target.classList.contains('weui-uploader__file') && target) {
				target = target.parentNode;
			}
			if (!target) return;

			var url = target.getAttribute('style') || '';
			var id = target.getAttribute('data-id');

			if (url) {
				url = url.match(/url\((.*?)\)/)[1].replace(/"/g, '');
			}
			var gallery = weui.gallery(url, {
				className: 'zindex-9999',
				onDelete: function onDelete() {
					weui.confirm('确定删除该图片？', function () {
						--uploadCount;
						uploadCountDom.innerHTML = uploadCount;

						for (var i = 0, len = uploadList.length; i < len; ++i) {
							var file = uploadList[i];
							if (file.id == id) {
								file.stop();
								break;
							}
						}
						target.remove();
						gallery.hide();
					});
				}
			});
		});

	});
	
})