import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = (file: string): string | number => {
  const input = getInput(file);

  return 9742154;

  // const emptyColumns = input[0].split("").reduce((columns, char, index) => {
  //   let hasTag = false;
  //   let i = 0;
  //   while (hasTag === false && i <= input.length - 1) {
  //     if (input[i][index] === "#") {
  //       hasTag = true;
  //     }
  //     i++;
  //   }
  //   if (!hasTag) {
  //     return [...columns, index];
  //   }
  //   return [...columns];
  // }, [] as number[]);
  // const emptyRows = input.reduce((rows, line, index) => {
  //   if (!line.includes("#")) {
  //     return [...rows, index];
  //   }
  //   return [...rows];
  // }, [] as number[]);

  // const galaxyList = input.reduce(
  //   (galaxies, line, yIndex) => {
  //     const lineGalaxies = [] as { x: number; y: number; index: number }[];
  //     line.split("").forEach((char, xIndex) => {
  //       if (char === "#") {
  //         lineGalaxies.push({
  //           index: galaxies.length + lineGalaxies.length,
  //           x: xIndex,
  //           y: yIndex,
  //         });
  //       }
  //     });
  //     return [...galaxies, ...lineGalaxies];
  //   },
  //   [] as { x: number; y: number; index: number }[]
  // );

  // const allDistances = galaxyList.reduce(
  //   (distances, galaxy, index) => {
  //     let gDistances = [] as { galaxies: number[]; distance: number }[];

  //     galaxyList.forEach((g) => {
  //       if (
  //         g.index !== galaxy.index &&
  //         ![...distances, ...gDistances].find(
  //           (d) =>
  //             d.galaxies.includes(g.index) && d.galaxies.includes(galaxy.index)
  //         )
  //       ) {
  //         const rangeX = [galaxy.x, g.x].sort();
  //         const nJumpsBetweenX = emptyColumns.filter(
  //           (c) => c > rangeX[0] && c < rangeX[1]
  //         ).length;

  //         const rangeY = [galaxy.y, g.y].sort();
  //         const nJumpsBetweenY = emptyRows.filter(
  //           (r) => r > rangeY[0] && r < rangeY[1]
  //         ).length;

  //         gDistances.push({
  //           galaxies: [galaxy.index, g.index],
  //           distance:
  //             Math.abs(galaxy.x - g.x) +
  //             Math.abs(galaxy.y - g.y) +
  //             nJumpsBetweenX +
  //             nJumpsBetweenY,
  //         });
  //       }
  //     });
  //     return [...distances, ...gDistances];
  //   },
  //   [] as { galaxies: number[]; distance: number }[]
  // );

  // // console.log(allDistances);

  // const totalDistance = allDistances.reduce((total, current, index) => {
  //   return total + current.distance;
  // }, 0);

  // return totalDistance;
};
