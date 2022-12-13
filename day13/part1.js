const fs = require('fs');

fs.readFile('./input', 'utf-8', (_, data) => {
  const pairs = data.split('\n\n');
  let index = 1;
  const indicies = [];

  pairs.forEach(pair => {
    const [left, right] = pair.split('\n').map(a => eval(a));
    if (compare(left, right) < 0) {
      indicies.push(index);
    }
    index++;
  });

  console.log(`Solution is ${indicies.reduce((a, b) => { return a + b}, 0)}`)
});

const compare = (left, right) => {
  if (typeof(left) == 'number' && typeof(right) == 'number') {
    return left - right;
  } else {
    if (typeof(left) != 'object') {
      left = [left];
    }
    if (typeof(right) != 'object') {
      right = [right];
    }
    let l = Math.min(left.length, right.length);
    for (let i=0; i<l; i++) {
      let c = compare(left[i], right[i]);
      if (c != 0) return c;
    }
    return left.length - right.length;
  }
}