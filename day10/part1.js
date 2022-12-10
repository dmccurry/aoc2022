const fs = require('fs');

let x = 1;
let cycle = 0;
const cycles = [20,60,100,140,180,220];
let sum = 0;

fs.readFile('./input', 'utf-8', (_, data) => {
  const instructions = data.split('\n');

  instructions.forEach(instruction => {
    if (instruction == 'noop') {
      cycle++;
      if (cycles.indexOf(cycle) >=0) {
        sum += (cycle * x);
      }
    } else {
      const [addx, num] = instruction.split(' ');
      cycle++;
      if (cycles.indexOf(cycle) >=0) {
        sum += (cycle * x);
      }
      
      cycle++;
      if (cycles.indexOf(cycle) >=0) {
        sum += (cycle * x);
      }
      x += parseInt(num);
    }
  });

  console.log(`Solution is ${sum}`);
});