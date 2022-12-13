const fs = require('fs');

fs.readFile('./input', 'utf-8', (_, data) => {

  const pairs = data.split('\n\n');
  let index = 1;
  const indicies = [];

  pairs.forEach(pair => {
    const [left, right] = pair.split('\n').map(a => eval(a));
    if (compare(left, right)) {
      indicies.push(index);
    }
    index++;
  });

  console.log(`Solution is ${indicies.reduce((a, b) => { return a + b}, 0)}`)
});

const compare = (left, right) => {
  if (typeof(left) == 'object' && typeof(right) == 'object') {
    if (left.length == 0) return true;
    for (let i=0; i<left.length; i++) {
      if (i > right.length - 1) {
        return false;
      }
      const leftItem = left[i];
      const rightItem = right[i];

      if (typeof(leftItem) == 'number' && typeof(rightItem) == 'number') {
        if (leftItem < rightItem) return true;
        if (rightItem < leftItem) return false;
      } else {
        return compare(leftItem, rightItem);
      }
    }
    if (left.length <= right.length) {
      return true;
    }
  } else if (typeof(left) == 'object' && typeof(right) == 'number') {
    const newRight = [];
    newRight.push(right);
    return compare(left, newRight);
  } else if (typeof(right) == 'object' && typeof(left) == 'number') {
    const newLeft = [];
    newLeft.push(left);
    return compare(newLeft, right);
  } 
  return false;
}