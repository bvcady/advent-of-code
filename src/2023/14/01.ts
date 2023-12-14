import { readFileSync } from "fs";
import { after } from "node:test";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");

  return fileContent.split("\n");
};

type Pos = { x: number; y: number };

export const solution = (file: string): string | number => {
  const input = getInput(file).map((line) => {
    // @ts-ignore
    return line.replaceAll("#", "■").replaceAll("O", "◯");
  });

  const floorHeight = input.length;

  const blockades = input.reduce((blocks, line, y) => {
    let nBlocks = [] as Pos[];
    line.split("").forEach((char, x) => {
      if (char === "■") {
        nBlocks.push({ x, y });
      }
    });
    return [...blocks, ...nBlocks];
  }, [] as Pos[]) as Pos[];

  const initialBoulders = input.reduce((boulders, line, y) => {
    let nBlocks = [] as Pos[];
    line.split("").forEach((char, x) => {
      if (char === "◯") {
        nBlocks.push({ x, y });
      }
    });
    return [...boulders, ...nBlocks];
  }, [] as Pos[]) as Pos[];

  let afterSlide = [] as Pos[];

  initialBoulders.forEach((b) => {
    let y = b.y;
    let blockedAbove = false;

    while (!blockedAbove && y >= 0) {
      const hasAbove = [...afterSlide, ...blockades].find(
        (c) => c.y === y - 1 && c.x === b.x
      );

      if (hasAbove || y - 1 < 0) {
        blockedAbove = true;
      } else {
        y--;
      }
    }
    afterSlide.push({ x: b.x, y });
  });

  return afterSlide.reduce(
    (total, boulder) => floorHeight - boulder.y + total,
    0
  );
};
