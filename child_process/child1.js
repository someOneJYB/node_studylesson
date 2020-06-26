console.log('6. in child - start process stdin on data');

process.stdin.on('data', data => {
    // 在子进程中的 console.log 是可以把数据传递给父进程的
    console.log(`7. child stdin on data: ${data}`);

    console.log('8. child process stdout write');

    // 与 console.log 效果一样，只是不带末尾换行符
    // process.stdout.write('[y]');
    console.log('[y]')
    console.log('9. child process stdout end write');

    console.log('10. child process exit');
    process.exit(1);
    console.log('11. child process end exit');  // 不触发
});
