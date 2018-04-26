requirejs.config({
    "baseUrl": "js/lib"
});

requirejs(["jquery"], function($){
	
	$(function(){
		var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>',
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
		});
	});
	
})