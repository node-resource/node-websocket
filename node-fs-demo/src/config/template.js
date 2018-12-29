var filters = require('../utils/filter');
module.exports = (function(path, option){
  var nunjucks = require('nunjucks');
  var defaultConfig = {
    autoescape: true,
    noCache: false,
    watch: false,
    throwOnUndefined: false
  };
  var config = Object.assign({},defaultConfig,option);
  var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(path, {
    noCache: config.noCache,
    watch: config.watch
  }), {
    autoescape: config.autoescape,
    throwOnUndefined: config.throwOnUndefined
  })
  // 定义过滤器
  if (config.filters) {
    for (var filter in config.filters) {
      env.addFilter(filter, config.filters[filter]);
    }
  }
  return env
})('src/views',{
  watch: true,
  filters: filters
})
