import { Dir, readFileSync } from "fs";
import { delay } from "../../../utils/delay";
import { Memo } from "../../../utils/memoize";

// Some things I know:
// When entering the last row, you can only go right
// If you enter the last row, you have to be able to snake to the end.
// Always find the shortest path, because more steps means more heatloss.
// Every time a step needs to be made, the total value needs to be less than the best total.

// Idea 1
// It might be possible to bruteforce as long as you quit the attempt when the temp is higher than the yet current recorded temp, or when you run into yourself.
// But, this just results in too many attempts (probably O factorial?)
// Did not attempt by first finding the temp for the absolute shortest path:
// In other words, diagonal x + 1 and then y + 1 until the end, even though, this is not possible in non square sets, although not the case here

// Idea 2
// What if working backwards, it is possible to store all optimal paths in a memo, starting from [x: cols -1, y: rows -1]
// Not the way to go, as it is possible to go to an 'earlier' tile so cant compute those.

// Idea 3 (Found online that Dijsktra algorythm is needed for the pathfinding)
// No concrete idea how to implement this correctly, especially not with the limits on steps in 1 direction.
// The edge case in the example where the path moves north or west is counter intuitive for Dijkstra I think.

// Currently abbandoned this excersise due to complexity. (Dec 17th)

// Idea 4
// First implement a working Dijkstra Algorythm that does not take the direction limit into account
// Then figure out how to possibly modify it to allow for that limitation
// Most likely needs a way to store prior possibilities

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);

  type Direction = "NORTH" | "WEST" | "SOUTH" | "EAST";
  type Position = {
    x: number;
    y: number;
  };

  type Tile = {
    n: number;
    dir: Direction | undefined;
    repetition: number;
  } & Position;

  // const nonFlat: Tile[][] = input.map((line, y) =>
  //   line.split("").map((c, x) => {
  //     return { x, y, n: Number(c) };
  //   })
  // );

  const tiles: Tile[] = input.flatMap((line, y) =>
    line.split("").flatMap((c, x) => {
      return (["NORTH", "EAST", "WEST", "SOUTH"] as Direction[]).flatMap(
        (dir) =>
          [1, 2, 3].flatMap((repetition) => {
            return {
              x,
              y,
              n: Number(c),
              dir,
              repetition,
            };
          })
      );
    })
  );

  const cols = input[0].length;
  const rows = input.length;

  // let bestTotal = new Array(cols).fill("").reduce((total, _, x) => {
  //   const a = nonFlat[x][x]?.n || 0;
  //   const b = nonFlat[x][x - 1]?.n || 0;
  //   return total + a + b;
  // }, 0);

  // console.log(bestTotal);

  const calcDir = (from: Tile, to: Tile): Direction => {
    const dX = to?.x - from.x;
    const dY = to?.y - from.y;

    if (dX === -1) {
      return "WEST";
    }
    if (dX === 1) {
      return "EAST";
    }
    if (dY === -1) {
      return "NORTH";
    }
    if (dY === 1) {
      return "SOUTH";
    }

    return "SOUTH";
  };

  const unvisited = new Map<Tile, number>();
  const visited = new Map<Tile, number>();

  unvisited.set({ x: 0, y: 0, n: 2, dir: undefined, repetition: 0 }, 0);

  tiles.forEach((t) => {
    return unvisited.set(t, Infinity);
  });

  while (unvisited.size) {
    let current: { tile: Tile | undefined; value: number; baseRep?: number } = {
      tile: undefined,
      value: Infinity,
    };

    unvisited.forEach((val, key) => {
      if (current?.value && val <= current.value) {
        current = { tile: key, value: val };
      }
    });

    if (visited.size % 200 === 0) {
      console.log(visited.size);
    }

    if (!current.tile) {
      break;
    }

    const { x, y } = current.tile;

    const determineFilter = (from: Tile, to: Tile): boolean => {
      const opposite = (_d?: Direction): Direction[] => {
        if (_d === "NORTH" || _d === "SOUTH") {
          return ["EAST", "WEST"];
        } else return ["NORTH", "SOUTH"];
      };

      const direction = from.dir;

      if (!direction || from.repetition === 0) {
        return to.repetition === 1 && calcDir(from, to) === to.dir;
      }

      const [optOne, optTwo] = opposite(direction);

      const dirOptions: Record<Direction, Position> = {
        NORTH: { x: 0, y: -1 },
        EAST: { x: 1, y: 0 },
        SOUTH: { x: 0, y: 1 },
        WEST: { x: -1, y: 0 },
      };

      const { x: dX, y: dY } = dirOptions[direction];

      const deviationOneCheck =
        from.x === to.x - dirOptions[optOne].x &&
        from.y === to.y - dirOptions[optOne].y &&
        to.dir === optOne;

      const deviationTwoCheck =
        from.x === to.x - dirOptions[optTwo].x &&
        from.y === to.y - dirOptions[optTwo].y &&
        to.dir === optTwo;

      const deviateCheck =
        to.repetition === 1 && (deviationOneCheck || deviationTwoCheck);

      if (from.repetition === 3) {
        return deviateCheck;
      }

      const continueCheck =
        to.y === from.y + dY &&
        to.x === from.x + dX &&
        to.repetition === from.repetition + 1 &&
        to.dir === direction!;

      // return deviateCheck || continueCheck;
      return continueCheck || deviateCheck;
    };

    const nextTiles = tiles
      .filter((t) => {
        if (x === cols - 1) {
          return (t.x === x && t.y === y + 1) || (t.x === x - 1 && t.y === y);
        }
        if (y === rows - 1) {
          return (t.x === x + 1 && t.y === y) || (t.x === x && t.y === y - 1);
        }
        return (
          (t.x === x - 1 && t.y === y) ||
          (t.x === x + 1 && t.y === y) ||
          (t.x === x && t.y === y + 1) ||
          (t.x === x && t.y === y - 1)
        );
      })
      .filter((tile) => {
        return determineFilter(current.tile!, tile);
      });

    const baseValue = unvisited.get(current.tile!)!;

    nextTiles.forEach((t) => {
      if (unvisited.has(t)) {
        const next = baseValue + t.n;
        const prev = unvisited.get(t) || Infinity;
        const newVal = next < prev ? next : prev;
        unvisited.set(t, newVal);
      }
    });

    unvisited.delete(current.tile);

    if (x === cols - 1 && y === rows - 1) {
      visited.set(current.tile, baseValue);
    }
  }

  let lowest = Infinity;

  visited.forEach((val, key) => {
    if (key.x === cols - 1 && key.y === rows - 1 && val < lowest) {
      lowest = val;
    }
  });

  console.log({ lowest });

  return "";
};

