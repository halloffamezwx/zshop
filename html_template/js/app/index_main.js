requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "index": "../app/index"
    }
});

requirejs(["index"]);