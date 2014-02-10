
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
  port.onDisconnect.addListener(this.onDisconnect.bind(this, port));
};

/**
 * Client disconnect callback.
 *
 * @api private
 * @param {Port} port
 */

Server.prototype.onDisconnect = function (port) {
  var i = this.ports.indexOf(port);
  if (~i) {
    this.ports.splice(i, 1);
    this.emit('disconnect', port);
  }
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

  var res = new Response(msg, port);
  this.emit(msg.name, msg.data, res);
};

/**
 * Broadcast the given `data` to all connected clients.
 *
 * @api public
 * @param {Object|String} data
 * @return {Server} for chaining
 */

Server.prototype.broadcast = function (data) {
  if ('string' == typeof data) {
    data = { data: data, name: 'broadcast' };
  }
  this.ports.forEach(function (port) {
    var msg = {
      client: port.name,
      name: data.name,
      data: data.data
    };
    port.postMessage(msg);
  });
  return this;
};

/**
 * Simple client response wrapper.
 *
 * @api private
 * @param {Object} msg
 * @param {Port} port
 */

function Response(msg, port) {
  this.port = port;
  this.msg = {
    client: port.name,
    name: msg.name
  };
}

/**
 * Respond with the given `data`.
 *
 * @api private
 * @param {Mixed} data
 * @return {Response}
 */

Response.prototype.send = function (data) {
  this.msg.data = data;
  this.port.postMessage(this.msg);
  return this;
};
