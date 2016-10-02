# node-ticker-stream

## Simple example

```js
const TickerStream = require('ticker-stream');

const ticker = new TickerStream();
ticker.on('data', function(data) {
  console.log(data);
});

/*
{ key: 3398 }
{ key: 1078 }
{ key: 603 }
 :
*/
```

## Optional arguments

```js
const TickerStream = require('ticker-stream');

var i = 0;
const ticker = new TickerStream({
  min: 10,
  max: 500,
  duration: 2000,
  phony: () => {
    return {
      id: ++i,
      time: Date.now()
    };
  }
});
ticker.on('data', function(data) {
  console.log(data);
});

/*
{ id: 1, time: 1475400789052 }
{ id: 2, time: 1475400789076 }
{ id: 3, time: 1475400789472 }
  :
*/
```
