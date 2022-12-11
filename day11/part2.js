const fs = require('fs');

class Monkey {
  constructor(items, operation, test, t, f) {
    this.items = items;
    this.operation = operation;
    this.test = test;
    this.t = t;
    this.f = f;
    this.inspections = 0;
  }
}

fs.readFile('./input', 'utf-8', (_, data) => {
  let currentRound = 0;
  const monkeys = [];
  const monkeysText = data.split('\n\n');
  let modProduct = 1;
  monkeysText.forEach(monkeyText => {
    const monkeySplit = monkeyText.split('\n');
    const items = monkeySplit[1].replace('  Starting items: ', '').replace(/,/ig).split(' ').map(i => parseInt(i));
    const operation = monkeySplit[2].replace('  Operation: new = old ', '');
    const test = parseInt(monkeySplit[3].replace('  Test: divisible by ', ''));
    modProduct *= test;
    const t = parseInt(monkeySplit[4].replace('    If true: throw to monkey ', ''));
    const f = parseInt(monkeySplit[5].replace('    If false: throw to monkey ', ''));
    monkeys.push(new Monkey(items, operation, test, t, f));
  });


  while (currentRound < 10000) {
    for (let i=0; i<monkeys.length; i++) {
      const currentMonkey = monkeys[i];
      while(currentMonkey.items.length) {
        // inspect
        let worry = currentMonkey.items.shift();
        worry = worry % modProduct; // product of all the mods to avoid `Infinity`
        let op = currentMonkey.operation.split(' ')[0];
        let amt = currentMonkey.operation.split(' ')[1];
        if (amt == 'old') amt = worry;
        else amt = parseInt(amt);
        if (op == '*') worry = worry * amt;
        if (op == '+') worry = worry + amt;
        if (worry % currentMonkey.test == 0) {
          monkeys[currentMonkey.t].items.push(worry);
        } else {
          monkeys[currentMonkey.f].items.push(worry);
        }
        currentMonkey.inspections++;
      }
    }


    currentRound++;
  }
  monkeys.sort((a, b) => {
    return b.inspections - a.inspections;
  });
  console.log(`Solution is ${monkeys[0].inspections * monkeys[1].inspections}`);
});