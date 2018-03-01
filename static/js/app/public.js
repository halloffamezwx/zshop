define(function(){
	//获取url中的参数
	var getQueryString = function (name) {
		var qs = location.search.substr(1), // 获取url中"?"符后的字串  
		args = {}, // 保存参数数据的对象
		items = qs.length ? qs.split("&") : [], // 取得每一个参数项,
		item = null,
		len = items.length;
	 
	    for(var i = 0; i < len; i++) {
			item = items[i].split("=");
			var name = decodeURIComponent(item[0]),
			value = decodeURIComponent(item[1]);
			if (name) {
				args[name] = value;
			}
	    }
	    return args;
    }

	return {
		getQueryString: getQueryString
　　};
})
	