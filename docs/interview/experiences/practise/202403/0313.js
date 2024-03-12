/**
 * 1.MockInterator
 * 2.Promise.allSttled
 * 3.生成扑克牌的所有序列
 * 4.拼手气抢红包
 */

class Promise {
  static allSettled(arr) {
    return Promise.all(
      arr.map((item) => {
        return Promise.resolve(item).then(
          (res) => ({
            status: 'fullfilled',
            value: res,
          }),
          (err) => ({
            status: 'rejected',
            reason: err,
          }),
        );
      }),
    );
  }
}

class MockInterator {
  constructor(obj) {
    this.len = Object.keys(obj);
    this.obj = obj;
    this.index = 0;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    return this.index < this.len
      ? {
          done: false,
          value: this.obj[this.index++],
        }
      : {
          done: true,
          value: undefined,
        };
  }
}
