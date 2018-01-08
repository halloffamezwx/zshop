requirejs.config({
    "baseUrl": "/static/js/lib",
    "paths": {
        "index": "/static/js/app/index",
        "publicTip": "/static/js/app/public-tip",
        "zepto": "zepto.min",
        "vue": "vue.min",
        "vue-resource": "vue-resource.min"
    }
});

requirejs(["index"]);