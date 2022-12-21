const fs = require('fs');
const monkeysOrig = {};
let monkeys;
fs.readFile('./input', 'utf-8', (_, data) => {

  data.split('\n').forEach(line => {
    let [monkey, op] = line.split(': ');
    if (op.indexOf(' ') <= 0) op = parseInt(op);
    monkeysOrig[monkey] = op;
  });

  const [left, middle, right] = monkeysOrig['root'].split(' ');
  let humn = 3759569920000;

  monkeys = Object.assign({}, monkeysOrig);
  let target = 15610303684582;

  let equals = false;
  while (!equals) {
    monkeys = Object.assign({}, monkeysOrig);
    monkeys['humn'] = humn;
    let a = getMonkeyValue(left);
    if (a == target) equals = true;
    humn++;
    if (humn % 1000 == 0) {
      console.log(`${humn}...`);
    }
  }
  console.log(`Solution is ${humn - 1}`);

});

const getMonkeyValue = (monkey) => {
  let op = monkeys[monkey];
  if (typeof(op) == 'number') return op;

  if (monkey == 'humn') {
    console.log(true);
  }
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