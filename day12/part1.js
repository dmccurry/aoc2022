const fs = require('fs');
const heights = 'abcdefghijklmnopqrstuvwxyz';
const edges = {};
const grid = [];
let startX, startY, endX, endY = 0;

fs.readFile('./input', 'utf-8', (_, data) => {
  let rows = data.split('\n');
  
  // build our grid of letters
  for (let x=0; x<rows.length; x++) {
    let cols = rows[x].split('');
    grid[x] = [];
    for (let y=0; y<cols.length; y++) {
      grid[x][y] = cols[y];
      if (cols[y] == 'S') {
        startX = x;
        startY = y;
      }
      if (cols[y] == 'E') {
        endX = x;
        endY = y;
      }
    }
  }
  // build our graph of points
  for (let x=0; x<grid.length; x++) {
    for (let y=0; y<grid[x].length; y++) {
      const height = heights.indexOf(grid[x][y]);
      const neighbors = [];
      neighbors.push(`${x},${y+1}`);
      neighbors.push(`${x+1},${y}`);
      neighbors.push(`${x},${y-1}`);
      neighbors.push(`${x-1},${y}`);

      edges[`${x},${y}`] = filteredNeighbors = neighbors.filter(n => {
        let [x2, y2] = n.split(',').map(j => parseInt(j));
        const isOnGrid = x2 >= 0 && y2 >= 0 && x2 < grid.length && y2 < grid[x].length;
        if (!isOnGrid) return false;
        let next = grid[x2][y2];
        if (next == 'S') next = 'a';
        if (next == 'E') next = 'z';
        return heights.indexOf(next) - height <= 1;
      });
    }
  }

  // bfs
  const visited = {};
  const distances = {};
  const queue = [];

  const s = `${startX},${startY}`;
  visited[s] = 1;
  distances[s] = 0;
  queue.push(s);
  while (queue.length > 0) {
    let coords = queue.shift();
    for (let i=0; i<edges[coords].length; i++) {
      let ncoords = edges[coords][i];
      if (!visited[ncoords]) {
        visited[ncoords] = 1;
        distances[ncoords] = distances[coords] + 1;
        queue.push(ncoords);
      }
    }
  }
  const d = distances[`${endX},${endY}`];
  console.log(`Solution is ${d}`);
});