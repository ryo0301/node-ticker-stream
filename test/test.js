'use strict';

const expect = require('chai').expect;
const TickerStream = require('../lib/TickerStream.js');

describe('Constructor', function() {
  it('should have default property value', function() {
    const ts = new TickerStream();
    expect(ts._tickerState.min).to.equal(100);
    expect(ts._tickerState.max).to.equal(1000);
    expect(ts._tickerState.duration).to.equal(10000);
    expect(ts._tickerState.phony).to.be.a('function');
    expect(ts._tickerState.phony()).to.be.a('object');
  });

  it('should have specified property value', function() {
    const ts = new TickerStream({
      min: 1,
      max: 10,
      duration: 100,
      phony: () => ({k:'v'})
    });
    expect(ts._tickerState.min).to.equal(1);
    expect(ts._tickerState.max).to.equal(10);
    expect(ts._tickerState.duration).to.equal(100);
    expect(ts._tickerState.phony).to.be.a('function');
    expect(ts._tickerState.phony()).to.deep.equal({k:'v'});
  });

  it('should swap min and max if min larger than max', function() {
    const min = 1000;
    const max = 10;
    const ts = new TickerStream({ min, max });
    expect(ts._tickerState.min).to.equal(max);
    expect(ts._tickerState.max).to.equal(min);
  });

  it('should not start until resume event emitted', function() {
    const ts = new TickerStream();
    expect(ts._tickerState.ticks).to.have.length(0);
  });
});

describe('Events', function() {
  it('should handle data event', function(done) {
    const ts = new TickerStream({
      duration: 100,
      phony: () => ({k:'v'})
    });
    ts.on('data', function(data) {
      expect(data).to.deep.equal({k:'v'});
      done();
    });
  });

  it('should not handle readable event', function(done) {
    this.slow(250);
    const ts = new TickerStream({
      min: 5,
      max: 5,
      duration: 100
    });
    ts.on('readable', function() {
      done(new Error('Handle readable event'));
    });
    setTimeout(function() {
      done();
    }, 200);
  });
});
