zshop是一个nodejs写的商城系统，看完廖雪峰的[《javaScript全栈教程》](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000)后，想练练手，已是开始踩坑之路。目前完成了首页，商品搜索，购物车，我的，登录，商品详情，结算等，后面将继续完善其它功能。完善后会把数据库的er图画出来。

在线预览效果地址：<http://120.25.167.14:3000/zshop/>（pc浏览器请切换为手机模式）。部署在阿里云上面，`centOS 6.5 64位`，`1核cpu`，`1g内存`，`1m带宽`，`40g普通硬盘`，登录手机：18312345678，密码：123456。

<b>一 部署方式：</b></br>

<b><i>1</i></b> 安装`node.js`（7.6版本以上，因为要支持`async/await`）；</br>
<b><i>2</i></b> 安装`mysql`数据库（utf-8编码的配置），创建数据库`zshop`；</br>
<b><i>3</i></b> 下载本工程文件，可修改数据库的用户名密码等连接配置（middleware目录下的`config-default.js`和`config-test.js`两个配置文件），在根目录下执行`npm install`下载依赖库，然后执行`node init-db.js`（初始化数据库表和表数据）；</br>
<b><i>4</i></b> 最后在工程根目录下执行`node app.js`，看到日志`app started at port 3000...`就代表启动成功了，浏览器访问<http://localhost:3000/zshop/>（pc浏览器请切换为手机模式）。

<b>二 涉及的技术框架：</b></br>

<b><i>1</i></b> 前端：`weui.css`，`jquery`，`jquery.spinner`，`requirejs`，`swiper-4.1.6`，`vue`，`vue-resource`；</br>
<b><i>2</i></b> 后端：`koa2`，`koa-bodyparser`，`koa-router`，`nunjucks`，`mime`，`mz`，`koa-compress`，`sequelize`，`mysql`，`koa-session2`，`log4js`，`moment`。

<b>三 工程目录的主要结构：</b></br>
|-zshop</br>
&nbsp;&nbsp;&nbsp;|-controllers       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//controller</br>
&nbsp;&nbsp;&nbsp;|-html_template     &nbsp;&nbsp;//如果你只需要本项目的那些静态的html文件等</br>
&nbsp;&nbsp;&nbsp;|-middleware        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//本项目的koa2的一些middleware</br>
&nbsp;&nbsp;&nbsp;|-models            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//数据库实体</br>
&nbsp;&nbsp;&nbsp;|-service           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//service</br>
&nbsp;&nbsp;&nbsp;|-static            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//静态文件目录，包括图片，js，css等，这部分可以部署在nginx</br>
&nbsp;&nbsp;&nbsp;|-utils             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//工具函数目录</br>
&nbsp;&nbsp;&nbsp;|-views             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//模板页面文件</br>
&nbsp;&nbsp;&nbsp;|-app.js            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//程序主入口文件</br>
&nbsp;&nbsp;&nbsp;|-init-db.js        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//执行这个可以初始化数据库表和表数据，谨慎执行</br>
&nbsp;&nbsp;&nbsp;|-init-sql.sql      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//init-db.js执行的sql文件</br>
&nbsp;&nbsp;&nbsp;|-LICENSE           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//MIT协议，拿走不谢</br>
&nbsp;&nbsp;&nbsp;|-package.json      &nbsp;&nbsp;&nbsp;//依赖的库
  
<b>四 一些截图：</b></br>

![image](https://github.com/halloffamezwx/zshop/raw/master/html_template/screenshot/1.jpg)
![image](https://github.com/halloffamezwx/zshop/raw/master/html_template/screenshot/2.jpg)
![image](https://github.com/halloffamezwx/zshop/raw/master/html_template/screenshot/3.jpg)
![image](https://github.com/halloffamezwx/zshop/raw/master/html_template/screenshot/4.jpg)
![image](https://github.com/halloffamezwx/zshop/raw/master/html_template/screenshot/5.jpg)
![image](https://github.com/halloffamezwx/zshop/raw/master/html_template/screenshot/6.jpg)
![image](https://github.com/halloffamezwx/zshop/raw/master/html_template/screenshot/8.jpg)
![image](https://github.com/halloffamezwx/zshop/raw/master/html_template/screenshot/9.jpg)

<b>五 如果你觉得对你有所启发，star一下或者扫码请我喝杯咖啡，金额任意。</b></br>

![image](https://github.com/halloffamezwx/zshop/raw/master/html_template/screenshot/7.png)

<b>六 我的博客：</b><http://zhuwx.iteye.com/>。