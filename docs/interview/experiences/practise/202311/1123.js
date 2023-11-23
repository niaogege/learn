/**
 * 1.请求超时设置
 * 2.qrcode
 * 3.promisify
 */

function scanQrcode() {
  var qrcode = new BarcodeDetector({
    formats: ['qr_code'],
  });
  var img = document.querySelector('img');
  qrcode.detect(img).then((codes) => {
    codes.forEach((ele) => {
      console.log(ele.rawValue);
    });
  });
}
