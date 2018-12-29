/***测试数据 **/
let users = {
  code: 'auth:error_password',
  data:{
    total:3,
    pages:1,
    pageNow:1,
    list:[{'id':'1001','name':'张三'},{'id':'1002','name':'李四'},{'id':'1003','name':'王五'}]
  }
}



let API = {
  users:{
    list: async (ctx, next) => {
      ctx.rest(users)
    }
  }
}

module.exports = API