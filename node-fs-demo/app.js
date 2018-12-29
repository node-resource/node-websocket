var Koa = require('koa');
var bodyParser = require('koa-bodyparser'); // 把解析后的参数，绑定到ctx.request.body中

// require('./src/assets/css/common.css');
global.env = require('./src/config/template'); //定义一个渲染模版的全局变量
var routes = require('./src/middleware');

var port = 80;
var app = new Koa();

// 对于任何请求，app将调用该异步函数处理请求：
  // 参数ctx是由koa传入的封装了request和response的变量，我们可以通过它访问request和response
  // ext是koa传入的将要处理的下一个异步函数
app.use(async (ctx, next) => {
  await next();
})

app.use(bodyParser()).use(routes)

app.listen(port)
console.info('app started at port ',port)