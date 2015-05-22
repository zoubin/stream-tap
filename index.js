var Transform = require('readable-stream').Transform;
var util = require('util');
var debug = util.debuglog('tap');
var inherits = util.inherits;
inherits(Tap, Transform);

module.exports = Tap;

function Tap() {
    if (!(this instanceof Tap)) {
        return new Tap();
    }
    Transform.call(this, { objectMode: true });
    this._tapState = {
        flowing: false,
        finished: false,
        ended: false,
        buffer: []
    };
};

Tap.prototype._transform = function(chunk, enc, cb) {
    var state = this._tapState;
    debug('_transform', state, chunk);
    if (state.flowing) {
        return cb(null, chunk);
    }
    state.buffer.push(chunk);
    cb();
};

Tap.prototype._flush = function() {
    var state = this._tapState;
    debug('_flush', state);
    state.finished = true;
    if (state.flowing) {
        flush(this);
    }
};

Tap.prototype.turnOn = function() {
    var state = this._tapState;
    debug('turnOn', state);
    if (!state.flowing) {
        state.flowing = true;
        flush(this);
    }
};

Tap.prototype.turnOff = function() {
    var state = this._tapState;
    debug('turnOff', state);
    state.flowing = false;
};

function flush(stream) {
    var state = stream._tapState;
    debug('flush', state);
    if (state.ended) return;
    state.buffer.forEach(stream.push, stream);
    state.buffer.length = 0;
    if (state.finished) {
        debug('flush done');
        stream.push(null);
        state.ended = true;
    }
}
