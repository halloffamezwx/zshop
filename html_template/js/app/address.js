requirejs.config({
    "baseUrl": "js/lib",
    "shim": {
        "jquery.Spinner": ["jquery"]
    }
});

requirejs(["jquery", "weui.min", "city"], function($, weui, city){
	$(function() {
        $("#area").click(function () {
            weui.picker(city.cityData, {
                className: 'addressPicClass',
                container: '#addressPicContainer',
                defaultValue: ['440000', '440100', '440106'],
                onChange: function (result) {
                    console.log(result)
                },
                onConfirm: function (result) {
                    console.log(result)
                },
                id: 'addressPic'
            });
        });

        $("#addBtn").click(function () {
            $("#listDiv").hide();
            $("#editForm").show();
        });

        $("#backBtn").click(function () {
            $("#editForm").hide();
            $("#listDiv").show();
        });
	});
	
})