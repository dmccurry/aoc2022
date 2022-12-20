const fs = require('fs');
const graph = {};
fs.readFile('./input', 'utf-8', (_, data) => {
  const jets = data.split('');
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

  const heights = [];

  let num = 0;
  let rockIndex = 0;
  let jetIndex = 0;
  let currentHeight = 0;
  let cycles = 4000;
  let prevHeight = 0;

  while (num < cycles) {
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
        if (canMoveTo(rockX + 1, rockY, rock)) {
          rockX++;
        }
      } else {
        if (canMoveTo(rockX - 1, rockY, rock)) {
          rockX--;
        }
      }

      // and down
      if (canMoveTo(rockX, rockY - 1, rock)) {
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
      graph[`${x},${y}`] = 1;
    }
    rockIndex++;
    if (rockIndex == rocks.length) rockIndex = 0;
    num++;  
    heights.push(currentHeight - prevHeight);
    prevHeight = currentHeight;
  }
  // find a sequence in heights
  const [sequence, i] = getHeightSequence(heights);
  const pattern = getPattern(sequence);
  const patternHeight = pattern.reduce((s, v) => s + v);
  const count = 1000000000000;
  const numPatterns = Math.floor((count - i) / pattern.length);
  const remaining = (count - i) % pattern.length;
  const beforeHeight = pattern.slice(0, remaining).reduce((a, b) => a + b);
  const afterHeight = heights.slice(0, i).reduce((a, b) => a + b);
  const solution = (beforeHeight + afterHeight) + (numPatterns * patternHeight);
  console.log(`Solution is ${solution}`);
});
const canMoveTo = (x, y, rock) => {
  for (let i=0; i<rock.points.length; i++) {
    let newX = rock.points[i][0] + x;
    let newY = rock.points[i][1] + y;
    if (newX < 0) return false;
    if (newY <= 0) return false;
    if (newX > 6) return false;
    if (graph[`${newX},${newY}`]) return false;
  }
  return true;
};

const getPattern = (sequence) => {
  const dp = [];
  for (let i=0; i<sequence.length; i++) {
    dp[i] = 0;
  }
  for (let i = 1; i < dp.length; i++) {
      let k = dp[i - 1];
      let done = false;
      while (!done) {
          if (sequence[i] === sequence[k]) {
              dp[i] = k + 1;
              done = true;
          } else if (k === 0) {
              dp[i] = 0;
              done = true;
          } else {
              k = dp[k - 1];
          }
      }
  }
  return sequence.slice(0, sequence.length - dp[dp.length - 1]);
};

const getHeightSequence = (heights) => {
  const dp = [];
  for (let i=0; i<heights.length+1; i++) {
    dp[i] = [];
    for (let j=0; j<heights.length+1; j++) {
      dp[i][j] = 0;
    }
  }
  let seqLength = 0;
  let index = 0;

  for (let i=0; i<heights.length; i++) {
    for (let j = i + 2; j <= heights.length; j++) {
      if (heights[i] === heights[j - 1] && dp[i][j - 1] < j - i) {
          dp[i + 1][j] = dp[i][j - 1] + 1;
          if (dp[i + 1][j] > seqLength) {
              seqLength = dp[i + 1][j];
              index = Math.max(i + 1, index);
          }
      } else {
          dp[i + 1][j] = 0;  
      }
    }
  }
  return [heights.slice(index - seqLength, index), index - seqLength];
};