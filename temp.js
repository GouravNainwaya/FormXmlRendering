function secondLargest(arr) {
  if (arr.length < 2)
    return -1;

  let large = -Infinity;
  let second_large = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > large) {
      second_large = large;
      large = arr[i];
    } else if (arr[i] > second_large && arr[i] !== large) {
      second_large = arr[i];
    }
  }

  return second_large;
}
const arr = [1, 2, 4, 7, 7, 5];
const sL = secondLargest(arr);
console.log("Second largest is " + sL);