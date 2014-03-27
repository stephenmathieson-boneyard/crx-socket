
var socket = require('crx-socket');
var Server = socket.Server;

var server = new Server('background');

server.on('foo', function (data, res) {
  res.send('hello from background!');
});
