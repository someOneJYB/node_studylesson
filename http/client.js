// client.js
const client = require('http')

let options = {
    port: 3003
}
// 创建http请求  连接成功后，接收到后台服务器返回的响应，回调函数就会被调用一次。
const req = client.request(options, function(res){
    console.log('HTTP headers:', res.headers)

    // 监听请求的返回数据
    res.on('data', function(chunk){
        console.log('Body :', chunk.toString())
    })
    res.on('end', () => {
        console.log('响应中已无数据。');
    });

})
// 真正的发送请求
req.end();
