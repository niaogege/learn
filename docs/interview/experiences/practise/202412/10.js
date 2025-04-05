/**
 * 1.手机每隔千分位展示
 * 2.手机号3-4-4展示
 */

// 187 2400 9609
function changeTo(str) {
  return str.replace(/(?!^)(?=(\d{3})+$)/g, ',');
}
changeTo('18724009609');

function numTo(str) {
  return str.replace(/(?=(\d{4})+$)/g, '-');
}
numTo('18724009609');
