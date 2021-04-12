/*
 * app.js 入口模块
 * 职责：
 *      创建服务
 *      做一些服务相关配置
 *        模板引擎
 *        body-parser 解析表单 post 请求体
 *        提供静态资源服务
 *      挂载路由
 *      监听端口启动服务
 */
 
// 使用 express 实现 添加 个人信息 动态效果
var express = require('express');
var bodyParser = require('body-parser');
var router = require('./router');

var app = express();

//提供静态资源服务
app.use('/public/', express.static('./public/'));
app.engine('html', require('express-art-template'));

// 注意：配置模板引擎和 body-parser 一定要在 app.use(router) 挂载路由之前 这个和中间件的执行顺序有关
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}));
// parse application/json
app.use(bodyParser.json());

// router(app); 原生用法
//express用法 把路由容器挂载到 app 服务中
app.use(router);

app.listen(3000, function(){
    console.log('server is running');
})
