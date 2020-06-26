const fs =   require('fs');

// 创建可读流
// const rs = fs.createReadStream('./input.txt')
// rs.setEncoding('UTF8')
// // 每次读取 highWaterMark 个字节，触发一次 data 事件，直到读取完成，回调的参数为每次读取的 Buffer；
// rs.on('data', function (data) {
//     console.log(data);
// });
//
// rs.on('end', function () {
//     console.log('读取完成');
// });
//
// rs.on('error', function (err) {
//     console.log(err);
// });
// // 写文件
// const writeable = fs.createWriteStream('./output.txt')
// writeable.write('Hello, world', 'UTF8')
// writeable.end()
//
// writeable.on('finish', () => console.log('写入完成'))
// writeable.on('error', err => console.log(err.stack))
// // 管道流
// // 管道是一种输出流到输入流的机制，用于从一个流中获取数据并传递到另一个流中。它就像两个水桶之间连接的管子，沿着管子水可以从上游流入下游。这种机制在复制大文件时格外有用（避免了一次性将大文件读入缓存造成爆内存）
//
// const readablePipe = fs.createReadStream('./input.txt')
// const writeablePipe = fs.createWriteStream('./output.txt')
// readablePipe.pipe(writeablePipe)
//
// // 二、自定义流
// // 我们可以通过实现Stream的抽象接口，来自定义流。Stream提供了以下四种类型的流，为：
//
// const Stream = require('stream')
// const Readable = Stream.Readable
// const Writeable = Stream.Writeable
// const Duplex = Stream.Duplex
// const Transform = Stream.Transform

let rsR = fs.createReadStream("output.txt", {
    start: 0,
    end: 9,
    highWaterMark: 2
});

let bufArr = [];

rsR.on("data", data => {
    bufArr.push(data);
    rsR.pause(); // 暂停读取
    console.log("暂停", new Date());

    setTimeout(() => {
        rsR.resume(); // 恢复读取
    }, 1000)
});

rsR.on("end", () => {
    console.log(Buffer.concat(bufArr).toString());
});
 // 使用 pipe
// 创建可读流和可写流
let rs1 = fs.createReadStream("input.txt", {
    highWaterMark: 3
});
let ws = fs.createWriteStream("output.txt", {
    highWaterMark: 2
});

// 将 1.txt 的内容通过流写入 2.txt 中，highWaterMark 自由的控制写入的 “节奏”，不用担心内存的消耗， pipe 用的比较多
rs1.pipe(ws);
