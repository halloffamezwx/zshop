requirejs.config({
    "baseUrl": "/static/js/lib",
    "paths": {
        "index": "/static/js/app/index",
        "zepto": "zepto.min",
        "vue": "vue.min",
        "vue-resource": "vue-resource.min"
    }
});

requirejs(["index"]);