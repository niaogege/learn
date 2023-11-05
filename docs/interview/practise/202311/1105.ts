/**
 * 1.ajax
 * 2.limitRequest
 * 3.async/await
 * 4.jsonp
 * 5.objectToQueryString
 */
function mockAjax(url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('Get', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.DONE && xhr.readyState) {
        resolve(xhr.responseText);
      } else {
        reject('error');
      }
    };
    xhr.send();
  });
}

// 拼接url参数
function objectToQueryString(obj) {
  const params = new URLSearchParams();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      params.append(key, obj[key]);
    }
  }
  return params.toString();
}
objectToQueryString({ name: 'cpp', size: 100 });
// 解析url参数
function parseQueryString(key) {
  var queryString = location.search;
  var paramsString = new URLSearchParams(queryString);
  if (paramsString.has(key)) {
    return paramsString.get(key);
  }
  return paramsString;
}
parseQueryString('uid');
