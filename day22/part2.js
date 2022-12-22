const fs = require('fs');
const gridMap = {};
const grid = [];
const rights = {
  'R': 'D',
  'D': 'L',
  'L': 'U',
  'U': 'R'
};
const lefts = {
  'R': 'U',
  'U': 'L',
  'L': 'D',
  'D': 'R'
};
const facing = {
  'R': 0,
  'D': 1,
  'L': 2,
  'U': 3
};
const bounds = {
  '1': [[50, 0], [99, 49]],
  '2': [[100, 0], [149, 49]],
  '3': [[50, 50], [99, 99]],
  '4': [[0, 100], [49, 149]],
  '5': [[50, 100], [99, 149]],
  '6': [[0, 150], [49, 199]]
};

fs.readFile('./input', 'utf-8', (_, data) => {
  const [map, instructions] = data.split('\n\n');
  let start = null;
  const lines = map.split('\n');
  const lineLength = lines[0].split('').length;
  for (let y=0; y<lines.length; y++) {
    const squares = lines[y].split('');
    grid[y] = [];
    for (let x=0; x<squares.length; x++) {
      if (start == null && squares[x] == '.') {
        start = [x, y];
      }
      gridMap[`${x},${y}`] = squares[x];
      grid[y][x] = squares[x];
    }
    for (let x=squares.length; x<lineLength; x++) {
      gridMap[`${x},${y}`] = ' ';
      grid[y][x] = ' ';
    }
  }
  
  let i = '';
  let steps = [];
  let chars = instructions.split('');
  chars.forEach(char => {
    if (char == 'R' || char == 'L') {
      if (i != '') {
        steps.push(parseInt(i));
        steps.push(char);
        i = ''
      }
    } else {
      i += char;
    }
  });
  if (i != '') {
    steps.push(parseInt(i));
  }
  
  let currentX = start[0];
  let currentY = start[1];
  let currentDir = 'R';
  for (let i=0; i<steps.length; i++) {
    let step = steps[i];
    if (step == 'R') {
      currentDir = rights[currentDir];
    } else if (step == 'L') {
      currentDir = lefts[currentDir];
    } else {
      // we're moving
      let totalMoves = step;
      let currentMove = 0;
      let stopped = false;
      while (currentMove < totalMoves || stopped) {
        let newX, newY;
        if (currentDir == 'R') {
          newX = currentX + 1;
          newY = currentY;
        } else if (currentDir == 'L') {
          newX = currentX - 1;
          newY = currentY;
        } else if (currentDir == 'D') {
          newX = currentX;
          newY = currentY + 1;
        } else if (currentDir == 'U') {
          newX = currentX;
          newY = currentY - 1;
        }
        // check if we're off the map
        let newDir = currentDir;
        if (newX < 0 || newY < 0 ||  newY >= grid.length || newX > grid[newY].length - 1 || grid[newY][newX] == ' ') {
          [newX, newY, newDir] = getNextPoint(currentX, currentY, currentDir);
        }
        if (grid[newY][newX] == '#') {
          break;
        } else {
          currentX = newX;
          currentY = newY;
          currentDir = newDir;
        }
        currentMove++;
      }
    }
  }

  const solution = ((currentY + 1) * 1000) + ((currentX + 1) * 4) + facing[currentDir]; 
  console.log(`Solution is ${solution}`); // wrong 102374 189095 76324 (too high)

});

getCurrentFace = (x, y) => {
  let keys = Object.keys(bounds);
  for (let i = 0; i< keys.length; i++) {
    let key = keys[i];
    let values = bounds[key];
    let [xMin, yMin] = values[0];
    let [xMax, yMax] = values[1];
    if (x >= xMin && y >= yMin && x <= xMax && y <= yMax) {
      return key;
    }
  }
};

const getNextPoint = (x, y, dir) => {
  let face = getCurrentFace(x, y);
  let bound = bounds[face];
  let [cx, cy] = [x - bound[0][0], y - bound[0][1]];

  if (face == '1') {
    if (dir == 'L') { //  -> 4
      return [0, 50 - cy - 1 + 100, 'R']
    } else if (dir == 'U') { //  -> 6
      return [0, 150 + cx, 'R']
    }
  } else if (face == '2') {
    if (dir == 'R') { // -> 5
      return [99, 50 - cy - 1 + 100, 'L']
    } else if (dir == 'U') { // -> 6
      return [cx, 199, 'U'];
    } else if (dir == 'D') { // -> 3
      return [99, 50 + cx, 'L'];
    }
  } else if (face == '3') {
    if (dir == 'R') { // -> 2
      return [100 + cy, 49, 'U']
    } else if (dir == 'L') { // -> 4
      return [cy, 100, 'D'];
    }
  } else if (face == '4') {
    if (dir == 'L') { // -> 1
      return [50, 50 - cy - 1, 'R'];
    } else if (dir == 'U') { // -> 3
      return [50, 50 + cx, 'R'];
    }
  } else if (face == '5') {
    if (dir == 'R') { // -> 2
      return [149, 50 - cy - 1, 'L'];
    } else if (dir == 'D') { // -> 6
      return [49, 150 + cx, 'L'];
    }
  } else if (face == '6') {
    if (dir == 'R') { // -> 5
      return [50 + cy, 149, 'U']
    } else if (dir == 'L') { // -> 1
      return [50 + cy, 0, 'D'];
    } else if (dir == 'D') { // -> 2
      return [100 + cx, 0, 'D'];
    }
  } 
  return [undefined, undefined, undefined];
}