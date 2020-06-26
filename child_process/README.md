### child_process
可以开启多个子进程，在多个子进程之间可以共享内存空间，可以通过子进程的互相通信来实现信息的交换。

### spawn
command 必须指定的参数，指定需要执行的命令
args 数组，存放了所有运行该命令需要的参数 
options 参数为一个对象，用于指定开启子进程时使用的选项
```js
const { spawn } = require('child_process')
const path = require('path')

let child1 = spawn('node', ['test1.js', 'yanyongchao'], {
    stdio: ['pipe', 'pipe', 'pipe'], // 三个元素数组 stdio是一个数组，用来设置标准输入，标准输出，错误输出
    cwd: __dirname, //子进程工作目录
    env: process.env, //环境变量
    detached: true // 如果为true，当父进程不存在时也可以独立存在
})

```
pipe：父进程和子进程之间建立一个管道
- process.argv 获取命令行中的参数
- process.env 获取当前的命令环境
- child_process 构建子进程
