var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');//http 请求日志记录中间件
var history = require('connect-history-api-fallback');

//引入路由模块
var authRouter = require('./routes/auth');//认证模块
var customerRouter = require('./routes/customer');//用户模块


var app = express();

// 安装模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));//开发环境将日志打印到控制台
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(history());//使用connect-history-api-fallback解决单页面访问问题
app.use(express.static(path.join(__dirname, 'dist')));//静态资源



//允许跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-type', 'application/json;charset=utf-8')
  next()
})

//加载路由模块
app.use('/auth', authRouter);
app.use('/customer', customerRouter);



// 捕获404并转发到错误错误控制器
app.use(function (req, res, next) {
  next(createError(404));
});

// 错误控制器
app.use(function (err, req, res, next) {
  // 设置局部变量，只提供开发中的错误set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 渲染错误页面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
