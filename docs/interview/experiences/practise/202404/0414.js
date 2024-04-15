/**
 * 1.class手写
 * 2.
 */

function mockClass(con, proto, staticProps) {
  proto && defineProperties(con.prototype, proto);
  staticProps && defineProperties(con, staticProps);
  return con;
}
function defineProperties(target, obj) {
  for (let key in obj) {
    Object.defineProperty(target, key, {
      value: obj[key],
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
}
