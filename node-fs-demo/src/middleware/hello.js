var hello = async function(ctx, next){
  ctx.body = env.render('hello.html', { name: 'node~' });
}

module.exports = [
  {
    method: 'get',
    url: '/hello',
    middleware:hello
  }
]