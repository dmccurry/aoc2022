const fs = require('fs');

const points = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

fs.readFile('./input', 'utf-8', (_, data) => {
  const rucksacks = data.split('\n');
  let total = 0;
  rucksacks.forEach(r => {
    const first = r.substring(0, r.length / 2);
    const second = r.substring(r.length / 2);

    for (let i=0; i<first.length; i++) {
      if (second.indexOf(first.charAt(i)) >= 0) {
        total += points.indexOf(first.charAt(i)) + 1;
        break;
      }
    }
  });
  console.log(`Solution is ${total}`);
});