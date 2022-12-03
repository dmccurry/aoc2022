const fs = require('fs');

const points = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

fs.readFile('./input', 'utf-8', (_, data) => {
  const rucksacks = data.split('\n');
  let total = 0;

  for (let index = 0; index<rucksacks.length; index+=3) {
    const first = rucksacks[index];
    const second = rucksacks[index+1];
    const third = rucksacks[index+2];
    for (let i=0; i<first.length; i++) {
      if (second.indexOf(first.charAt(i)) >= 0 && third.indexOf(first.charAt(i)) >= 0) {
        total += points.indexOf(first.charAt(i)) + 1;
        break;
      }
    }
  }
  console.log(`Solution is ${total}`);
});