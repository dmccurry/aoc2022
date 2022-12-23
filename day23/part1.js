const fs = require('fs');
const elves = {};
const moveOrder = [
  ['N', 'S', 'W', 'E'],
  ['S', 'W', 'E', 'N'],
  ['W', 'E', 'N', 'S'],
  ['E', 'N', 'S', 'W']
]
let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;
fs.readFile('./input', 'utf-8', (_, data) => {
  const lines = data.split('\n');
  for (let y=0; y<lines.length; y++) {
    const points = lines[y].split('');
    for (let x=0; x<points.length; x++) {
      if (points[x] == '#') {
        elves[`${x},${y}`] = {
          x,
          y,
          px: null,
          py: null
        }
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  let currentDirIndex = 0;
  let rounds = 0;

  while (rounds < 10) {
    let pos = Object.keys(elves);
    const proposals = {};
    for (let i=0; i<pos.length; i++) {
      const elf = elves[pos[i]];
      let [px, py] = getProposal(elf, moveOrder[currentDirIndex]);
      elf.px = px;
      elf.py = py;
      if (px != null) {
        let k = `${px},${py}`;
        if (proposals[k]) proposals[k]++;
        else proposals[k] = 1;
      }
    }

    // now they all move
    for (let i=0; i<pos.length; i++) {
      const elf = elves[pos[i]];
      if (elf.px != null) {
        if (proposals[`${elf.px},${elf.py}`] == 1) {
          // move
          delete elves[pos[i]];
          elf.x = elf.px;
          elf.y = elf.py;
          elves[`${elf.x},${elf.y}`] = elf;

          if (elf.x < minX) minX = elf.x;
          if (elf.y < minY) minY = elf.y;
          if (elf.x > maxX) maxX = elf.x;
          if (elf.y > maxY) maxY = elf.y;
        }
      }
    }
    rounds++;
    currentDirIndex++;
    if (currentDirIndex == 4) currentDirIndex = 0;
  }

  // now count the empty squares
  let total = Math.abs(maxX - minX + 1) * Math.abs(maxY - minY + 1) - Object.keys(elves).length;
  console.log(`Solution is ${total}`);
});


const getProposal = (elf, dirs) => {
  const x = elf.x;
  const y = elf.y;
  for (let i=0; i<dirs.length; i++) {
    if (dirs[i] == 'N') {
      if (!elves[`${x-1},${y-1}`] && !elves[`${x},${y-1}`] && !elves[`${x+1},${y-1}`]) return [x, y-1];
    } else if (dirs[i] == 'S') {
      if (!elves[`${x-1},${y+1}`] && !elves[`${x},${y+1}`] && !elves[`${x+1},${y+1}`]) return [x, y+1];
    } else if (dirs[i] == 'W') {
      if (!elves[`${x-1},${y+1}`] && !elves[`${x-1},${y}`] && !elves[`${x-1},${y-1}`]) return [x-1, y];
    } else {
      if (!elves[`${x+1},${y+1}`] && !elves[`${x+1},${y}`] && !elves[`${x+1},${y-1}`]) return [x+1, y];
    }
  }
  return [null, null]
}