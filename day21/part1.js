const fs = require('fs');
const monkeys = {};
fs.readFile('./input', 'utf-8', (_, data) => {

  data.split('\n').forEach(line => {
    let [monkey, op] = line.split(': ');
    if (op.indexOf(' ') <= 0) op = parseInt(op);
    monkeys[monkey] = op;
  });
  
  console.log(`Solution is ${getMonkeyValue('root')}`);
});

const getMonkeyValue = (monkey) => {
  let op = monkeys[monkey];
  if (typeof(op) == 'number') return op;

  const [left, middle, right] = op.split(' ');
  if (middle == '+') {
    return getMonkeyValue(left) + getMonkeyValue(right);
  } else if (middle == '-') {
    return getMonkeyValue(left) - getMonkeyValue(right);
  } else if (middle == '/') {
    return getMonkeyValue(left) / getMonkeyValue(right);
  } else {
    return getMonkeyValue(left) * getMonkeyValue(right);
  }
}