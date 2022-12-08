const fs = require('fs');

fs.readFile('./input', 'utf-8', (_, data) => {
  const rows = data.split('\n');
  const trees = [];
  rows.forEach(row => {
    trees.push(row.split('').map(r => parseInt(r)));
  });

  let maxScore = 0;
  
  for (let i=1; i<trees.length - 1; i++) {
    for (let j=1; j<trees[i].length - 1; j++) {
      let score = getScore(i, j, trees);
      if (score > maxScore) {
        maxScore = score;
      }
    }
  }
  console.log(`Solution is ${maxScore}`);
});

const getScore = (i, j, trees) => {
  const height = trees[i][j];
  
  let nLeft = 0;
  for (let l=i-1; l>=0; l--) {
    if (trees[l][j] < height) nLeft++;
    else {
      nLeft++;
      break;
    }
  }

  let nRight = 0;
  for (let l=i+1; l<trees.length; l++) {
    if (trees[l][j] < height) nRight++;
    else {
      nRight++;
      break;
    }
  }

  let nTop = 0;
  for (let l=j-1; l >= 0; l--) {
    if (trees[i][l] < height) nTop++;
    else {
      nTop++;
      break;
    }
  }

  let nBottom = 0;
  for (let l=j+1; l<trees[i].length; l++) {
    if (trees[i][l] < height) nBottom++;
    else {
      nBottom++;
      break;
    }
  }
  return nLeft * nRight * nTop * nBottom;
}