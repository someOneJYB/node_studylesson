### 流
流是一组有序的，有起点和终点的字节数据传输手段
它不关心文件的整体内容，只关注是否从文件中读到了数据，以及读到数据之后的处理
流是一个抽象接口，被 Node 中的很多对象所实现。比如HTTP 服务器request和response对象都是流。
Readable - 可读的流 (例如 fs.createReadStream())。
Writable - 可写的流 (例如 fs.createWriteStream()).
Duplex - 可读写的流(双工流) (例如 net.Socket).
Transform - 转换流 在读写过程中可以修改和变换数据的 Duplex 流 (例如 zlib.createDeflate())
如果读取一个文件，使用fs.readFileSync同步读取，程序会被阻塞，然后所有数据被写到内存中。使用fs.readFile读取，程序不会阻塞，但是所有数据依旧会一次性全被写到内存，然后再让消费者去读取。如果文件很大，内存使用便会成为问题。
这种情况下流就比较有优势。流相比一次性写到内存中，它会先写到到一个缓冲区，然后再由消费者去读取，不用将整个文件写进内存，节省了内存空间。
- 直接读文件
读文件 内存 写文件
- 使用流
读文件 流  内存  流  写文件
在Node中，流具有以下四种类型：

Readable：可读流
Writeable：可写流
Duplex：双工流（可读可写）
Transform：转换流（操作被写入的数据，输出转换结果）
而由于Stream对象是EventEmitter的实例，所以它常用的事件有：

data 当有数据可读时触发
end 当没有更多的数据时触发
error 写入/读取过程中报错时触发
finish 所有数据已被写入底层系统时触发


stream的应用场景主要就是处理IO操作，而http请求和文件操作都属于IO操作。
这里再提一下stream的本质——由于一次性IO操作过大，硬件开销太多，影响软件运行效率，因此将IO分批分段进行操作，让数据像水管一样流动起来，直到流动完成，也就是操作完成。
网络中读取和返回，不必全部返回 一点一点返回。

Duplex Stream 双向的，既可读，又可写。 Duplex streams同时实现了 Readable和Writable 接口

### stream有什么弊端

用 rs.pipe(ws) 的方式来写文件并不是把 rs 的内容 append 到 ws 后面，而是直接用 rs 的内容覆盖 ws 原有的内容
已结束/关闭的流不能重复使用，必须重新创建数据流
pipe 方法返回的是目标数据流，如 a.pipe(b) 返回的是 b，因此监听事件的时候请注意你监听的对象是否正确
如果你要监听多个数据流，同时你又使用了 pipe 方法来串联数据流的话，你就要写成：
代码实例：
```js
 data
        .on('end', function() {
            console.log('data end');
        })
        .pipe(a)
        .on('end', function() {
            console.log('a end');
        })
        .pipe(b)
        .on('end', function() {
            console.log('b end');
        });
```
