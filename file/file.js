const fs = require('fs');


function deleteSync(path) {
    try {
        // 同步删除文件
        fs.unlinkSync(path)
    } catch(err) {
        console.log(err)
    } finally {
        console.log('删除文件结束')
    }
}
// 删除文件
function deleteSync(path) {
    fs.unlink(path, err => {
        if(err) {
            console.log(err)
        } else {
            console.log('delete success')
        }
    })
}

function readSync(path)  {
    try {
        return fs.readFileSync(path, { encoding: 'utf-8' });
    } catch(err) {
        console.log(err)
    }
}


function read(path, cb)  {
    fs.readFile(path, 'utf-8', (err, data) => {
            if(err) return '';
            cb(data);
    });
}

function writeSync(path, content)  {
    try {
        return fs.writeFileSync(path, content);
    } catch(err) {
        console.log(err)
    }
}


function write(path, content, cb)  {
    fs.writeFile(path, content, (err) => {
        if(err) return cb(false);
        cb(true)
    });
}

function appendToFile(path, content, cb) {
    fs.appendFile(path, content, (err, data)=>{
        if(err) return cb(false, err);
        cb(true, data)
    })
}

function appendToFileSync(path, content) {
    try {
        fs.appendFileSync(path, content);
    } catch(err) {
        console.log(err)
    }
}

function copySync(src, dest) {
    try {
        let data = readSync(src);
        if(data) {
          writeSync(dest, data);
          console.log('复制成功');
        }
    } catch(err) {
        console.log('复制失败')
    }
}


function copy(src, dest) {
    read(src, (data)=>writeSync(dest, data))
}

function openFile(path, cb) {
    fs.open(path, 'r', (err, fd) => {
        if(err) {
            console.log('打开文件异常');
        } else {
            cb(fd)
        }
    });
}

function closeFile(fd)  {
    fs.close(fd, err => {
        if(err) {
            console.log('打开失败')
        } else {
            console.log("关闭成功");
        }
    });
}

function isExist(path) {
    try {
        fs.accessSync(path);
        console.log("可读可写");
    } catch (err) {
        console.error("不可访问");
    }
}

function isExistAsync(path) {
    fs.access(path, err => {
        if (err) {
            console.error("不可访问");
        } else {
            console.log("可读可写");
        }
    });
}
function promisify(fn) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn.call(null, ...args, err => err ? reject() : resolve());
        });
    }
}
// 删除目录
function deleteDir(dir) {
    try {
        fs.rmdirSync(dir);
        console.log("删除失败")
    } catch (e) {
        console.log("删除失败")
    }

}
// 判断文件读取权限
function accessFile(path) {
    try {
        fs.accessSync(path);
        console.log("可读可写");
    } catch (err) {
        console.error("不可访问");
    }
}
// 递归创建文件夹
async function mkPathSync(dirPath) {
    // path.sep 文件路径分隔符（mac 与 window 不同）
    // 转变成数组，如 ['a', 'b', 'c']
    const access = promisify(fs.accessSync);
    const mkdirSync = promisify(fs.mkdirSync)
    const path = dirPath.split('/');
    let current = '';
    let splitLine = ''
    for(let i = 0; i <= path.length; i++) {
        if(i !== 0) {
            splitLine = '/'
        }
        // 重新拼接成 a a/b a/b/c
        current = current + splitLine + path[i];

        // accessSync 路径不存在则抛出错误在 catch 中创建文件夹
        try {
            await access(current);
        } catch(e) {
            await mkdirSync(current);
        }
    }
}
