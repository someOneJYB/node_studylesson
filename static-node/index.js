/*
* 支持的功能通过 url 获取静态资源并且读物文件支持使用 stream 进行读取，然后防止程序意外退出重启程序在子进程中。
* */
const http = require('http');
function createServer(port)  {
    http.createServer(function(res, req) {
        
    }).listen(port)
}
