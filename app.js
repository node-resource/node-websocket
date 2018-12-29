const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');// 对于post请求，把信息挂载到request.body上
const _static = require('koa-static'); // 设置静态目录
const json = require('koa-json'); //  返回数据为json
const onerror = require('koa-onerror');// 优化错误处理信息
const log4js = require('log4js');// 日志管理器  也可以用koa-logger，在控制台输出信息
const ws = require('./ws');// 引入websocket


const template = require('./config/template'); // 加载模版引擎编译器
const logConfig = require('./config/log4');// 日志配置
const router = require('./router'); // 加载路由控制器中间件
// const model = require('./model'); //引入数据关系模型

const app = new Koa();

// config  static files dir  提供静态资源访问的中间件需要放在路由中间件的前面使用
app.use(_static(path.resolve(__dirname, "./public")));
app.use(json());

// log request URL:
app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}  ...`);
  let start = new Date().getTime();
  let execTime;
  await next();
  execTime = new Date().getTime() - start;
  ctx.response.set('X-Response-Time', `${execTime}ms`);
});

// parse request body:
app.use(bodyParser());

// add nunjucks as view:
app.use(template);

ws(app)

// add controller router:
router(app)

// 错误处理器
onerror(app)

// 日志管理器
log4js.configure(logConfig);



// app.listen(80,() => {
//   console.log('server is running at http://localhost:80')
// })

