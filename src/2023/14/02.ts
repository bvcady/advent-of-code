import * as prior from "./01";
import { DirectionalMemoization } from "../../../utils/customMemoize";

type Pos = { x: number; y: number };

export const solution = (file: string): string | number => {
  const input = prior.getInput(file).map((line) => {
    // @ts-ignore
    return line.replaceAll("#", "■").replaceAll("O", "◯");
  }) as string[];

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

  const slideNorth = (inputBoulders: Pos[]) => {
    // console.log("Sliding NORTH");
    let afterSlide = [] as Pos[];
    inputBoulders
      .sort((a, b) => a.y - b.y)
      .forEach((b) => {
        let y = b.y;
        let blockedNorth = false;
        const slide = (
          afterSlide: Pos[],
          boulder: Pos,
          direction: string
        ): Pos => {
          while (!blockedNorth && y >= 0) {
            const hasNorth = [...afterSlide, ...blockades].find(
              (c) => c.y === y - 1 && c.x === boulder.x
            );

            if (hasNorth || y - 1 < 0) {
              blockedNorth = true;
            } else {
              y--;
            }
          }
          return { x: boulder.x, y };
        };
        afterSlide.push(slide(afterSlide, b, "NORTH"));
      });
    return afterSlide as Pos[];
  };

  const slideEast = (inputBoulders: Pos[]) => {
    // console.log("Sliding EAST");
    let afterSlide = [] as Pos[];
    inputBoulders
      .sort((a, b) => b.x - a.x)
      .forEach((b) => {
        let x = b.x;
        let blockedEast = false;
        const slide = (
          afterSlide: Pos[],
          boulder: Pos,
          direction: string
        ): Pos => {
          while (!blockedEast && x < input[0].length) {
            const hasEast = [...afterSlide, ...blockades].find(
              (c) => c.x === x + 1 && c.y === boulder.y
            );

            if (hasEast || x + 1 >= input[0].length) {
              blockedEast = true;
            } else {
              x++;
            }
          }
          return { y: boulder.y, x };
        };
        afterSlide.push(slide(afterSlide, b, "EAST"));
      });
    return afterSlide as Pos[];
  };
  const slideSouth = (inputBoulders: Pos[]) => {
    // console.log("Sliding SOUTH");
    let afterSlide = [] as Pos[];
    inputBoulders
      .sort((a, b) => b.y - a.y)
      .forEach((b) => {
        let y = b.y;
        let blockedSouth = false;
        const slide = (
          afterSlide: Pos[],
          boulder: Pos,
          direction: string
        ): Pos => {
          while (!blockedSouth && y < input.length) {
            const hasSouth = [...afterSlide, ...blockades].find(
              (c) => c.y === y + 1 && c.x === boulder.x
            );

            if (hasSouth || y + 1 >= input.length) {
              blockedSouth = true;
            } else {
              y++;
            }
          }
          return { x: boulder.x, y };
        };
        afterSlide.push(slide(afterSlide, b, "SOUTH"));
      });
    return afterSlide as Pos[];
  };
  const slideWest = (inputBoulders: Pos[]) => {
    // console.log("Sliding WEST");
    let afterSlide = [] as Pos[];
    inputBoulders
      .sort((a, b) => a.x - b.x)
      .forEach((b) => {
        let x = b.x;
        let blockedWest = false;
        const slide = (
          afterSlide: Pos[],
          boulder: Pos,
          direction: string
        ): Pos => {
          while (!blockedWest && x >= 0) {
            const hasWest = [...afterSlide, ...blockades].find(
              (c) => c.x === x - 1 && c.y === boulder.y
            );

            if (hasWest || x - 1 < 0) {
              blockedWest = true;
            } else {
              x--;
            }
          }
          return { y: boulder.y, x };
        };
        afterSlide.push(slide(afterSlide, b, "WEST"));
      });
    return afterSlide as Pos[];
  };

  const memo = new DirectionalMemoization();

  const slideInDirection = memo.memoize((n: number, inputBoulders: Pos[]) => {
    if (n % 4 === 0) return slideNorth(inputBoulders);
    if (n % 4 === 1) return slideWest(inputBoulders);
    if (n % 4 === 2) return slideSouth(inputBoulders);
    if (n % 4 === 3) return slideEast(inputBoulders);
    return [];
  });

  let currentBoulders = initialBoulders;

  const printFloor = () => {
    console.log(
      input
        .map((line, y) =>
          line
            // @ts-ignore
            .replaceAll("◯", ".")
            .split("")
            .map((char, x) =>
              currentBoulders.find((b) => b.x === x && b.y === y) ? "◯" : char
            )
            .join("")
        )
        .join("\n")
    );
    console.log("\n");
  };

  let i = 0;
  let check = true;

  let steps = [] as number[];

  while (check) {
    const newBoulders = slideInDirection(i % 4, currentBoulders);
    if (!newBoulders) {
      check = false;
      console.log(i, "loop recognized");
    } else {
      currentBoulders = newBoulders;
      steps.push(
        currentBoulders.reduce(
          (total, boulder) => floorHeight - boulder.y + total,
          0
        )
      );
    }
    if (i % 100 === 0) {
      console.log(memo.stores.map((s) => s.size));
    }
    i++;
  }

  console.log("steps", steps.join(" -- "));

  const stepsUntilLoopRecognized = steps.length;
  console.log({ stepsUntilLoopRecognized });
  memo.clearMemo();

  i = 0;
  check = true;

  const loopValues = [] as number[];

  while (check) {
    const newBoulders = slideInDirection(i % 4, currentBoulders);
    if (!newBoulders) {
      console.log(i, "end of loop");
      check = false;
    } else {
      currentBoulders = newBoulders;
      loopValues.push(
        currentBoulders.reduce(
          (total, boulder) => floorHeight - boulder.y + total,
          0
        )
      );
    }
    i++;
  }
  const loopLength = loopValues.length;

  console.log(loopValues.join(" -- "));
  console.log({ loopLength });

  const total = 4000000000;

  const remainder = (total - stepsUntilLoopRecognized) % loopLength;
  console.log({ remainder });

  memo.clearMemo();

  const remainingSteps = [] as number[];
  for (let i = 0; i < remainder; i++) {
    const newBoulders = slideInDirection(i % 4, currentBoulders);
    if (newBoulders) {
      currentBoulders = newBoulders;
      remainingSteps.push(
        currentBoulders.reduce(
          (total, boulder) => floorHeight - boulder.y + total,
          0
        )
      );
    } else {
      console.log("loop");
    }
  }
  console.log("remaining", remainingSteps.join(" -- "));

  // printFloor();

  return currentBoulders.reduce(
    (total, boulder) => floorHeight - boulder.y + total,
    0
  );
};
