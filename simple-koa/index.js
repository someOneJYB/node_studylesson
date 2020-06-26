const http = require('http');

// interface Context {
//     response: object;
//     request:  object;
// }
function isGenerator(val) {
    return 'GeneratorFunction' === (val && val.constructor ? val.constructor.name : '')
}
function setGenerator(fn)  {
    return function *g(val) {
        yield (typeof fn !=== function ? fn : fn(val))
    }
}
function compose(fns) {
//   处理 request 和 response 上面的东西，最后返回到处理 response 的函数。
    return function(ctx) {
        let index = 0;
        return next(0)
        function next(i) {
            let fn = fns[i];
            if(i === fn.length) return Promise.resolve();
            if(i < index) return Promise.reject('调用多次next函数')
            index = i;
            return Promise.resolve(fn(ctx, next(i+1)))
        }
    }
}
// 防止在同一个中间件调用两次 next 函数
class Koa {
    constructor() {
        this.context = {};
        this.middleWareFns = [];
    }
    listen(...args) {
        const app = http.createServer(this.dealContextAndMiddleFn());
        app.listen(...args)
    }
    dealContextAndMiddleFn(req, res) {
        this.context.request = req;
        this.context.response = res;
        let allFns = compose(this.middleWareFns);
        allFns(this.context).then(val=>this.sendResponse()).catch(val=>this.sendResponseError())
    }
    sendResponse() {
        this.context.response.end(this.context.response.body)
    }
    sendResponseError() {
        this.context.response.end(500)
    }
    use(fn) {
        if(!isGenerator(fn)) {
            fn = setGenerator(fn);
        }
        this.middleWareFns.push(fn);
    }

}
