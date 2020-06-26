const fs = require('fs');
const path = require('path')
const process = require('process')
// 解析成 ast
const babylon = require('babylon');
// parse("code", {
//     // 以严格模式解析并允许模块声明
//     sourceType: "module",
//
//     plugins: [
//         // 启用 jsx 和 flow 语法
//         "jsx",
//         "flow"
//     ]
// });
// 解析ast并且通过import节点收集依赖处理 ast 的节点获取依赖
const traverse = require('babel-traverse').default;
// Babel AST转码成 code
const { transformFromAst } = require('babel-core');
//babel.transformFromAst(ast, code, options);
// // => { code, map, ast }
const transformModules = {};
let Id = 0;
function getDependency(filename) {
    let content = fs.readFileSync(filename, 'utf-8');
    console.log(content)
    let ast = babylon.parse(content, {
        sourceType: "module",
    });
    let dependency = [];
    traverse(ast, {
        ImportDeclaration: ({node}) => {
            console.log(node.source.value, 'node.source.value')
            // We push the value that we import into the dependencies array.
            dependency.push(node.source.value);
        },
    });
    const { code } = transformFromAst(ast, null, {
        presets: ['env'],
    });
    const mudule = {
        id: Id++,
        dependency,
        filename,
        code,
    }
    transformModules[filename] = mudule;
    return mudule;
}

function traverseNodeGetDep(entry) {
    const start = getDependency(entry);
    let queue = [];
    queue.push(start);
    for(let i = 0; i < queue.length; i++) {
        const assets = queue[i];
        assets.mapping = {};
        const dirname = process.cwd()
        for(let j = 0; j < assets.dependency.length; j++) {
            let relativePath = assets.dependency[j];
            console.log(relativePath, 'relativePath')
            const absolutePath = path.join(dirname, '/example/'+relativePath);
            if(transformModules[absolutePath]) {
                assets.mapping[relativePath] = transformModules[absolutePath].id + 1;
                continue;
            }
            const child = getDependency(absolutePath);
            assets.mapping[relativePath] = child.id;
            queue.push(child);
        }
    }
    return queue;
}

function setImport(dependency) {
    let result = '';
    dependency.forEach(function(item) {
        result += `${item.id}: [
      function (require, module, exports) {
        ${item.code}
      },
      ${JSON.stringify(item.mapping)},
    ],`;
    });
    return `(function(modules) {
    var installedModules = {};
      function require(id) {
        const [fn, mapping] = modules[id];
        if(installedModules[id]) {
            console.log('重复模块直接使用缓存', id)
            return installedModules[id];
        }
        function getRequire(name) {
            const result = require(mapping[name]);
            installedModules[mapping[name]] = result
            return result;
        }

        const module = { exports : {} };

        fn(getRequire, module, module.exports);

        return module.exports;
      }

      require(0);
    })({${result}})`

}
function getDist(entry) {
    try {
        const content = setImport(traverseNodeGetDep(entry));
        fs.writeFile('./dist/dist.js', content, (err) => {
            if(err) {console.log('写入失败');} else {
                console.log('写入 dist.js 成功')
            }
        })
    } catch(err) {
       console.log('发生异常', err)
    }
}
getDist('./example/entry.js')
