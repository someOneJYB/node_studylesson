const readline = require('readline')

const rl = readline.createInterface({
    //  监听的可读流
    input: process.stdin,
    //  逐行读取（Readline）数据要写入的可写流
    output: process.stdout
})

rl.question('你如何看待2020年 ？', answer => {
    console.log(`感谢您的意见：${answer}`)
    rl.close()
})
