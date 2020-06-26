var cp = require('child_process');

var worker;

function spawn(server, config) {
    worker = cp.spawn('node', ['./index.js']);
    worker.on('exit', function (code) {
        if (code !== 0) {
            spawn(server, config);
        }
    });
}
spawn()
