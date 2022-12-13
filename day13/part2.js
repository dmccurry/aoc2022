const fs = require('fs');

fs.readFile('./input', 'utf-8', (_, data) => {

  const pairs = data.split('\n\n');
  const all = [];
  all.push(eval('[[2]]'));
  all.push(eval('[[6]]'));

  pairs.forEach(pair => {
    const [left, right] = pair.split('\n').map(a => eval(a));
    all.push(left);
    all.push(right);
  });

  const sorted = all.sort((a, b) => { return compare(a, b); });
  let p1 = 0; p2 = 0, i = 1;
  
  sorted.forEach(s => {
    if (s.length == 1 && s[0].length == 1 && s[0][0] == 2) p1 = i;
    if (s.length == 1 && s[0].length == 1 && s[0][0] == 6) p2 = i;
    i++;
  });


  console.log(`Solution is ${p1 * p2}`)
});

const compare = (left, right) => {
  if (typeof(left) == 'number' && typeof(right) == 'number') {
    return left - right;
  } else {
    if (typeof(left) != 'object') {
      let newLeft = []; newLeft.push(left); left = newLeft;
    }
    if (typeof(right) != 'object') {
      let newRight = []; newRight.push(right); right = newRight;
    }
    let l = Math.min(left.length, right.length);
    for (let i=0; i<l; i++) {
      let c = compare(left[i], right[i]);
      if (c != 0) return c;
    }
    return left.length - right.length;
  }
}