### 从头来一遍 webpack 观看 YouTube 中获得的启发，以及在代码中增加了处理缓存加载模块和处理循环引用的处理，但是仅仅处理 es6 的 import 和 export 这两个模块
- 使用 babel 解析过程中针对 import 的节点的值作为依赖的收集，并且收集es6转化成 cjs 规范之后的代码。作为文件的依赖填充到文件中，设置不同的依赖再遍历依赖，处理依赖形成 require 函数，逐次加载对应模块以及对应的函数模块和里面的依赖
(function(modules){
 无限执行 require 把对应模块加载取出 module.exports
})({
id: [
     function (require, module, exports) {
         代码需要 babel 解析一下
     }, { 文件依赖名: id, ...}
]
})
最后得到的依赖和代码以及 id 通过统一转化成 require 的处理函数处理， 同时调研了 webpack 处理循环依赖，发现和 commonJS 处理循环依赖是一致的，就是不再输出后半部分仅仅输出缓存的部分，这次的循环依赖和webpack处理时保持一致的
webpack-build中的代码来自于webpack打包example中的代码
