const fs = require('fs');

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

fs.readFile('./input', 'utf-8', (_, data) => {

  let visited = {};
  visited['0,0'] = 1;

  const points = [];
  for (let i=0; i<10; i++) {
    points.push(new Point(0, 0));
  }

  const moves = data.split('\n');

  moves.forEach(move => {
    let [dir, num] = move.split(' ');
    num = parseInt(num);

    let s = 0;
    // move the head
    while (s < num) {
      if (dir == 'U') {
        points[0].y++;
      } else if (dir == 'D') {
        points[0].y--;
      } else if (dir == 'R') {
        points[0].x++;
      } else if (dir == 'L') {
        points[0].x--;
      }

      for (let i=1; i<points.length; i++) {
        let hx = points[i-1].x;
        let hy = points[i-1].y;
        let tx = points[i].x;
        let ty = points[i].y;
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
          points[i].x = tx;
          points[i].y = ty;
        }
        
      }
      visited[`${points[9].x},${points[9].y}`] = 1;
      s++;
    }
  });
  console.log(`Solution is ${Object.keys(visited).length}`);

});

const isAdjacent = (x1, y1, x2, y2) => {
  if (x1 == x2 && y1 == y2) return true;
  if (x1 == x2 && Math.abs(y2-y1) == 1) return true;
  if (y1 == y2 && Math.abs(x2-x1) == 1) return true;
  if (Math.abs(x2-x1) == 1 && Math.abs(y2-y1) == 1) return true;
  return false;
}