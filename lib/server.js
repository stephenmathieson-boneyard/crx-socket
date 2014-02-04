
var Emitter = require('emitter');

module.exports = Server;

/**
 * Create a `Server` of `name`.
 *
 * @api public
 * @param {String} name
 */

function Server(name) {
  if (!(this instanceof Server)) return new Server(name);
  Emitter.call(this);
  this.name = name;
  this._onConnection = this.onConnection.bind(this);
  this._onMessage = this.onMessage.bind(this);
  chrome.runtime.onConnect.addListener(this._onConnection);
  this.ports = [];
}

/**
 * Inherit `Emitter` prototype.
 */

Emitter(Server.prototype);

/**
 * Client connection callback.
 *
 * @api private
 * @param {Port} port
 */

Server.prototype.onConnection = function (port) {
  this.emit('connection', port);
  this.ports.push(port);
  port.onMessage.addListener(this._onMessage);
};

/**
 * Message recv callback.
 *
 * @api private
 * @param {Object} msg
 */

Server.prototype.onMessage = function (msg) {
  this.emit('message', msg);

  if (!msg.client) {
    this.emit('error', new Error('A message requires a client'));
    return;
  }

  var port = null;
  for (var i = 0, l = this.ports.length; i < l; i++) {
    if (msg.client == this.ports[i].name) {
      port = this.ports[i];
      break;
    }
  }

  if (!port) {
    var err = new Error('No matching port for client: ' + msg.client);
    this.emit('error', err);
    return;
  }

  this.emit(msg.name, msg.data, port);
};
