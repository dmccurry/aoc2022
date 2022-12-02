const fs = require('fs');

const wins = {
  'A': 'Y',
  'B': 'Z',
  'C': 'X'
};

const equals = {
  'A': 'X',
  'B': 'Y',
  'C': 'Z'
};

const points = {
  'X': 1,
  'Y': 2,
  'Z': 3
};

fs.readFile('./input', 'utf-8', (_, data) => {
  const rounds = data.split('\n');
  let score = 0;

  rounds.forEach(r => {
    score += getScore(r);
  });

  console.log(`Solution is ${score}`);
});

const getScore = (line) => {
  let parts = line.split(' ');
  let me = parts[1];
  let you = parts[0];

  if (wins[you] == me) {
    return 6 + points[me];
  } else if (equals[you] == me) {
    return 3 + points[me];
  }
  return points[me];
}
