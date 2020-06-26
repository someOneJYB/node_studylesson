const path = require('path')
// 执行 shell 命令
const { spawn } = require('child_process')

// const ls = spawn('ls', ['-lh', '../file']);
//
// ls.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
// });
//
// ls.stderr.on('data', (data) => {
//     console.log(`stderr: ${data}`);
// });
//
// ls.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
// });
console.log('1. start spawn');
const child = spawn('node', ['./child1.js']);

console.log('2. start stdout on data');
child.stdout.on('data', data => {
    // 子进程 console.log 也会触发，使用随机数区分
    console.log(`in parent: data - ${data}`);
});

console.log('3. start child on close');
child.on('close', code => {
    // 子进程结束才触发 close 事件
    console.log(`12. child on close: ${code}`);
});

console.log('4. child stdin write');
child.stdin.write('[x]');
console.log('5. child stdin end write');
/*
* spawn后，子进程就启动了，只不过启动是异步的，
落后于主进程的 child.stdin.write('[x]');
*
* */
