
var socket = require('crx-socket');
var Server = socket.Server;

var server = new Server('background');

server.on('connection', function (port) {
  console.log('%s connected', port.name);
});

server.on('disconnect', function (port) {
  console.log('%s disconnected', port.name);
});

server.on('message', function (msg) {
  console.log('message', msg);
});

server.on('foo', function (data, res) {
  res.send('hello from background!');
});
