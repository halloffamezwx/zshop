requirejs.config({
    "baseUrl": "js/lib",
    "shim": {
        "jquery.Spinner": ["jquery"]
    }
});

requirejs(["jquery", "jquery.Spinner"], function($){
	$(function() {
		
	});
	
})