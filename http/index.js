const http = require('http');
const PORT = 3003;
const router = (req, res) => {
    res.writeHead(200, { 'Content-Type' : 'text/plain'})
    res.write('Hello world')
    res.end()
    // res.end(`this page url = ${req.url}`);
}
const server = http.createServer(router)

server.listen(PORT, function() {
    console.log(`the server is started at port ${PORT}`)
})

server.on('close',function(){
    console.log('服务器关闭');
});

server.on('error',function(){
    if(e.code == 'EADDRINUSE'){
        console.log('端口号已经被占用!');
    }
});

server.on('connection',function(){
    console.log('客户端连接已经建立');
});
// 默认超时时间时2分钟
server.on('timeout',function(){
    console.log('连接已经超时');
});
