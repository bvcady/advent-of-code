import { readFileSync } from "fs";

export const getInput = (file: string): string[] => {
  const fileContent = readFileSync(file, "utf-8");
  //  ┓┗ ┛ ┏┃━
  return (
    fileContent
      // @ts-ignore
      .replaceAll("L", "┗")
      // @ts-ignore
      .replaceAll("J", "┛")
      // @ts-ignore
      .replaceAll("7", "┓")
      // @ts-ignore
      .replaceAll("F", "┏")
      // @ts-ignore
      .replaceAll("|", "┃")
      // @ts-ignore
      .replaceAll("-", "━")
      // @ts-ignore
      .replaceAll("S", "☺")
      .split("\n")
  );
};

export const solution = (file: string): string | number => {
  const input = getInput(file);
  const upOptions = "┓ ┏ ┃".replace(" ", "");
  const downOptions = "┗  ┛ ┃".replace(" ", "");
  const leftOptions = "┗ ┏ ━".replace(" ", "");
  const rightOptions = "┓ ┛ ━".replace(" ", "");

  type Pipe = "┗" | "┛" | "┃" | "┓" | "┏" | "━" | "." | "☺";

  type Direction = "up" | "down" | "left" | "right";

  const possibleDirs = (input: Pipe): Direction[] => {
    switch (input) {
      case "┗":
        return ["up", "right"];
      case "┛":
        return ["up", "left"];
      case "┃":
        return ["up", "down"];
      case "┓":
        return ["down", "left"];
      case "┏":
        return ["down", "right"];
      case "━":
        return ["left", "right"];
      default:
        return [];
    }
  };

  const map = input.join("\n");
  // console.log(map);
  const pipe = (coords: number[]): Pipe => {
    const [x, y] = coords;
    return input[y][x] as Pipe;
  };

  const startLine = input.find((l) => l.includes("☺"));

  const startY = input.indexOf(startLine || "") ?? -1;
  const startX = startLine?.indexOf("☺") ?? -1;
  const startPipe = (): Pipe => {
    const up = pipe([startX, startY - 1]);
    const down = pipe([startX, startY + 1]);
    const left = pipe([startX - 1, startY]);
    const right = pipe([startX + 1, startY]);

    console.log(up, down, left, right);

    let hasUp = "";
    let hasDown = "";
    let hasRight = "";
    let hasLeft = "";

    if (possibleDirs(up).includes("down")) hasUp = downOptions;
    if (possibleDirs(down).includes("up")) hasDown = upOptions;
    if (possibleDirs(left).includes("right")) hasLeft = rightOptions;
    if (possibleDirs(right).includes("left")) hasRight = leftOptions;

    const possibilities = {
      up: possibleDirs(up),
      down: possibleDirs(down),
      left: possibleDirs(left),
      right: possibleDirs(right),
    };
    console.log(possibilities);
    const opts = [hasUp, hasDown, hasRight, hasLeft];
    let char = "";

    const alreadySeen = {};
    opts
      .join("")
      .replace(" ", "")
      .split("")
      .forEach((str) => {
        // @ts-ignore
        if (alreadySeen[str]) char = str;
        // @ts-ignore
        else alreadySeen[str] = true;
      });

    console.log("opts", opts);
    console.log("starting from", char);
    return char as Pipe;
  };

  const startCoordinates = [
    startX,
    startY,
    possibleDirs(pipe([startX, startY]))[0],
    startPipe(),
  ] as [number, number, Direction, Pipe];

  let currentCoordinates = startCoordinates;

  const progress = () => {
    const [x, y, curD, p] = currentCoordinates;
    const dirs = possibleDirs(p);
    const prev = currentCoordinates[2];

    const dir = dirs.find((dir) => {
      if (dir === "up" && prev === "down") return false;
      if (dir === "down" && prev === "up") return false;
      if (dir === "left" && prev === "right") return false;
      if (dir === "right" && prev === "left") return false;
      return true;
    });

    const getNextPipe = () => {
      let nextPipeCoords = currentCoordinates;
      const [x, y, d] = currentCoordinates;

      if (dir === "up") {
        nextPipeCoords = [x, y - 1, dir, "."];
      }
      if (dir === "down") {
        nextPipeCoords = [x, y + 1, dir, "."];
      }
      if (dir === "left") {
        nextPipeCoords = [x - 1, y, dir, "."];
      }
      if (dir === "right") {
        nextPipeCoords = [x + 1, y, dir, "."];
      }

      nextPipeCoords[3] = pipe([nextPipeCoords[0], nextPipeCoords[1]]);
      currentCoordinates = nextPipeCoords;
    };

    getNextPipe();
    return [x, y, p];
  };
  let n = -1;
  let coords = [] as (number | string)[][];
  let end = false;

  while (!end) {
    const ret = progress();
    coords.push(ret);
    // console.log(n, ret);
    // if (n % 1000 === 0) console.log(n, ret);
    if (ret[2] === "☺") {
      end = true;
    }
    n++;
  }
  // console.log(n, coords[n]);
  console.log(coords.slice(0, 10));
  return n / 2;
};
