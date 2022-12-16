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

  // create two arrays for memoization
  // dp has our actual values at [minute]
  // prev has our prev values for dp
  let dp = [];
  let prev = [];
  for (let i=0; i<31; i++) {
    dp[i] = [];
    prev[i] = [];
    for (let j=0; j<flow.length; j++) {
      dp[i][j] = [];
      prev[i][j] = [];
      for (let k=0; k<(1<<flow.length); k++) {
        dp[i][j][k] = -Infinity;
        prev[i][j][k] = undefined;
      }
    }
  }

  // initialize for all the valves with a flow rate
  // that have a path to our start.
  for (let i=0; i<flow.length; i++) {
    let distance = paths['AA'];
    if (distance[flow[i]]) {
      dp[distance[flow[i]] + 1][i][1 << i] = 0;
    }
  }

  let solution = 0;

  // for each minute 1-30
  for (let i=1; i<31; i++) {
    for (let j=0; j < (1 << flow.length); j++) {
      for (let k=0; k<flow.length; k++) {
        // here we have a bitmask thing for dp
        // basically our 3d array has
        // i == step
        // k == value
        // j == bitmask
        const flowHere = getFlow(j, flow);
        const flowNext = dp[i-1][k][j] + flowHere;
        // flow rate increases
        // this part is straighforward and makes sense
        if (flowNext > dp[i][k][j]) { 
          dp[i][k][j] = flowNext;
          prev[i][k][j] = [i-1, k, j];
        }

        if (dp[i][k][j] > solution) {
          solution = dp[i][k][j];
        }

        // if this is 0, it means that it doesn't exist so we can skip
        if (((1 << k) & j) === 0) {
          continue;
        }

        for (let l = 0; l < flow.length; l++) {
          // skip if this already exists
          if (((1 << l) & j) !== 0) {
            continue;
          }
          let d = 0;
          if (paths[flow[k]]) {
            if (paths[flow[k]][flow[l]]) {
              d = paths[flow[k]][flow[l]];
              if (i + d + 1 >= 31) { // takes us outside of our number of steps
                continue;
              }
            }
          }
          const curVal = dp[i][k][j] + flowHere * (d + 1);
          // last tricky part - (j | (1 << l)) gives us the bitmask
          // for each valve in flow
          // this is what we use for the optimizations above
          // and if it's higher, we set dp + prev like above.
          if (curVal > dp[i+d+1][l][j | (1 << l)]) {
            dp[i + d + 1][l][j | (1 << l)] = curVal;
            prev[i + d + 1][l][j | (1 << l)] = [i, k, j];
          }
        }
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