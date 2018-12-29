// 
/**
 * fs 是node常用的内置文件系统模块
 * todo:负责读写文件，并同时捕获文件信息
 * ps:有同步和异步之分。
 *   1. 绝大部分需要在服务器运行期反复执行业务逻辑的代码，必须使用异步代码
 *   2. 服务器启动时如果需要读取配置文件，或者结束时需要写入到状态文件时，可以使用同步代码，因为这些代码只在启动和结束时执行一次，不影响服务器正常运行时的异步执行。
 *  */

 var fs = require('fs');

 /**
	* 借助fs模块，用于读写查看文件信息
	**/
 function FS(opt){
	this.charset = opt.charset === 'buffer' ? null : 'utf-8';
	this.dir = opt.dir;
	this.result = null;
	this.info = null;
 }
 FS.prototype = {
	constructor:FS,
	read: function() {
		fs.readFile(this.dir, this.charset, function(err, data){
			console.log(data)
			this.result = this.charset === 'utf-8' ? data : data.toString('utf-8')
		})
	},
	write: function(data) {
		fs.writeFile(this.dir, data, function(err){
			console.log(err || 'ok')
		})
	},
	_info: function(){
		fs.stat(this.dir, function(err, info){
			if(err){
				console.error(err)
			}else{
				this.info = info;
				console.log(info)
				// 是否是文件:
        console.log('isFile: ' + info.isFile());
        // 是否是目录:
        console.log('isDirectory: ' + info.isDirectory());
        if (info.isFile()) {
            // 文件大小:
            console.log('size: ' + info.size);
            // 创建时间, Date对象:
            console.log('birth time: ' + info.birthtime);
            // 修改时间, Date对象:
            console.log('modified time: ' + info.mtime);
        }
			}
		})
	}
 }

 module.exports = FS