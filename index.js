
exports.createClient = function (name) {
  return new exports.Client(name);
};

exports.createServer = function (name) {
  return new exports.Server(name);
};

exports.Client = require('./lib/client');
exports.Server = require('./lib/server');
