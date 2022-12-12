const fs = require('fs');
const heights = 'abcdefghijklmnopqrstuvwxyz';
class Point {
  constructor(x, y, height, neighbors) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.neighbors = neighbors
  }
}
const graph = {};
const grid = [];
const starts = [];

fs.readFile('./input', 'utf-8', (_, data) => {
  let rows = data.split('\n');
  
  // build our grid of letters
  for (let y=0; y<rows.length; y++) {
    let cols = rows[y].split('');
    grid[y] = [];
    for (let x=0; x<cols.length; x++) {
      grid[y][x] = cols[x];
      if (cols[x] == 'S' || cols[x] == 'a') {
        starts.push(`${x},${y}`);
      }
      if (cols[x] == 'E') {
        endX = x;
        endY = y;
      }
    }
  }

  // build our graph of points
  for (let y=0; y<grid.length; y++) {
    for (let x=0; x<grid[y].length; x++) {
      const height = (grid[y][x] == 'S') ? 0 : heights.indexOf(grid[y][x]);
      const neighbors = [];
      neighbors.push(`${x},${y+1}`);
      neighbors.push(`${x},${y-1}`);
      neighbors.push(`${x+1},${y}`);
      neighbors.push(`${x-1},${y}`);

      const filteredNeighbors = neighbors.filter(n => {
        let [x2, y2] = n.split(',').map(j => parseInt(j));
        const isOnGrid = x2 >= 0 && y2 >= 0 && x2 < grid[y].length && y2 < grid.length;
        if (!isOnGrid) return false;

        let next = grid[y2][x2];
        if (next == 'S') next = 'a';
        if (next == 'E') next = 'z';
        return heights.indexOf(next) - height <= 1;
      });

      graph[`${x},${y}`] = new Point(x, y, height, filteredNeighbors);
    }
  }

  let min = Infinity;
  starts.forEach(start => {
    const [startX, startY] = start.split(',').map(j => parseInt(j));
    const d = bfs(startX, startY, endX, endY, graph);
    if (d < min) min = d;
  });
  console.log(`Solution is ${min}`);

});

const bfs = (startX, startY, endX, endY, graph) => {
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
    let point = graph[coords];
    for (let i=0; i<point.neighbors.length; i++) {
      let ncoords = point.neighbors[i];
      if (!visited[ncoords]) {
        visited[ncoords] = 1;
        distances[ncoords] = distances[coords] + 1;
        queue.push(ncoords);
      }
    }
  }

  return distances[`${endX},${endY}`];
}