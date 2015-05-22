var Tap = require('..');
var thr = require('through2');

var s1 = thr();
var s2 = thr();
var tap = Tap();

s1.pipe(tap).pipe(s2).pipe(process.stdout);

console.log('Writing into the pipeline');
[1,2,3,4,5].map(String).forEach(s1.write, s1);
s1.end();
console.log('Writing end');
console.log('turn tap on');
tap.turnOn();
