var test = require('tape');
var Tap = require('..');
var thr = require('through2');

test('Tap at the beginning', function (t) {
    t.plan(6);
    var tap = Tap();
    var chunks = [];
    var chunk1 = { id: 1 };
    var chunk2 = { id: 2 };
    var chunk3 = { id: 3 };
    var s1 = thr.obj();
    var s2 = thr.obj(function (c, e, n) {
        chunks.push(c);
        n();
    }, function () {
        t.same(chunks, [chunk1, chunk2, chunk3], 'eventually all chunks should be received');
    });
    tap.pipe(s1).pipe(s2);
    var first = tap;
    first.write(chunk1);
    soon(20)
        .then(function () {
            t.same(chunks, []);
            tap.turnOn();
            return soon(20);
        })
        .then(function () {
            t.same(chunks, [chunk1]);
            first.write(chunk2);
            return soon(20);
        })
        .then(function () {
            t.same(chunks, [chunk1, chunk2]);
            tap.turnOff();
            first.end(chunk3);
            return soon(20);
        })
        .then(function () {
            t.same(chunks, [chunk1, chunk2]);
            tap.turnOn();
            t.same(chunks, [chunk1, chunk2, chunk3]);
        })
        ;
});

test('Tap in the middle', function (t) {
    t.plan(6);
    var tap = Tap();
    var chunks = [];
    var chunk1 = { id: 1 };
    var chunk2 = { id: 2 };
    var chunk3 = { id: 3 };
    var s1 = thr.obj();
    var s2 = thr.obj(function (c, e, n) {
        chunks.push(c);
        n();
    }, function () {
        t.same(chunks, [chunk1, chunk2, chunk3], 'eventually all chunks should be received');
    });
    s1.pipe(tap).pipe(s2);
    var first = s1;
    first.write(chunk1);
    soon(20)
        .then(function () {
            t.same(chunks, []);
            tap.turnOn();
            return soon(20);
        })
        .then(function () {
            t.same(chunks, [chunk1]);
            first.write(chunk2);
            return soon(20);
        })
        .then(function () {
            t.same(chunks, [chunk1, chunk2]);
            tap.turnOff();
            first.end(chunk3);
            return soon(20);
        })
        .then(function () {
            t.same(chunks, [chunk1, chunk2]);
            tap.turnOn();
            t.same(chunks, [chunk1, chunk2, chunk3]);
        })
        ;
});

function soon(delay) {
    return new Promise(function (resolve) {
        setTimeout(resolve, delay);
    });
}