// const draw = () => {
//   console.clear();
//   console.log(input.map((line) => line.split("").join(" ")).join("\n"));
//   console.log("\n");
//   console.log(
//     input
//       .map((line, y) =>
//         line
//           .split("")
//           .map((c, x) => {
//             const v = visited.get(tiles[y * cols + x]);
//             return `[${c}] ${v}`;
//           })
//           .join("\t")
//       )
//       .join("\n\n")
//   );
// };

// // draw();

// console.log(cols, rows);

// Previous attempts below

// const memo = new Memo();

// const calcShortestRoute = memo.memoize((_x: number, _y: number) => {});

// let x = cols - 1;
// let y = rows - 1;
// while (x >= 0 && y >= 0) {
//   calcShortestRoute(x, y);
// }

// const goThrougSteps = async (
//   temp: number,
//   traveledPath: Tile[],
//   currentTile: Tile
// ) => {
//   let direction = "EAST";
//   let nDirection = 1;

//   const { x, y, n } = currentTile;

//   temp += n;

//   const reachedEnd = x === cols - 1 && y === rows - 1;

//   if (reachedEnd) {
//     console.log(temp);
//     bestTotal = temp;
//     temp = 0;
//   }

//   const nextTiles = tiles
//     .filter(
//       (t) =>
//         (t.x === x - 1 && t.y === y) ||
//         (t.x === x + 1 && t.y === y) ||
//         (t.x === x && t.y === y + 1) ||
//         (t.x === x && t.y === y - 1)
//     )
//     .filter((t) => !traveledPath.includes(t))
//     .filter((t) => {
//       const nextDir = calcDir(currentTile, t);
//       if (nDirection === 3) {
//         return nextDir !== direction;
//       }
//       return true;
//     })
//     .sort((a, b) => a.n - b.n)
//     .sort((a) => {
//       const nextDir = calcDir(currentTile, a);
//       if (nextDir === "WEST" && traveledPath.find((p) => p.x === a.x)) {
//         return 1;
//       }
//       if (nextDir === "NORTH" && traveledPath.find((p) => p.y === a.y)) {
//         return 1;
//       }
//       return 0;
//     });

//   if (temp + (cols - 1 - x + rows - 1 - y) >= bestTotal) {
//     return;
//   }

//   if (!nextTiles[0]) {
//     return;
//   }

//   traveledPath.push(currentTile);

//   const newDirection = calcDir(currentTile, nextTiles[0]);

//   const isNewDirection = newDirection !== direction;

//   if (isNewDirection) {
//     direction = newDirection;
//     nDirection = 1;
//   } else {
//     nDirection += 1;
//   }

//   const promises = [] as Promise<void>[];

//   nextTiles.forEach(async (tile) => {
//     let newPath = [...traveledPath];
//     promises.push(goThrougSteps(temp, newPath, tile));
//   });

//   await Promise.all(promises);
// };

// await goThrougSteps(0, [], tiles[0]);

// console.log({ bestTotal });

// console.log(JSON.stringify(tiles, null, 2));

// Dijsktra attempt

// const mappedTiles = new Map<string, number>();

// tiles.forEach((t) => mappedTiles.set(JSON.stringify(t), Infinity));
// mappedTiles.set(JSON.stringify(tiles[0]), 0);

// const currentTile = { ...tiles[0], n: 0 };

// const drawTiles = () => {
//   console.clear();
//   console.log(
//     "\x1b[33m%s\x1b[0m",
//     input
//       .map((line, y) =>
//         line
//           .split("")
//           .map((char, x) => {
//             const c = JSON.stringify({ x, y, n: Number(char) });
//             const d = mappedTiles.get(c);
//             if (d !== Infinity) {
//               return char + "-" + d;
//             }
//             return "_";
//           })
//           .join("\t")
//       )
//       .join("\n\n\n")
//   );
// };

// const dijkstra = (currentTile: Tile): void => {
//   const { x, y } = currentTile;
//   const n = mappedTiles.get(JSON.stringify(currentTile));

//   const nextTiles = tiles.filter(
//     (t) =>
//       // (t.x === x - 1 && t.y === y) ||
//       (t.x === x + 1 && t.y === y) || (t.x === x && t.y === y + 1)
//     // (t.x === x && t.y === y - 1)
//   );

//   nextTiles.forEach((t) => {
//     const calculatedValue = (n || 0) + t.n;
//     const tentative = mappedTiles.get(JSON.stringify(t)) || Infinity;
//     const newValue =
//       calculatedValue < tentative ? calculatedValue : tentative;

//     mappedTiles.set(JSON.stringify(t), newValue);
//   });

//   nextTiles.forEach((t) => {
//     dijkstra(t);
//   });
// };

// dijkstra(currentTile);

// drawTiles();
