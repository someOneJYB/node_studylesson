/*
* 支持的功能通过 url 获取静态资源并且读物文件支持使用 stream 进行读取，然后防止程序意外退出重启程序在子进程中。
* */
const http = require('http');
const fs = require('fs');

var MIME = {
    '.css': 'text/css',
    '.js': 'application/javascript'
};
function main() {
    var config = JSON.parse(fs.readFileSync('./setting.json', 'utf-8')),
        port = config.port || 80;
        pathnames = config.pathnames ||  './assets/index.js'
    let d = http.createServer(function (request, response) {
        validateFiles(pathnames, function (err, pathnames) {
            if (err) {
                response.writeHead(404);
                response.end(err.message);
            } else {
                response.writeHead(200, {
                    'Content-Type': 'application/javascript'
                });
                outputFiles(pathnames, response);
            }
        });
    });
    d.listen(port, function() {
        console.log(`the server is started at port ${port}`)
    })
}

function outputFiles(pathnames, writer) {
    (function next(i, len) {
        if (i <= len) {
            var reader = fs.createReadStream(pathnames);
            // 读之后写到 response 也是一个可写流
            reader.pipe(writer, { end: false });
            reader.on('end', function() {
                next(i + 1, len);
            });
        } else {
            writer.end();
        }
    }(0, 0));
}

function validateFiles(pathnames, callback) {
    (function next(i, len) {
        if (i <= len) {
            fs.stat(pathnames, function (err, stats) {
                if (err) {
                    callback(err);
                } else if (!stats.isFile()) {
                    callback(new Error());
                } else {
                    next(i + 1, len);
                }
            });
        } else {
            callback(null, pathnames);
        }
    }(0, 0));
}
main()
