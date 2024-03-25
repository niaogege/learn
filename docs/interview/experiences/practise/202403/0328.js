/**
 * never give up
 * 1.vue render
 */

function render(str, data) {
  let reg = /\{\{(\w+)\}\}/;
  if (reg.test(str)) {
    let key = reg.exec(str)[1];
    str = str.replace(reg, data[key]);
    return render(str, data);
  }
  return str;
}

render('{{msg}}::{{name}}', {
  msg: 'info',
  name: 'cpp',
});
