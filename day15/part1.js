const fs = require('fs');

const sensors = [];
const beaconMap = {};
const distanceMap = {};

let minX = Infinity;
let maxX = 0;
let maxRange = 0;

let y = 2000000;

fs.readFile('./input', 'utf-8', (_, data) => {
  const lines = data.split('\n');
  lines.forEach(line => {
    const [s, b] = line.split(': ');
    const [sx, sy] = s.split(', ');
    const [bx, by] = b.split(', ');
    const sensorX = parseInt(sx.replace('Sensor at x=', ''));
    const sensorY = parseInt(sy.replace('y=', ''));
    const beaconX = parseInt(bx.replace('closest beacon is at x=', ''));
    const beaconY = parseInt(by.replace('y=', ''));

    const distance = getDistance(sensorX, sensorY, beaconX, beaconY);
    let yMin = sensorY - distance;
    let yMax = sensorY + distance;
    let validSensor = false;
    if (yMin <= y && y <= yMax) {
      validSensor = true;
    } else if (yMax <= y && y <= yMin) {
      validSensor = true;
    }
    if (validSensor) {
      beaconMap[`${sensorX},${sensorY}`] = `${beaconX},${beaconY}`;
      distanceMap[`${sensorX},${sensorY}`] = distance;
      sensors.push(`${sensorX},${sensorY}`);
    }
    maxX = Math.max(sensorX, beaconX, maxX);
    minX = Math.min(sensorX, beaconX, minX);
    maxRange = Math.max(distance, maxRange);
  });

  let n = 0;
  for (let x=minX-maxRange*2; x<=maxX+maxRange*2; x++) {
    let p = `${x},${y}`;
    if (Object.values(beaconMap).indexOf(p) >= 0) {
      continue;
    }

    // otherwise check to see if it's in the area < distanaceMap
    // from any sensor
    for (let i=0; i<sensors.length; i++) {
      const [sx, sy] = sensors[i].split(',').map(a => parseInt(a));
      const d = getDistance(sx, sy, x, y);
      if (d <= distanceMap[sensors[i]]) {
        // too close to a sensor
        n++;
        break;
      }
    }
  }
  console.log(`Solution is ${n}`);
});

const getDistance = (x1, y1, x2, y2) => {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}