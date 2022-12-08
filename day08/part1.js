const fs = require('fs');

fs.readFile('./input', 'utf-8', (_, data) => {
  const rows = data.split('\n');
  const trees = [];
  rows.forEach(row => {
    trees.push(row.split('').map(r => parseInt(r)));
  });
  let nVisible = trees.length * 2 + trees[0].length * 2 - 4;
  
  for (let i=1; i<trees.length - 1; i++) {
    for (let j=1; j<trees[i].length - 1; j++) {
      if (isVisible(i, j, trees)) {
        nVisible++;
      }
    }
  }
  console.log(`Solution is ${nVisible}`);
});

const isVisible = (i, j, trees) => {
  const height = trees[i][j];
  let visible = true;
  for (let l=0; l<i; l++) {
    if (trees[l][j] >= height) visible=false;
  }
  if (visible) return true;

  visible = true;
  for (let l=i+1; l<trees.length; l++) {
    if (trees[l][j] >= height) visible=false;
  }
  if (visible) return true;

  visible = true;
  for (let l=0; l<j; l++) {
    if (trees[i][l] >= height) visible=false;
  }
  if (visible) return true;

  visible = true;
  for (let l=j+1; l<trees[i].length; l++) {
    if (trees[i][l] >= height) visible=false;
  }
  return visible;
}