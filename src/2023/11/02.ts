import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const input = prior.getInput(file);

  const emptyColumns = input[0].split("").reduce((columns, char, index) => {
    let hasTag = false;
    let i = 0;
    while (hasTag === false && i <= input.length - 1) {
      if (input[i][index] === "#") {
        hasTag = true;
      }
      i++;
    }
    if (!hasTag) {
      return [...columns, index];
    }
    return [...columns];
  }, [] as number[]);
  const emptyRows = input.reduce((rows, line, index) => {
    if (!line.includes("#")) {
      return [...rows, index];
    }
    return [...rows];
  }, [] as number[]);

  const expanditure = 1000000;

  const galaxyList = input.reduce(
    (galaxies, line, yIndex) => {
      const lineGalaxies = [] as { x: number; y: number; index: number }[];
      line.split("").forEach((char, xIndex) => {
        if (char === "#") {
          lineGalaxies.push({
            index: galaxies.length + lineGalaxies.length,
            x: xIndex,
            y: yIndex,
          });
        }
      });
      return [...galaxies, ...lineGalaxies];
    },
    [] as { x: number; y: number; index: number }[]
  );

  const expandedGalaxyList = galaxyList.map((g, index) => {
    const nJumpsX = emptyColumns.filter((c) => c <= g.x).length;
    const nJumpsY = emptyRows.filter((r) => r <= g.y).length;

    const expandedG = {
      index: g.index,
      x: nJumpsX * expanditure + g.x - nJumpsX,
      y: nJumpsY * expanditure + g.y - nJumpsY,
    };
    if (index % 100 === 0) {
      console.log(index, expandedG);
    }
    return expandedG;
  });

  console.log("done Expanding");
  let expandedGalaxyListOptions = [...expandedGalaxyList]
    .reverse()
    .reduce((opts, item) => {
      let nOpts = [] as number[][];
      new Array(item.index).fill("").forEach((_, _index) => {
        if (_index < item.index) nOpts.push([item.index, _index]);
      });
      return [...opts, ...nOpts];
    }, [] as number[][]);

  const allDistances = expandedGalaxyListOptions.map((opt) => {
    const from = expandedGalaxyList.find((g) => g.index === opt[0]);
    const to = expandedGalaxyList.find((g) => g.index === opt[1]);

    if (!(from && to)) {
      return 0;
    }
    const dX = Math.abs(from.x - to.x);
    const dY = Math.abs(from.y - to.y);
    const distance = dX + dY;

    return distance;
  });

  const totalDistance = allDistances.reduce((total, current, index) => {
    return total + current;
  }, 0);
  return totalDistance;
};
