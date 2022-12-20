const fs = require('fs');
const blueprints = [];


fs.readFile('./input', 'utf-8', (_, data) => {
  const lines = data.split('\n');
  lines.forEach(line => {
    const [blueprint, ore, clay, obs, obs2, geode, geode2] = line.match(new RegExp(/(\d+)/, "ig")).map(n => parseInt(n));
    blueprints.push({
      id: blueprint,
      ore,
      clay,
      obsidian: {
        ore: obs,
        clay: obs2
      },
      geode: {
        ore: geode,
        obsidian: geode2
      },
      answer: -Infinity,
      quality: -Infinity
    });
  });
  step(blueprints[0], 1, 0, 0, 0, 0, 0, 0, 0, 0);
  step(blueprints[1], 1, 0, 0, 0, 0, 0, 0, 0, 0);
  step(blueprints[2], 1, 0, 0, 0, 0, 0, 0, 0, 0);
  
  let s = blueprints[0].answer * blueprints[1].answer * blueprints[2].answer;
  console.log(`Solution is ${s}`);
});

const step = (blueprint, oreRobots, clayRobots, obsidianRobots, geodeRobots, ore, clay, obsidian, geode, minute) => {

  // base case
  if (minute == 31) {
    // add a last geode, that's all we care about
    geode += geodeRobots;
    if (geode > blueprint.answer) {
      blueprint.answer = geode;
    }
    return;
  }

  // ugh we need to optimize
  let tmpRobots = geodeRobots;
  let tmpGeodes = geode;
  for (let i=minute; i<32; i++) {
    tmpGeodes+= tmpRobots;
    tmpRobots++;
  }
  if (tmpGeodes < blueprint.answer) return;

  const canBuildGeode = ore >= blueprint.geode.ore && obsidian >= blueprint.geode.obsidian;
  const canBuildObsidian = ore >= blueprint.obsidian.ore && clay >= blueprint.obsidian.clay;
  const canBuildClay = ore >= blueprint.clay;
  const canBuildOre = ore >= blueprint.ore;

  // always build a geode if you can
  if (canBuildGeode) {
    ore = ore - blueprint.geode.ore;
    obsidian = obsidian - blueprint.geode.obsidian;
  } else {
    // figure out what we should build
    const shouldBuildObsidian = obsidianRobots < blueprint.geode.obsidian;
    const shouldBuildClay = clayRobots < blueprint.obsidian.clay;
    const shouldBuildOre = oreRobots < Math.max(blueprint.ore, blueprint.clay, blueprint.obsidian.ore, blueprint.geode.ore);
    if (canBuildObsidian && shouldBuildObsidian) {
      step(blueprint, oreRobots, clayRobots, obsidianRobots + 1, geodeRobots, ore + oreRobots - blueprint.obsidian.ore, clay + clayRobots - blueprint.obsidian.clay, obsidian + obsidianRobots, geode + geodeRobots, minute + 1);
    }

    if (canBuildClay && shouldBuildClay) {
      step(blueprint, oreRobots, clayRobots + 1, obsidianRobots, geodeRobots, ore + oreRobots - blueprint.clay, clay + clayRobots, obsidian + obsidianRobots, geode + geodeRobots, minute + 1);
    }

    if (canBuildOre && shouldBuildOre) {
      step(blueprint, oreRobots + 1, clayRobots, obsidianRobots, geodeRobots, ore + oreRobots - blueprint.ore, clay + clayRobots, obsidian + obsidianRobots, geode + geodeRobots, minute + 1);
    }
  }
  ore += oreRobots;
  clay+= clayRobots;
  obsidian += obsidianRobots;
  geode += geodeRobots;

  if (canBuildGeode) {
    geodeRobots++;
  }

  step(blueprint, oreRobots, clayRobots, obsidianRobots, geodeRobots, ore, clay, obsidian, geode, minute+1);
}