
module.exports = Client;

/**
 * Create a `Client` of `name`.
 *
 * @api public
 * @param {String} name
 */

function Client(name) {
  if (!(this instanceof Client)) return new Client(name);
  this.name = name;
  this.port = chrome.runtime.connect({ name: name });
  this._onMessage = this.onMessage.bind(this);
  this.port.onMessage.addListener(this._onMessage);
  this.listeners = {};
}

/**
 * Emit a `name` message with the given `data`,
 * optionally invoking `fn(response)`.
 *
 * @api public
 * @param {String} name
 * @param {Mixed} data
 * @param {Function} [fn]
 * @return {Client} for chaining
 */

Client.prototype.emit = function (name, data, fn) {
  if ('function' == typeof data) fn = data, data = null;
  this.port.postMessage({
    client: this.name,
    name: name,
    data: data
  });
  // possibly leaky
  if (fn) this.once(name, fn);
  return this;
};

/**
 * Listen for the given `name` message with `fn`.
 *
 * @api public
 * @param {String} name
 * @param {Function} fn
 * @return {Client} for chaining
 */

Client.prototype.on = function (name, fn) {
  this.listeners[name] = this.listeners[name] || [];
  // avoid duplicate listeners
  if (~this.listeners[name].indexOf(fn)) return this;
  this.listeners[name].push(fn);
  return this;
};

/**
 * Listen for the given `name` message, but only
 * fire `fn` once.
 *
 * @api public
 * @param {String} name
 * @param {Function} fn
 * @return {Client} for chaining
 */

Client.prototype.once = function (name, fn) {
  var self = this;
  return this.on(name, function once(data) {
    fn.call(self, data);
    self.off(name, once);
  });
};

/**
 * Remove the given `fn` listener for `name` messages,
 * or all `name` listeners if `fn` is not provided.
 *
 * @api public
 * @param {String} name
 * @param {Function} fn
 * @return {Client} for chaining
 */

Client.prototype.off = function (name, fn) {
  var fns = this.listeners[name];
  if (!fns || !fns.length) return this;
  if (fn) {
    // remove specific listener
    var i = fns.indexOf(fn);
    if (~i) fns.splice(i, 1);
  } else {
    // remove *all* listeners
    fns.length = 0;
  }
  return this;
};

/**
 * Message recv callback.
 *
 * @api private
 * @param {Mixed} msg
 */

Client.prototype.onMessage = function (msg) {
  if (!msg.name) return;

  // copy array to handle `.once` removals, etc.
  var fns = (this.listeners[msg.name] || []).slice(0);
  for (var i = 0, l = fns.length; i < l; i++) {
    fns[i].call(this, msg.data);
  }
};
