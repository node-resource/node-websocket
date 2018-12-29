var fs   = require('fs');
var url  = require('url');
var path = require('path');
var http = require('http');

var port = 80;

// 从命令行参数获取root目录，默认是当前目录
var root = path.resolve(process.argv[2] || ".");
console.log('Root directory is :',root);

// 创建文件服务器
var server = http.createServer(function(request, response){
  // 获得URL的path，类似 /css/bootstrap.css
  var pathname = url.parse(request.url).pathname;
  // 获得对应的本地文件路径，类似 /srv/www/css/bootstrap.css
  var filepath = path.join(root, pathname);
  // 获取文件状态
  // 如果HTTP请求的是目录，则自动在此路径下依次搜索index.html和default.html，若找到，就返回HTML文件的内容
  // 如果找不到，返回404页面
  // 如果找到了具体的文件，返回html内容
  var defaultPage = ['index.html', 'default.html'];
  var fileIdx = 0; // 访问目录文件时，下属文件的索引

  fs.stat(filepath, function(err, stats){
    if(err){
      console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
      get404Page()
    }else if(stats.isFile()){
      get200Page(filepath)
    }else if(stats.isDirectory()){
      console.log('***********************************')
      getDefaultPage()
    }
  })

  /**
   * 访问目录时，自动访问其下的index.html 或者 default.html目录
   **/
  function getDefaultPage() {
    if(fileIdx === defaultPage.length){
      get404Page();return;
    }
    var page = path.join(filepath, defaultPage[fileIdx]);
    fs.stat(page, function(err, stats){
      if(err || !stats.isFile()){
        fileIdx ++;
        getDefaultPage()
      }else{
        get200Page(page)
      }
    })
  }
  /**
   * 找不到目标时，返回404页面
   **/
  function get404Page() {
    // 出错或者文件不存在
    console.log('404:',request.url)
    response.writeHead(404);
    response.end('<h1 style="text-align:center;color:#ff3333;">Not found!</h1>')
  }
  /**
   * 访问正常时，加载对应资源信息
   **/
  function get200Page(page) {
    console.log('200:',request.url);
    response.writeHead(200);
    fs.createReadStream(page).pipe(response)
  }
  
})

server.listen(port)

console.log('your server is running at:http://localhost:'+port)