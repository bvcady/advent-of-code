import { readFileSync } from "fs";
import { delay } from "../../../utils/delay";
import { Memo } from "../../../utils/memoize";

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
  } & Position;

  const tiles: Tile[] = input.flatMap((line, y) =>
    line.split("").map((c, x) => {
      return { x, y, n: Number(c) };
    })
  );

  const cols = input[0].length;
  const rows = input.length;

  let bestTotal = cols * 9 + rows * 9;

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

  // Some things I know:
  // When entering the last row, you can only go right
  // If you enter the last row, you have to be able to snake to the end.
  // Always find the shortest path, because more steps means more heatloss.
  // Every time a step needs to be made, the total value needs to be less than the best total.

  // Idea 1
  // It might be possible to bruteforce as long as you quit the attempt when the temp is higher than the yet lowest recorded temp, or when you run into yourself.
  // But, this just results in too many attempts (probably O factorial?)
  // Did not attempt by first finding the temp for the absolute shortest path:
  // In other words, diagonal x + 1 and then y + 1 until the end, even though, this is not possible in non square sets

  // Idea 2
  // What if working backwards, it is possible to store all optimal paths in a memo, starting from [x: cols -1, y: rows -1]
  // Not the way to go, as it is possible to go to an 'earlier' tile so cant compute those.

  // Idea 3 (Found online that Dijsktra algorythm is needed for the pathfinding)
  // No concrete idea how to implement this correctly, especially not with the limits on steps in 1 direction.
  // The edge case in the example where the path moves north or west is counter intuitive for Dijkstra I think.

  // Curently abbandoned this excersise due to complexity.

  const mappedTiles = new Map<string, number>();

  tiles.forEach((t) => mappedTiles.set(JSON.stringify(t), Infinity));
  mappedTiles.set(JSON.stringify(tiles[0]), 0);

  const currentTile = { ...tiles[0], n: 0 };

  const drawTiles = () => {
    console.clear();
    console.log(
      "\x1b[33m%s\x1b[0m",
      input
        .map((line, y) =>
          line
            .split("")
            .map((char, x) => {
              const c = JSON.stringify({ x, y, n: Number(char) });
              const d = mappedTiles.get(c);
              if (d !== Infinity) {
                return char + "-" + d;
              }
              return "_";
            })
            .join("\t")
        )
        .join("\n\n\n")
    );
  };

  const dijkstra = (currentTile: Tile): void => {
    const { x, y } = currentTile;
    const n = mappedTiles.get(JSON.stringify(currentTile));

    const nextTiles = tiles.filter(
      (t) =>
        // (t.x === x - 1 && t.y === y) ||
        (t.x === x + 1 && t.y === y) || (t.x === x && t.y === y + 1)
      // (t.x === x && t.y === y - 1)
    );

    nextTiles.forEach((t) => {
      const calculatedValue = (n || 0) + t.n;
      const tentative = mappedTiles.get(JSON.stringify(t)) || Infinity;
      const newValue =
        calculatedValue < tentative ? calculatedValue : tentative;

      mappedTiles.set(JSON.stringify(t), newValue);
    });

    nextTiles.forEach((t) => {
      dijkstra(t);
    });
  };

  dijkstra(currentTile);

  drawTiles();

  return "";
};

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
