const fs = require('fs');

fs.readFile('./input', 'utf-8', (_, data) => {
  const lines = data.split('\n');
  let overlaps = 0;
  lines.forEach(pair => {
    const elfA = pair.split(',')[0];
    const elfB = pair.split(',')[1];

    const elfAStart = parseInt(elfA.split('-')[0]);
    const elfAEnd = parseInt(elfA.split('-')[1]);
    const elfBStart = parseInt(elfB.split('-')[0]);
    const elfBEnd = parseInt(elfB.split('-')[1]);

    if (elfBStart >= elfAStart && elfBStart <= elfAEnd) {
      overlaps++;
    } else if (elfAStart >= elfBStart && elfAStart <= elfBEnd) {
      overlaps++;
    }
  });
  console.log(`Solution is ${overlaps}`);
})