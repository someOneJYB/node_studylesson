const http = require('http')
const url = require('url')

// 创建代理服务
const server = http.createServer(function(req,res){

    console.log('开始请求:', req.url);

    // TODO 可以通过构造 options来请求真正需要的地址
    let options = url.parse(req.url);
    options.headers = req.headers;
    // 用于请求服务器index中的端口3003
    options.port = 3003
    // 创建真实请求
    const proxyReq = http.request(options, function(proxyRes){

        // 监听数据，返回给浏览器
        proxyRes.on('data', function(chunk){
            console.log('返回到代理的数据 :', chunk.toString())
            //给原始请求，准备响应数据
            res.write(chunk, 'binary');
        })

        // 监听代理请求完成
        proxyRes.on('end', function(){
            console.log('代理结束')

            // 响应完成
            res.end();
        });

        // 发送头部信息给浏览器
        res.writeHead(proxyRes.statusCode, proxyRes.headers);

    });

    // 获取从浏览器发送到代理服务器的数据
    req.on('data',function(chunk){
        console.log('请求数据大小：', chunk.length)
        // 发送代理请求
        proxyReq.write(chunk, 'binary');
    })

    // 监听原始请求结束
    req.on('end',function(){
        console.log('原始请求结束')
        // 发送代理请求
        proxyReq.end();
    })
})

// 启动代理服务器
server.listen(3004, function(){
    console.log("代理服务启动端口： 8000 ")
})
