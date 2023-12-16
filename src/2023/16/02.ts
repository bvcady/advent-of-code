import { delay } from "../../../utils/delay";
import * as prior from "./01";

export const solution = (file: string): Promise<string | number> => {
  const input = prior.getInput(file);

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

  const allStartBeamParts = [
    ...new Array(colLength).fill("").map((_, y) => {
      return {
        ...tiles.find((tile) => tile.y === y && tile.x === 0)!,
        direction: "EAST",
      };
    }),
    ...new Array(colLength).fill("").map((_, y) => {
      return {
        ...tiles.find((tile) => tile.y === y && tile.x === rowLength - 1)!,
        direction: "WEST",
      }!;
    }),
    ...new Array(rowLength).fill("").map((_, x) => {
      return {
        ...tiles.find((tile) => tile.x === x && tile.y === 0)!,
        direction: "SOUTH",
      };
    }),
    ...new Array(rowLength).fill("").map((_, x) => {
      return {
        ...tiles.find((tile) => tile.x === x && tile.y === colLength - 1)!,
        direction: "NORTH",
      };
    }),
  ] as BeamPart[];

  const calculateFrom = (beam: BeamPart) => {
    const beamCache = new Array(0).fill("") as BeamPart[];
    const progressBeam = (beam: BeamPart) => {
      const drawBeam = (isFinal?: boolean) => {
        delay(100);

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
      };

      const findInteractionPoint = (
        beamPart: BeamPart
      ): BeamPart[] | undefined => {
        if (
          beamCache.find(
            ({ x: _x, y: _y, direction: _dir }) =>
              beamPart.x === _x &&
              beamPart.y === _y &&
              _dir === beamPart.direction
          )
        ) {
          return undefined;
        }

        beamCache.push(beamPart);

        //  drawBeam();

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

      const newBeams = findInteractionPoint(currentBeamPart);

      if (!newBeams) {
        return;
      }

      const [beamA, beamB] = newBeams;

      if (!newBeams.length) {
        return;
      }
      if (beamA) {
        progressBeam(beamA);
      }
      if (beamB) {
        progressBeam(beamB);
      }
    };
    progressBeam(beam);

    const nBeams = new Set(
      beamCache.map(({ x, y, item }) => {
        return [x, y, item].join(", ");
      })
    );

    console.log(nBeams.size);
    return nBeams.size;
  };

  const solve = async () => {
    const nCount = allStartBeamParts.map((p) => {
      return calculateFrom(p);
    });
    return nCount.reduce((cur, tot) => (cur > tot ? cur : tot), 0);
  };

  return solve();
};
