define(function(){
	
	var cityData = [
    {
        label: '广东',
        value: 0,
        children: [{
            label: '广州',
            value: 0,
            children: [{
                label: '海珠',
                value: 0
            }, {
                label: '番禺',
                value: 1
            }]
        }, {
            label: '佛山',
            value: 1,
            children: [{
                label: '禅城',
                value: 0
            }, {
                label: '南海',
                value: 1
            }]
        }]
    }, {
        label: '广西',
        value: 1,
        children: [{
            label: '南宁',
            value: 0,
            children: [{
                label: '青秀',
                value: 0
            }, {
                label: '兴宁',
                value: 1
            }]
        }, {
            label: '桂林',
            value: 1,
            children: [{
                label: '象山',
                value: 0
            }, {
                label: '秀峰',
                value: 1
            }]
        }]
    }]

	return {
		cityData: cityData
　　};
})
	