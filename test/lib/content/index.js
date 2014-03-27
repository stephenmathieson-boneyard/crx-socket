
var socket = require('crx-socket');
var Client = socket.Client;
var uuid = require('uuid');

var CLIENT_ID = [location.href, uuid()].join(':');

var client = new Client(CLIENT_ID);

client.emit('foo', function (data) {
  console.log(data);
});
