requirejs.config({
    "baseUrl": "js/lib"
});

requirejs(["jquery"], function($){
	
	$(function(){
		var $gallery = $("#gallery"), $galleryImg = $("#galleryImg");

		$("#headFile").on("change", function(e){
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
		});
		$("#headImage").on("click", function(){
			$galleryImg.attr("style", "background-image:url(" + this.getAttribute("src") + ")");
			$gallery.fadeIn(100);
			event.stopPropagation();
		});
		$gallery.on("click", function(){
			$gallery.fadeOut(100);
		}); 

		$("#headDiv").on("click", function(){
			$("#headFile").click();
		});

	});
	
})