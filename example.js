'use strict';

const util = require('util');
const TickerStream = require('./lib/TickerStream.js');

const phony = function() {
  return {
    key1: Date.now(),
    key2: 'value2',
    key3: (() => {
      return Math.floor(Math.random() * 1000);
    })()
  };
};

console.log('example:ticker:new');
const ticker = new TickerStream({
  min: 10,
  max: 100,
  duration: 5000,
  phony: phony
});

setTimeout(function() {
  console.log('example:ticker:ondata');
  ticker.on('data', (data) => {
    console.log(`example:ondata:${util.inspect(data)}`);
  });

  setTimeout(function() {
    console.log('example:ticker:pause');
    ticker.pause();

    setTimeout(function() {
      console.log('example:ticker:resume');
      ticker.resume();
    }, 2000);
  }, 1000);
}, 1000);

setInterval(function() {
  const rl = ticker._readableState.length;
  const tl = ticker._tickerState.ticks.length;
  console.log(`example:stream:length: ${rl}, ticker:length: ${tl}`);
}, 100);
