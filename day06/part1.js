const buffer = '<redacted>'.split('');

for (let i=3; i<buffer.length; i++) {
  let a = buffer[i];
  let b = buffer[i-1];
  let c = buffer[i-2];
  let d = buffer[i-3];

  if (a != b && a != c && a != d && b !=c && b !=d && c != d) {
    console.log(`Solution is ${i+1}`);
    break;
  }
}