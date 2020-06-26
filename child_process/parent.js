// ipc 通信
var child_process = require('child_process');
// fork会建立一个永久的channel，以供进程间通信。
var child = child_process.fork('./child.js');

child.on('message', function(m){
    console.log('message from child: ' + JSON.stringify(m));
    child.disconnect();
});
const t = 70;
setTimeout(function(){
    console.log('p: 3 in %s', t);
}, t);
child.send({from: 'parent'});
// 守护进程工作原理
function spawn(mainModule) {
    var worker = child_process.spawn('node', [ mainModule ]);
    //工作进程非正常退出时，守护进程立即重启工作进程。
    worker.on('exit', function (code) {
        if (code !== 0) {
            spawn(mainModule);
        }
    });
}

spawn('child.js');
