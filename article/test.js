var newP = 'ggg1111';
var pattern = /^[A-z0-9~!@#$%^&*()/|,.<>?"'();:_+-=[\]{}]{8,20}$/; //数字、字母、特殊字符 6-20位
var reg = new RegExp(pattern);
if (!reg.test(newP)) {
  console.log('密码不正确');
}
