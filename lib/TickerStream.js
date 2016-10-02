'use strict';

const Readable = require('stream').Readable;

module.exports = class TickerStream extends Readable {
  constructor(options) {
    options = options || {};
    options.objectMode = true;
    super(options);

    const state = {};

    state.finished = false;
    state.ticks = [];

    state.min = options.min || 100;
    state.max = options.max || 1000;
    if (state.min > state.max) {
      const tmp = state.min;
      state.min = state.max;
      state.max = tmp;
    }

    state.duration = options.duration || 10000;

    if (typeof options.phony === 'function') {
      state.phony = options.phony;
    } else {
      state.phony = () => ({ key: this._rand(1, 10000) });
    }

    this._tickerState = state;

    this.once('resume', () => this._run(state));
  }

  _run(state) {
    function loop(data) {
      if (state.finished) {
        this.push(null);
      } else {
        state.ticks.push(data);
        this._read();
        const delay = this._rand(state.min, state.max);
        setTimeout(loop.bind(this), delay, state.phony());
      }
    }
    loop.call(this, state.phony());
    setTimeout(() => state.finished = true, state.duration);
  }

  _read() {
    const state = this._tickerState;
    while (state.ticks.length > 0) {
      const tick = state.ticks.shift();
      if (!this.push(tick)) {
        break;
      }
    }
  }

  _rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};
