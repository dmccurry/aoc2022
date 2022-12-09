const fs = require('fs');

fs.readFile('./input', 'utf-8', (_, data) => {
  let hx = 0;
  let hy = 0;

  let tx = 0;
  let ty = 0;

  let points = {};
  points['0,0'] = 1;

  const moves = data.split('\n');

  moves.forEach(move => {
    let [dir, num] = move.split(' ');
    num = parseInt(num);

    let s = 0;
    while (s < num) {
      if (dir == 'U') {
        hy++;
      } else if (dir == 'D') {
        hy--;
      } else if (dir == 'R') {
        hx++;
      } else if (dir == 'L') {
        hx--;
      }

      if (!isAdjacent(hx, hy, tx, ty)) {
        // need to move T
        if (hx == tx) { // same x
          if (hy > ty) ty++;
          else ty--;
        } else if (hy == ty) { // same y
          if (hx > tx) tx++;
          else tx--;
        } else { // diagonal
          if (hx > tx && hy > ty) {
            tx++;
            ty++;
          } else if (hx > tx && hy < ty) {
            tx++;
            ty--;
          } else if (hx < tx && hy > ty) {
            tx--;
            ty++;
          } else {
            tx--;
            ty--;
          }
        }
        points[`${tx},${ty}`] = 1;
      }

      s++;
    }
  });
  console.log(`Solution is ${Object.keys(points).length}`);

});

const isAdjacent = (x1, y1, x2, y2) => {
  if (x1 == x2 && y1 == y2) return true;
  if (x1 == x2 && Math.abs(y2-y1) == 1) return true;
  if (y1 == y2 && Math.abs(x2-x1) == 1) return true;
  if (Math.abs(x2-x1) == 1 && Math.abs(y2-y1) == 1) return true;
  return false;
}