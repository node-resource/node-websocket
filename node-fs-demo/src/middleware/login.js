var home = async function(ctx, next){
  var html = '<div>'
               +'<h1>欢迎登录**系统</h1>'
               +'<form action="/login" method="post">'
                 +'<p>Name: <input name="name"></p>'
                 +'<p>Password: <input name="pwd" type="password"></p>'
                 +'<p><input type="submit" value="Submit"></p>'
               +'</form>'
            +'</div>'
  ctx.body = html;
}
var login = async function(ctx, next){
  var name = ctx.request.body.name || "";
  var pwd  = ctx.request.body.pwd || "";
  if(name === 'henyu' && pwd === '123456'){
    ctx.response.body = '<a href="/hello">Go hello</a>'
  }else{
    ctx.response.body = 'login failed !'
  }
}

module.exports = [
  {
    method: 'get',
    url: '/',
    middleware:home
  },{
    method: 'post',
    url: '/login',
    middleware: login
  }
]