/** never give up
 * 1.选择排序/插入排序
 * 2.
 */

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function selectSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    swap(arr, min, i);
  }
}
selectSort();

function inserSort(arr) {
  for (let i = 1; i < arr.length; i++) {}
}
