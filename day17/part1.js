const fs = require('fs');

fs.readFile('./input', 'utf-8', (_, data) => {
  const jets = data.split('');
  const cave = {};
  const rocks = [{
    height: 1,
    width: 4,
    points: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0]
    ]
  }, {
    height: 3,
    width: 3,
    points: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2]
    ],
  }, {
    height: 3,
    width: 3,
    points: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [2, 2]
    ]
  }, {
    height: 4,
    width: 1,
    points: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3]
    ]
  }, {
    height: 2,
    width: 2,
    points: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1]
    ]
  }];

  let num = 0;
  let rockIndex = 0;
  let jetIndex = 0;
  let currentHeight = 0;

  while (num < 2022) {
    // console.log(rockIndex);
    let rock = rocks[rockIndex];
    let rockX = 2;
    let rockY = currentHeight + 4;
    let settled = false;

    while (!settled) {
      // jet first
      let nextJet = jets[jetIndex];
      jetIndex++;
      if (jetIndex == jets.length) jetIndex = 0;

      if (nextJet == '>') {
        if (canMoveTo(rockX + 1, rockY, rock, cave)) {
          // console.log('r');
          rockX++;
        }
      } else {
        if (canMoveTo(rockX - 1, rockY, rock, cave)) {
          // console.log('l');
          rockX--;
        }
      }

      // and down
      if (canMoveTo(rockX, rockY - 1, rock, cave)) {
        // console.log('d');
        rockY--;
      } else {
        settled = true;
      }
    }

    // settled, set cave, move to next
    for (let i=0; i<rock.points.length; i++) {
      let x = rock.points[i][0] + rockX;
      let y = rock.points[i][1] + rockY;
      if (y > currentHeight) currentHeight = y;
      cave[`${x},${y}`] = 1;
    }
    rockIndex++;
    if (rockIndex == rocks.length) rockIndex = 0;
    num++;
  }
  // console.log(cave);
  console.log(currentHeight);
});
const canMoveTo = (x, y, rock, cave) => {
  for (let i=0; i<rock.points.length; i++) {
    let newX = rock.points[i][0] + x;
    let newY = rock.points[i][1] + y;
    if (newX < 0) return false;
    if (newY <= 0) return false;
    if (newX > 6) return false;
    let xy = `${rock.points[i][0] + x},${rock.points[i][1] + y}`;
    if (cave[xy]) return false;
  }
  return true;
};