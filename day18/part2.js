const fs = require('fs');
let max = [-Infinity, -Infinity, -Infinity];
let min = [0, 0, 0];
fs.readFile('./input', 'utf-8', (_, data) => {
  let cubes = data.split('\n').map(l => l.split(',').map(n => parseInt(n)));
  const lines = data.split('\n');
  lines.forEach(line => {
    const [x, y, z] = line.split(',').map(n => parseInt(n));
    if (x > max[0]) max[0] = x;
    if (y > max[1]) max[1] = y;
    if (z > max[2]) max[2] = z;
  });
  
  // make the grid a bit bigger?  1 doesn't work :-)
  max[0] += 2;
  max[1] += 2;
  max[2] += 2;

  const grid = [];
  const visited = [];
  for (let i=0; i<=max[0]; i++) {
    grid[i] = [];
    visited[i] = [];
    for (let j=0; j<=max[1]; j++) {
      grid[i][j] = [];
      visited[i][j] = [];
      for (let k=0; k<=max[2]; k++) {
        grid[i][j][k] = false;
        visited[i][j][k] = false;
      }
    }
  }
  cubes = cubes.map(([x, y, z]) => [x+1,y+1,z+1]);
  cubes.forEach(([x, y, z]) => grid[x][y][z] = true);
  const s = [];
  s.push([0, 0, 0]);
  let nSides = 0;
  while (s.length > 0) {
    let [x, y, z] = s.pop();
    if (visited[x][y][z]) {
      continue;
    }
    visited[x][y][z] = 1;
    let neighbors = getNeighbors([x, y, z]);
    for (let i=0; i<neighbors.length; i++) {
      const nx = neighbors[i][0];
      const ny = neighbors[i][1];
      const nz = neighbors[i][2];
      if (nx < min[0] || ny < min[1] || nz < min[2] || nx > max[0] || ny > max[1] || nz > max[2]) {
        continue;
      }

      if (grid[nx][ny][nz]) {
        nSides++;
        continue;
      }
      s.push([nx, ny, nz]);
    }
  }
  console.log(`Solution is ${nSides}`);

});

const getNeighbors = (a) => {
  let neighbors = [];
  let x = a[0];
  let y = a[1];
  let z = a[2];
  neighbors.push([x+1, y, z]);
  neighbors.push([x-1, y, z]);
  neighbors.push([x, y+1, z]);
  neighbors.push([x, y-1, z]);
  neighbors.push([x, y, z+1]);
  neighbors.push([x, y, z-1]);
  return neighbors;
}