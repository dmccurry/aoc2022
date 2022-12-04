const fs = require('fs');

fs.readFile('./input', 'utf-8', (_, data) => {
  const lines = data.split('\n');
  let overlaps = 0;
  lines.forEach(pair => {
    const [elfA, elfB] = pair.split(',');
    const [elfAStart, elfAEnd] = elfA.split('-').map(e => parseInt(e));
    const [elfBStart, elfBEnd] = elfB.split('-').map(e => parseInt(e));
    if (elfBStart >= elfAStart && elfBStart <= elfAEnd) {
      overlaps++;
    } else if (elfAStart >= elfBStart && elfAStart <= elfBEnd) {
      overlaps++;
    }
  });
  console.log(`Solution is ${overlaps}`);
})