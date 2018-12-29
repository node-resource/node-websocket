const isProduction = process.env.NODE_ENV === 'production';
const filters = require('../utils/filter');

module.exports = ((path, option) => {
  const nunjucks = require('nunjucks');
  const _env = (() => {
    const defaultConfig = {
      autoescape: true,
      noCache: false,
      watch: false,
      throwOnUndefined: false
    };
    const config = Object.assign({},defaultConfig,option);
    const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(path, {
      noCache: config.noCache,
      watch: config.watch
    }), {
      autoescape: config.autoescape,
      throwOnUndefined: config.throwOnUndefined
    })
    // 定义过滤器
    if (config.filters) {
      for (let filter in config.filters) {
        env.addFilter(filter, config.filters[filter]);
      }
    }
    return env
  })()

  return async (ctx, next) => {
    let path = ctx.request.path;
    if(path.startsWith('/api')){ // 请求api接口 REST
      ctx.rest = (data) => {
        ctx.response.type = 'application/json';
        ctx.response.body = data;
      }
    }else if(path.startsWith('/static')){ // 请求static资源
      ctx.static = (data) => {
        ctx.response.type = 'text/plain';
        ctx.response.body = data;
      };
    }else { // 请求MVC
      ctx.render = (view, model) => {
        ctx.response.type = 'text/html';
        return _env.render(view, Object.assign({}, ctx.state || {}, model || {}));
      };
    }
    await next();
  }

})('view', {
  noCache: !isProduction,
  watch: !isProduction,
  filters: filters
})

