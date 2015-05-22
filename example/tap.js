var Tap = require('..');
var thr = require('through2');

var s1 = thr();
var s2 = thr();
var tap = Tap();

s1.pipe(tap).pipe(s2).pipe(process.stdout);

process.stdout.write('Writing into the pipeline\n');
[1,2,3,4,5].map(String).forEach(s1.write, s1);
s1.end();
process.stdout.write('Writing end\n');
setTimeout(function() {
    process.stdout.write('turn tap on\n');
    tap.turnOn();
}, 50);
