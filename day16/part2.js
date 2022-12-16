const fs = require('fs');

const graph = {};
const valves = [];

fs.readFile('./input', 'utf-8', (_, data) => {
  const lines = data.split('\n');
  lines.forEach(line => {
    const [left, right] = line.split('; ');
    const valve = left.split(' ')[1];
    const rate = parseInt(left.split('=')[1]);
    const tunnels = right.replace(/(tunnel|tunnels) (lead|leads) to (valve|valves) /, '').split(', ');
    valves.push({valve, rate});
    graph[valve] = {valve, rate, tunnels};
  });
  
  const paths = {};

  // paths will be the distance to each node from each node.
  for(let i=0; i<valves.length; i++) {
    let valve = valves[i];
    const dist = {};
    let queue = [valve.valve];
    let v = {};
    dist[valve.valve] = 0;
    v[valve.valve] = 1;

    while (queue.length > 0) {
      let name = queue.shift();
      for (let j=0; j<graph[name].tunnels.length; j++) {
        let tunnel = graph[name].tunnels[j];
        if (!v[tunnel]) {
          v[tunnel] = 1;
          dist[tunnel] = dist[name] + 1;
          queue.push(tunnel);
        }
      }
    }
    paths[valve.valve] = dist;
  }

  // get all the valves with flow
  const flow = valves.filter((a) => a.rate > 0).map(a => a.valve);

  let dp = [];
  let prev = [];
  for (let i=0; i<31; i++) {
    dp[i] = [];
    prev[i] = [];
    for (let j=0; j<flow.length; j++) {
      dp[i][j] = [];
      prev[i][j] = [];
      for (let k=0; k<(1<<flow.length); k++) {
        dp[i][j][k] = -99999999;
        prev[i][j][k] = undefined;
      }
    }

  }
  for (let i=0; i<flow.length; i++) {
    let distance = paths['AA'];
    if (distance[flow[i]]) {
      dp[distance[flow[i]] + 1][i][1 << i] = 0;
    }
  }

  let solution = 0;

  for (let i=1; i<31; i++) { // 30 minutes!
    for (let j=0; j < (1 << flow.length); j++) {
      for (let k=0; k<flow.length; k++) {
        const flowHere = getFlow(j, flow);
        const flowPrev = dp[i-1][k][j] + flowHere;
        if (flowPrev > dp[i][k][j]) {
          dp[i][k][j] = flowPrev;
          prev[i][k][j] = [i-1, k, j];
        }

        if (((1 << k) & j) === 0) {
          continue;
        }

        for (let l = 0; l < flow.length; l++) {
          if ((( 1 << l) & j) !== 0) {
            continue;
          }
          let d = 0;
          if (paths[flow[k]]) {
            if (paths[flow[k]][flow[l]]) {
              d = paths[flow[k]][flow[l]];
              if (i + d + 1 >= 31) {
                continue;
              }
            }
          }

          // set dp + prev here!
          const curVal = dp[i][k][j] + flowHere * (d + 1);
          if (curVal > dp[i+d+1][l][j | (1 << l)]) {
            dp[i + d + 1][l][j | (1 << l)] = curVal;
            prev[i + d + 1][l][j | (1 << l)] = [i, k, j];
          }
        }
      }
    }
  }

  for (let i=0; i < 1 << flow.length; i++) {
    for (let j=0; j < 1 << flow.length; j++) {
      if ((i & j) !== j) {
        continue;
      }

      // get optimal 26 minute for each valve with flow
      // for both me and elephant.
      let x = -99999999;
      let y = -99999999;

      for (let k=0; k<flow.length; k++) {
        if (dp[26][k][j] > x) {
          x = dp[26][k][j];
        }
      }

      for (let k=0; k<flow.length; k++) {
        if (dp[26][k][i & ~j] > y) {
          y = dp[26][k][i & ~j];
        }
      }

      if (x + y > solution) {
        solution = x + y;
      }
    }
  }
  console.log(`Solution is ${solution}`);
});


const getFlow = (mask, flow) => {
  let ret = 0;

  for (let i=0; i<flow.length; i++) {
    if (((1 << i) & mask) !== 0) {
      ret += graph[flow[i]].rate;
    }
  }
  return ret;
}