
module.exports = plugin;

function plugin(builder) {
  builder.append('\nrequire("' + builder.config.local[0] + '");\n');
}
