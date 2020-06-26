setTimeout(() => {
    console.log('timeout0');
    new Promise((resolve, reject) => { resolve('resolved') }).then(res => console.log(res));
    new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve('timeout resolved')
        })
    }).then(res => console.log(res));
    process.nextTick(() => {
        console.log('nextTick1');
        process.nextTick(() => {
            console.log('nextTick2');
        });
    });
    process.nextTick(() => {
        console.log('nextTick3');
    });
    console.log('sync');
    setTimeout(() => {
        console.log('timeout2');
    }, 0);
}, 0);
/*
*
* timeout0
sync
nextTick1
nextTick3
nextTick2
resolved
timeout resolved
timeout2
进入定时器的逻辑：执行同步任务，执行结束后，微任务 nextTick 和 promise执行，在下一个事件循环的timers阶段，执行setTimeout回调输出微任务Promise里面的setTimeout执行setTimeout回调
*
*
* */
setImmediate(function(){
    console.log("setImmediate");
    setImmediate(function(){
        console.log("嵌套setImmediate");
    });
    process.nextTick(function(){
        console.log("nextTick");
    })
});
/*
* 事件循环check阶段执行回调函数输出setImmediate，之后输出nextTick。嵌套的setImmediate在下一个事件循环的check阶段执行回调输出嵌套的setImmediate。
*
* setImmediate check
nextTick check 微任务
timeout0 timer
sync timer
nextTick1 timer micro
nextTick3 timer micro
nextTick2 timer micro
resolved timer micro
嵌套setImmediate checking
timeout resolved 下一个 timer
timeout2 下一个 timer
* */
