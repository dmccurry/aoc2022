const fs = require('fs');
const cubes = {};
fs.readFile('./input', 'utf-8', (_, data) => {
  const lines = data.split('\n');
  lines.forEach(line => {
    cubes[line] = [];
  });
  let nCubes = Object.keys(cubes).length;
  let nNeighbors = 0;
  for (let i=0; i<nCubes; i++) {
    let a = Object.keys(cubes)[i];
    let [x, y, z] = a.split(',').map(n => parseInt(n));
    if (cubes[`${x+1},${y},${z}`]) nNeighbors++;
    if (cubes[`${x-1},${y},${z}`]) nNeighbors++;
    if (cubes[`${x},${y+1},${z}`]) nNeighbors++;
    if (cubes[`${x},${y-1},${z}`]) nNeighbors++;
    if (cubes[`${x},${y},${z+1}`]) nNeighbors++;
    if (cubes[`${x},${y},${z-1}`]) nNeighbors++;
  }
  console.log(`Solution is ${6 * nCubes - (nNeighbors)}`);
});