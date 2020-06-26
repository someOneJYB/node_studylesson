### nodeJS
- 是一个平台提供API调用c++的库进行交互，技术包含了 v8引擎支持js在后端运行读取数据库和文件读取和libuv支持异步io，
- 文件和网络阶段时不等人所以优先级是更高的，node事件队列大部分时间在 polling 轮询阶段。
- 浏览器事件队列只有宏任务和微任务
- 访问量大处理的适用于 node 处理高并发，但不适用于复杂计算
node 事件驱动、非阻塞（异步） 轻量高效
node开发场景：
- node 作为中间层，作为视图的处理返回视图向后端请求数据，后端仅仅用于数据的处理。
require导入不写文件后缀默认是js
nodeJS 的事件循环是一个一直循环的在这个循环中一直查看任务的优先级
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
1、timers 主要是定时器的逻辑setTimeout setInterval 逻辑中的回调函数，
2、io处理的逻辑主要是使用的是网络请求文件读写操作，这些是不可以等待的做了就必须去做
3、idle prepare 在 node 阶段执行
4、poll 在 node 循环中大部分时间处于 polling 阶段，在任务空闲的时候停在 polling 阶段
5、在 polling 结束之后一般都会在执行 check 执行 setImmediate 的回调函数
6、close callbacks会执行 socket.close 方法

### timer 执行阶段介绍
一个timers指定一个下限时间而不是准确时间，在达到这个下限时间后执行回调。在指定时间过后，timers会尽可能早地执行回调，但系统调度或者其它回调的执行可能会延迟它们。
polling阶段
注意：技术上来说，poll 阶段控制 timers 什么时候执行。

注意：这个下限时间有个范围：[1, 2147483647]，如果设定的时间不在这个范围，将被设置为1。

I/O callbacks阶段
这个阶段执行一些系统操作的回调。比如TCP错误，如一个TCP socket在想要连接时收到ECONNREFUSED,
类unix系统会等待以报告错误，这就会放到 I/O callbacks 阶段的队列执行.
名字会让人误解为执行I/O回调处理程序, 实际上I/O回调会由poll阶段处理.比如 fs.readFile 的回调是在 poll 阶段执行的，当其回调执行完毕之后，poll队列为空，而setTimeout入了timers的队列，此时有代码 setImmediate()，于是事件循环先进入check阶段执行回调，之后在下一个事件循环再在timers阶段中执行回调。
                                       
poll阶段
poll 阶段有两个主要功能：
（1）执行下限时间已经达到的timers的回调，
（2）然后处理 poll 队列里的事件。
当event loop进入 poll 阶段，并且 没有设定的 timers（there are no timers scheduled），会发生下面两件事之一：

如果 poll 队列不空，event loop会遍历队列并同步执行回调，直到队列清空或执行的回调数到达系统上限；


如果 poll 队列为空，则发生以下两件事之一：

如果代码已经被setImmediate()设定了回调, event loop将结束 poll 阶段进入 check 阶段来执行 check 队列（里面的回调 callback）。
如果代码没有被setImmediate()设定回调，event loop将阻塞在该阶段等待回调被加入 poll 队列，并立即执行。

但是，当event loop进入 poll 阶段，并且 有设定的timers，一旦 poll 队列为空（poll 阶段空闲状态）：
event loop将检查timers,如果有1个或多个timers的下限时间已经到达，event loop将绕回 timers 阶段，并执行 timer 队列。


check阶段 这个阶段允许在 poll 阶段结束后立即执行回调。如果 poll 阶段空闲，并且有被setImmediate()设定的回调，event loop会转到 check 阶段而不是继续等待。

close callbacks 阶段 如果一个 socket 或 handle 被突然关掉（比如 socket.destroy()），close事件将在这个阶段被触发，否则将通过process.nextTick()触发
##### 模拟 node 的 event-loop
```js
while(true) {
    timers();
    io();
    idle();
    polling();
    check();
    closeCb();
}
```
我们可以把它们理解成一个微任务。也就是说，它其实不属于事件循环的一部分。 那么他们是在什么时候执行呢？ 不管在什么地方调用，他们都会在其所处的事件循环最后，事件循环进入下一个循环的阶段前执行。

node 只有执行 js 是单进程，但是 node 是多进程的。

### node 多进程处理
