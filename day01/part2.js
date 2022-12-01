const fs = require('fs');

fs.readFile('./input', 'utf-8', (err, data) => {
  const all = data.split('\n\n');
  const totals = [];

  all.forEach(elf => {
    let b = elf.split('\n').map(e => parseInt(e)).reduce((a, b) => a + b, 0);
    totals.push(b);
  });

  totals.sort((a, b) => a - b);
  const n = totals.length - 1;
  const maxes = totals[n] + totals[n-1] + totals[n-2];
  console.log(`Solution is ${maxes}`);
});