(function(modules) {
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
    })({0: [
      function (require, module, exports) {
        "use strict";

var _message = require("./message.js");

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_message2.default);
      },
      {"./message.js":1},
    ],1: [
      function (require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _name = require("./name.js");

var _test = require("./test.js");

console.log(_test.a);
exports.default = "hello " + _name.name + " " + _test.a + "!";
      },
      {"./name.js":2,"./test.js":3},
    ],2: [
      function (require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.name = undefined;

var _another = require("./another.js");

var name = exports.name = 'world' + _another.n;
      },
      {"./another.js":4},
    ],3: [
      function (require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.a = undefined;

var _message = require("./message.js");

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('in test', _message2.default);
var a = exports.a = 90;
      },
      {"./message.js":2},
    ],4: [
      function (require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var n = exports.n = 'world2';
      },
      {},
    ],})