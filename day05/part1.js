const fs = require('fs');

fs.readFile('./input', 'utf-8', (_, data) => {

  let [crates, steps] = data.split('\n\n');
  let stacks = [];

  while (crates.indexOf('    ') >= 0) {
    crates = crates.replace(/    \[/ig, '[.] [');
    crates = crates.replace(/\]    /ig, '] [.]');  
  }
  cratesSplit = crates.split('\n');

  cratesSplit = cratesSplit.reverse();
  let nCrates = cratesSplit.shift().replace(/ /ig, '').length;
  for (let i = 0; i<nCrates; i++) {
    stacks[i] = [];
  }


  for (let i=0; i<cratesSplit.length; i++) { 
    const row = cratesSplit[i].split(' ').map(x => x.replace('[', '')).map(x => x.replace(']', ''));
    
    for (let j=0; j<row.length; j++) {
      if (row[j] != '.') {
        stacks[j].push(row[j]);
      }
    }
  }
  const stepsSplit = steps.split('\n');
  for (let i=0; i<stepsSplit.length; i++) {
    let [move, num, from, source, to, dest] = stepsSplit[i].split(' ');
    num = parseInt(num);
    source = parseInt(source) - 1;
    dest = parseInt(dest) - 1;
    
    for (let j = 0; j < num; j++) {
      stacks[dest].push(stacks[source].pop());
    }
  }

  console.log(`Solution is ${stacks.reduce((a, b) => a + b.pop(), '')}`);
});