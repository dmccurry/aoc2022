const fs = require('fs');

const sensors = [];
const beaconMap = {};
const distanceMap = {};

let maxVal = 4000000;

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
    // we need to check if yMin..yMax is in minVal..maxVal
    beaconMap[`${sensorX},${sensorY}`] = `${beaconX},${beaconY}`;
    distanceMap[`${sensorX},${sensorY}`] = distance;
    sensors.push(`${sensorX},${sensorY}`);
  });

  
  for (let y = 0; y <= maxVal; y++) {
    const ranges = [];
    for (let i=0; i<sensors.length; i++) {
      let [sx, sy] = sensors[i].split(',').map(p => parseInt(p));

      // for each sensor, get the covered points for y.
      const width = distanceMap[sensors[i]] - Math.abs(sy - y);
      if ( width > 0) {
        ranges.push([sx - width, sx + width]); // range we cover
      }
    }

    // sort the ranges by startx
    ranges.sort((a, b) => a[0] - b[0]);
    const regions = [];
    // combine ranges into regions
    let start = ranges[0];
    for (let i=0; i<ranges.length; i++) {
      let next = ranges[i];
      if (start[1] >= next[0] - 1) { // either continuous or overlaps
          start = [start[0], Math.max(start[1], next[1])];
      } else {
        // no overlap, distinct regions
        regions.push(start);
        start = next;
      }
    }
    regions.push(start);

    if (regions.length > 1) {
      // two regions means we have a point not overlapped.
      const ry = y;
      const rx = regions[0][1] + 1;
      console.log(`Solution is ${(rx * 4000000) + y}`);
      break;
    }
  }

  
});

const getDistance = (x1, y1, x2, y2) => {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}