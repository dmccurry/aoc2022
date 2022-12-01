const fs = require('fs');

fs.readFile('./input', 'utf-8', (err, data) => {
  const all = data.split('\n\n');
  const totals = [];
  let max = 0;

  all.forEach(elf => {
    let b = elf.split('\n').map(e => parseInt(e)).reduce((a, b) => a + b, 0);
    if (b > max) {
      max = b;
    }
    all.push(b);
  });
  console.log(`Solution is ${max}`);
});