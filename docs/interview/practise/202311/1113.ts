function mockAjax(url, cb) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      // 检查请求的状态 4
      if (xhr.readyState === xhr.DONE && xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject('error');
      }
    };
    xhr.send();
  });
}
