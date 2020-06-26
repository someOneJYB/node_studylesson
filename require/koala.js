//koala.js
let a2 = '程序员成长指北';

console.log(module.exports); //能打印出结果为：{}
console.log(exports); //能打印出结果为：{}

exports.a = '程序员成长指北哦哦';

exports = '指向其他内存区'; //这里把exports的指向指走
