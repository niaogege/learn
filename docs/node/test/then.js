// console.log('start');
// setImmediate(() => {
//   console.log(1);
// });
// Promise.resolve().then(() => {
//   console.log(4);
// });
// Promise.resolve().then(() => {
//   console.log(5);
// });
// process.nextTick(function foo() {
//   console.log(2);
// });
// process.nextTick(function foo() {
//   console.log(3);
// });
// console.log('end');

// start end 2 3 4 5 1

// // 1 10 8 9 5 7 2 3 4 6

console.log('1');
setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3);
    process.nextTick(function foo() {
      console.log(4);
    });
  });
});
Promise.resolve().then(() => {
  console.log(5);
  setTimeout(() => {
    console.log(6);
  });
  Promise.resolve().then(() => {
    console.log(7);
  });
});

process.nextTick(function foo() {
  console.log(8);
  process.nextTick(function foo() {
    console.log(9);
  });
});
console.log('10');

Promise.resolve().then(function () {
  process.nextTick(function () {
    console.log('nextTick1');
  });
  Promise.resolve().then(function () {
    console.log('promise1');
    Promise.resolve().then(function () {
      console.log('promise2');
    });
  });
});
// promise1 promise2 nextTick1
