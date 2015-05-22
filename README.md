# stream-tap
To control (pause or resume) a node stream pipeline. It returns a transform which is supposed to be included into a stream pipeline.

## Usage

```javascript
var Tap = require('stream-tap');
var tap = Tap();
```

### tap = Tap()
Return the tap transform.

### tap.turnOn()
`tap` will push no data, until `tap.turnOn()` is called.

### tap.turnOff()
Make `tap` collect data, and wait for `tap.turnOn` to flush.

## Example

```javascript
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
```

output:

```
⌘ node example/tap.js
Writing into the pipeline
Writing end
turn tap on
12345
```
