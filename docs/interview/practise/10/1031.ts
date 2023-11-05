/**
 * 1.hsl和rgb转化
 * 2.大数相加
 * 3.树转数组
 * 4.数组转树
 */

// 123456789+987654321
function addBigInt(a, b) {
  var len = Math.max(a.length, b.length);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');
  var res = '';
  var flag = 0;
  for (let i = len - 1; i >= 0; i--) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
  }
  return flag === 1 ? 1 + res : res;
}
addBigInt('1230', '123');

// #ffffff => rgb(255,255,255)
function hexToRgb(str) {
  var rgbs = str.replace('#', '0x');
  var r = rgbs >> 16;
  var g = (rgbs >> 8) & 0xff;
  var b = rgbs & 0xff;
  return `rgb(${r}, ${g}, ${b})`;
}

// rgb(255,255,255) => #ffffff
function rgbToHex(str) {
  var rgbs = str.split(/^\d+/g);
  console.log('rgbs', rgbs);
  var [, r, g, b] = rgbs;
  var toHex = (hex) => {
    var res = Number(hex).toString(16);
    return res.length < 2 ? `0${res}` : res;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
rgbToHex('rgb(255, 255, 255)');
