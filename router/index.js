var Router = require('koa-router');

var home = require('./home');
var api  = require('./api');

var router = new Router();

var middlewares = {
  home,
  api
}

for(let key in middlewares){
  let controllers = middlewares[key];
  controllers.forEach( route => {
    router[route.method](route.url, route.middleware)
  })
}
// 通配页面 404
router.all('/*', async (ctx, next) => {
  ctx.response.status = 404;
  ctx.response.body = ctx.render('404.html');
});

module.exports = (app) => {
  app.use(router.routes(), router.allowedMethods())
}
