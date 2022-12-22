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
        // console.log(grid[currentY][currentX], currentY, currentX);
        if (currentDir == 'R') {
          let newX = currentX + 1;
          let newY = currentY;
          if (newX > grid[newY].length - 1 || grid[newY][newX] == ' ') {
            // need to wrap
            let j = 0;
            while (grid[newY][j] == ' ') j++;
            newX = j;
          }
          if (grid[newY][newX] == '#') {
            break;
          } else {
            currentX = newX;
            currentY = newY;
          }
        } else if (currentDir == 'L') {
          let newX = currentX - 1;
          let newY = currentY;
          if (newX < 0 || grid[newY][newX] == ' ') {
            // need to wrap
            let j = grid[newY].length - 1;
            while (grid[newY][j] == ' ') j--;
            newX = j;
          }
          if (grid[newY][newX] == '#') {
            break;
          } else {
            currentX = newX;
            currentY = newY;
          }
        } else if (currentDir == 'D') {
          let newX = currentX;
          let newY = currentY + 1;
          if (newY > grid.length - 1 || grid[newY][newX] == ' ') {
            // need to wrap
            let j = 0;
            while (grid[j][newX] == ' ') j++;
            newY = j;
          }
          if (grid[newY][newX] == '#') {
            break;
          } else {
            currentX = newX;
            currentY = newY;
          }
        } else if (currentDir == 'U') {
          let newX = currentX;
          let newY = currentY - 1;
          if (newY < 0 || grid[newY][newX] == ' ') {
            // need to wrap
            let j = grid.length - 1;
            while (grid[j][newX] == ' ') j--;
            newY = j;
          }
          if (grid[newY][newX] == '#') {
            break;
          } else {
            currentX = newX;
            currentY = newY;
          }
        }
        currentMove++;
      }
    }
  }

  const solution = ((currentY + 1) * 1000) + ((currentX + 1) * 4) + facing[currentDir]; 
  console.log(`Solution is ${solution}`);

});