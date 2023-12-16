import { readFileSync } from "fs";
import { Memo } from "../../../utils/memoize";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return (
    fileContent
      // @ts-ignore
      .replaceAll("\\", "⬕")
      .replaceAll("/", "◩")
      .replaceAll("|", "▯")
      .replaceAll("-", "▭")
      .split("\n") as string[]
  );
};
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);

  // console.log(input.join("\n"));
  type Direction = "NORTH" | "WEST" | "SOUTH" | "EAST";
  type Position = {
    x: number;
    y: number;
  };
  const dirOptions: Record<Direction, Position> = {
    NORTH: { x: 0, y: -1 },
    EAST: { x: 1, y: 0 },
    SOUTH: { x: 0, y: 1 },
    WEST: { x: -1, y: 0 },
  };

  type Item = "⬕" | "." | "◩" | "▯" | "▭";
  type BeamPart = {
    direction: Direction;
    item: Item;
  } & Position;
  const rowLength = input?.[0].length;
  const colLength = input?.length;

  const notFlat = input.map((line, y) =>
    line.split("").map((item, x) => {
      return { x, y, item: item as Item };
    })
  );

  const tiles = input.flatMap((line, y) =>
    line.split("").map((item, x) => {
      return { x, y, item: item as Item };
    })
  );

  const memo = new Memo();

  const beamCache = [] as BeamPart[];

  const startBeamPart: BeamPart = { x: 0, y: 0, item: ".", direction: "EAST" };

  const drawBeam = async (isFinal?: boolean) => {
    await delay(100);

    console.clear();

    console.log(
      notFlat
        .map((line, y) =>
          line
            .map((c, x) => {
              const found = beamCache.find(
                ({ x: _x, y: _y }) => _x === x && _y === y
              );
              return found
                ? found.item === "."
                  ? "#"
                  : isFinal
                    ? "#"
                    : found.item
                : isFinal
                  ? "."
                  : c.item;
            })
            .join("")
        )
        .join("\n") + "\n\n\n\n"
    );

    // const nBeams = new Set(
    //   beamCache.map(({ x, y, item }) => {
    //     return [x, y, item].join(", ");
    //   })
    // );

    // console.log(JSON.stringify(Array.from(nBeams).join(" -- "), null, 2));
    // return Array.from(nBeams).length;
  };

  const findInteractionPoint = async (
    beamPart: BeamPart
  ): Promise<BeamPart[] | undefined> => {
    if (
      beamCache.find(
        ({ x: _x, y: _y, direction: _dir }) =>
          beamPart.x === _x && beamPart.y === _y && _dir === beamPart.direction
      )
    ) {
      return undefined;
    }

    beamCache.push(beamPart);

    await drawBeam();

    const { direction, x, y, item } = beamPart;

    // Spliting Horizontally
    if (item === "▭" && ["NORTH", "SOUTH"].includes(direction)) {
      let newTiles = [] as BeamPart[];
      const leftTile = tiles.find(
        ({ x: _x, y: _y }) => _x === x - 1 && _y === y
      );
      const rightTile = tiles.find(
        ({ x: _x, y: _y }) => _x === x + 1 && _y === y
      );

      if (leftTile) {
        newTiles.push({ ...leftTile, direction: "WEST" });
      }
      if (rightTile) {
        newTiles.push({ ...rightTile, direction: "EAST" });
      }
      return newTiles;
    }

    // Spliting Vertically
    if (item === "▯" && ["EAST", "WEST"].includes(direction)) {
      let newTiles = [] as BeamPart[];
      const topTile = tiles.find(
        ({ x: _x, y: _y }) => _x === x && _y === y - 1
      );
      const bottomTile = tiles.find(
        ({ x: _x, y: _y }) => _x === x && _y === y + 1
      );

      if (topTile) {
        newTiles.push({ ...topTile, direction: "NORTH" });
      }
      if (bottomTile) {
        newTiles.push({ ...bottomTile, direction: "SOUTH" });
      }
      return newTiles;
    }

    if (item === "◩" && direction === "EAST") {
      const topTile = tiles.find(
        ({ x: _x, y: _y }) => _x === x && _y === y - 1
      );
      return topTile ? [{ ...topTile, direction: "NORTH" }] : [];
    }

    if (item === "◩" && direction === "WEST") {
      const bottomTile = tiles.find(
        ({ x: _x, y: _y }) => _x === x && _y === y + 1
      );
      return bottomTile ? [{ ...bottomTile, direction: "SOUTH" }] : [];
    }
    if (item === "◩" && direction === "NORTH") {
      const rightTile = tiles.find(
        ({ x: _x, y: _y }) => _x === x + 1 && _y === y
      );
      return rightTile ? [{ ...rightTile, direction: "EAST" }] : [];
    }
    if (item === "◩" && direction === "SOUTH") {
      const leftTile = tiles.find(
        ({ x: _x, y: _y }) => _x === x - 1 && _y === y
      );
      return leftTile ? [{ ...leftTile, direction: "WEST" }] : [];
    }

    if (item === "⬕" && direction === "WEST") {
      const topTile = tiles.find(
        ({ x: _x, y: _y }) => _x === x && _y === y - 1
      );
      return topTile ? [{ ...topTile, direction: "NORTH" }] : [];
    }

    if (item === "⬕" && direction === "EAST") {
      const bottomTile = tiles.find(
        ({ x: _x, y: _y }) => _x === x && _y === y + 1
      );
      return bottomTile ? [{ ...bottomTile, direction: "SOUTH" }] : [];
    }
    if (item === "⬕" && direction === "SOUTH") {
      const rightTile = tiles.find(
        ({ x: _x, y: _y }) => _x === x + 1 && _y === y
      );
      return rightTile ? [{ ...rightTile, direction: "EAST" }] : [];
    }
    if (item === "⬕" && direction === "NORTH") {
      const leftTile = tiles.find(
        ({ x: _x, y: _y }) => _x === x - 1 && _y === y
      );
      return leftTile ? [{ ...leftTile, direction: "WEST" }] : [];
    }

    const deltas = dirOptions[direction];
    const { x: dX, y: dY } = deltas;
    const { x: nX, y: nY } = { x: x + dX, y: y + dY };
    const nextTile = tiles.find(({ x, y }) => x === nX && y === nY);
    const nextBeamPart = nextTile ? { ...nextTile, direction } : undefined;

    if (!nextBeamPart) {
      return [];
    }

    return findInteractionPoint(nextBeamPart);
  };

  const progressBeam = async (beam: BeamPart) => {
    let currentBeamPart = beam;
    if (
      beamCache.find(
        ({ x: _x, y: _y, direction: _dir }) =>
          currentBeamPart.x === _x &&
          currentBeamPart.y === _y &&
          _dir === currentBeamPart.direction
      )
    ) {
      return;
    }

    const newBeams = await findInteractionPoint(currentBeamPart);

    if (!newBeams) {
      return;
    }

    const [beamA, beamB] = newBeams;

    if (!newBeams.length) {
      return;
    }
    if (beamA) {
      await progressBeam(beamA);
    }
    if (beamB) {
      await progressBeam(beamB);
    }
  };

  await progressBeam(startBeamPart);

  // await drawBeam(true);
  const nBeams = new Set(
    beamCache.map(({ direction, item, ...rest }) =>
      JSON.stringify({ x: rest.x, y: rest.y })
    )
  ).size;

  return nBeams;
};
