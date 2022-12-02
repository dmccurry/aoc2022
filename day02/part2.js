const fs = require('fs');

const wins = {
  "A": "Y",
  "B": "Z",
  "C": "X"
};
const loses = {
  "A": "Z",
  "B": "X",
  "C": "Y"
}
;
const points = {
  "X": 1,
  "Y": 2,
  "Z": 3,
  "A": 1,
  "B": 2,
  "C": 3
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

  if (me == "Z") {
    return 6 + points[wins[you]];
  } else if (me == "Y") {
    return 3 + points[you];
  }
  return points[loses[you]];
}