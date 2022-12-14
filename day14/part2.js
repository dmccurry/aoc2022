const fs = require('fs');

const rock = {};
const sand = {};

fs.readFile('./input', 'utf-8', (_, data) => {
  const lines = data.split('\n');
  let bottom = 0;
  lines.forEach(line => {
    const points = line.split(' -> ');
    for (let i=0; i<points.length-1; i++) {
      const [x1, y1] = points[i].split(',').map(p => parseInt(p));
      const [x2, y2] = points[i+1].split(',').map(p => parseInt(p));
      if (y1 > bottom) bottom = y1;
      if (y2 > bottom) bottom = y2;
      rock[`${x1},${y1}`] = 1;
      let dir = 1;
      if (x1 != x2) {
        if (x2 < x1) {
          dir = -1;
        }
        for (let j=x1; j != x2; j += dir) {
          rock[`${j},${y1}`] = 1;
        }
      } else {
        if (y2 < y1) {
          dir = -1;
        }
        for (let j=y1; j != y2; j += dir) {
          rock[`${x1},${j}`] = 1;
        }
      }
      rock[`${x2},${y2}`] = 1;
    }
  });

  bottom = bottom + 2;

  let done = false;
  let sandX = 500;
  let sandY = 0;
  while (!done) {
    // down
    if (sandY+1 == bottom) {
      sand[`${sandX},${sandY}`] = 1;
      sandX = 500;
      sandY = 0;
    } else if (!rock[`${sandX},${sandY+1}`] && !sand[`${sandX},${sandY+1}`]) {
      sandY++;
    } else if (!rock[`${sandX-1},${sandY+1}`] && !sand[`${sandX-1},${sandY+1}`]) { // diag left
      sandY++;
      sandX--;
    } else if (!rock[`${sandX+1},${sandY+1}`] && !sand[`${sandX+1},${sandY+1}`]) { // diag right
      sandY++;
      sandX++;
    } else { // settled
      sand[`${sandX},${sandY}`] = 1;
      sandX = 500;
      sandY = 0;
    }

    if (sand['500,0']) {
      done = true;
    }
  }
  console.log(`Solution is ${Object.keys(sand).length}`);

});