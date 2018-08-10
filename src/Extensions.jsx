// eslint-disable-next-line
String.prototype.formatUnicorn =
  String.prototype.formatUnicorn ||
  function() {
    var str = this.toString();
    if (arguments.length) {
      var t = typeof arguments[0];
      var key;
      var args =
        'string' === t || 'number' === t
          ? Array.prototype.slice.call(arguments)
          : arguments[0];

      for (key in args) {
        str = str.replace(new RegExp('\\{' + key + '\\}', 'gi'), args[key]);
      }
    }

    return str;
  };
// eslint-disable-next-line
String.prototype.hashCode = function() {
  let hash = 0;
  if (this.length === 0) return hash;
  for (let xi = 0; xi < this.length; xi++) {
    let char = this.charCodeAt(xi);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

Array.prototype.unique = function() {
  return this.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
};
