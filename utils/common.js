
module.exports = {
    sleep: function (time) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve('ok');
                //reject('error'); //模拟出错了，返回 ‘error’
            }, time);
        })
    }
};
