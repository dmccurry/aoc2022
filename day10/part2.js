const fs = require('fs');

let x = 1;
let cycle = 0;
let out = '';

fs.readFile('./input', 'utf-8', (_, data) => {
  const instructions = data.split('\n');

  instructions.forEach(instruction => {
    if (instruction == 'noop') {
      if (cycle % 40 >= x-1 && cycle %40 <= x+1) {
        out += '#';
      } else {
        out += '.';
      }
      if ((cycle + 1) % 40 == 0) {
        out += '\n';
      }
      cycle++;
    } else {
      const [addx, num] = instruction.split(' ');
      
      if (cycle % 40 >= x-1 && cycle %40 <= x+1) {
        out += '#';
      } else {
        out += '.';
      }
      if ((cycle + 1) % 40 == 0) {
        out += '\n';
      }
      
      cycle++;
      if (cycle % 40 >= x-1 && cycle %40 <= x+1) {
        out += '#';
      } else {
        out += '.';
      }
      if ((cycle + 1) % 40 == 0) {
        out += '\n';
      }
      cycle++;
      x += parseInt(num);
    }
  });

  console.log(out);
});