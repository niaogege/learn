function ajax({ url = '', options = {} }) {
  const config = {
    url,
    type: 'GET',
    async: true,
  };

  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(config.type, config.url, config.async);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let res = JSON.parse(xhr.responseText);
          resolve(res);
        }
      }
    };
    xhr.send();
  });
}
export default ajax;
