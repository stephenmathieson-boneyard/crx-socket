
# crx-socket

  Messaging sockets for Chrome extensions with a usable API.

## Installation

  Install with [component(1)](http://component.io):

    $ component install stephenmathieson/crx-socket

## Example

  **content.js**

```js
var socket = require('crx-socket');
var client = socket.createClient('example');

client.on('foo', function (bar) {
  console.log(bar);
  // bar{1..100}
});

for (var i = 0; i < 100; i++) {
  client.emit('foo', 'bar');
}

```

  **background.js**

```js
var socket = require('crx-socket');
var server = socket.createServer();

server.on('connection', function (port) {
  console.log('%s connected', port.name);
});

var n = 0;
server.on('foo', function (msg, res) {
  var data = msg + ++n;
  res.send(data);
});
```

## License

  The MIT License (MIT)

  Copyright (c) 2014 Stephen Mathieson &lt;me@stephenmathieson.com&gt;

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.