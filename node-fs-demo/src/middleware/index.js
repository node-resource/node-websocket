var Router = require('koa-router');

var login = require('./login');
var hello = require('./hello');
var router = new Router();
var middlewares = {
  login,
  hello
}
Object.keys(middlewares).forEach(key => {
  var controllers = middlewares[key];
  controllers.forEach( route => {
    router[route.method](route.url, route.middleware)
  })
})

module.exports = router.routes()


