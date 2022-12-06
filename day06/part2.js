const buffer = '<redacted>'.split('');

for (let i=14; i<buffer.length; i++) {
  let map = {};
  let allUnique = true;
  for (let j=i-14; j<i; j++) {
    if (map[buffer[j]]) {
      allUnique = false;
      break;
    } else {
      map[buffer[j]] = 1;
    }
  }
  if (allUnique) {
    console.log(`Solution is ${i}`);
    break;
  }

}