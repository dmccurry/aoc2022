const fs = require('fs');

fs.readFile('./input', 'utf-8', (_, data) => {
  const dirs = {};
  dirs['/'] = [];
  let currentDir = '/';

  const commands = data.split('\n');
  for (let i=1; i<commands.length; i++) {
    const cmd = commands[i];
    if (cmd.charAt(0) == '$') {
      if (cmd == '$ cd ..') {
        let ds = currentDir.split('/');
        ds.pop();
        currentDir = ds.join('/');
      } else if (cmd.indexOf('cd') > 0) {
        currentDir += (currentDir == '/') ? ('') : ('/');
        currentDir += cmd.split(' ')[2];
        dirs[currentDir] = [];
      }
    } else {
      dirs[currentDir].push(cmd);
    }
  }
  const sizes = {};

  Object.keys(dirs).forEach(d => {
    sizes[d] = getSize(dirs, d);
  });
  
  const max = 100000;
  let sum = 0;

  Object.values(sizes).forEach(i => {
    if (i < max) sum += i;
  });
  console.log(`Solution is ${sum}`);

});

const getSize = (dirList, dir) => {
  const list = dirList[dir];
  let size = 0;
  for (let i = 0; i<list.length; i++) {
    if (list[i].indexOf('dir') === 0) {
      let subDir = dir == '/' ? dir + '' : dir + '/';
      subDir = subDir + list[i].split(' ')[1];
      size += getSize(dirList, subDir);
    } else {
      size += parseInt(list[i].split(' ')[0]);
    }
  }
  return size;
}