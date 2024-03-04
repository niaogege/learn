/**
 * 1.instanceOf
 * 2.bind
 * 3.超时重传机制
 * 4.Promise.finally
 * 5.reduce
 */

Array.prototype.mockReduce = function (fn, init) {};

function mockInstanceOf(l, r) {
  let l = Object.getPrototypeOf(l);
  while (l) {
    // XXXX
    if (l == r.prototype) {
      return true;
    }
    l = Object.getPrototypeOf(l);
  }
  return false;
}

function secondInstanceof(l, r) {
  return r.prototype.isPrototypeOf(l);
}
