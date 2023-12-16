import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const input = prior.getInput(file);
  // const allStartBeamParts = [
  //   ...new Array(colLength).fill("").map((_, y) => {
  //     return {
  //       ...tiles.find((tile) => tile.y === y && tile.x === 0)!,
  //       direction: "EAST",
  //     };
  //   }),
  //   ...new Array(colLength).fill("").map((_, y) => {
  //     return {
  //       ...tiles.find((tile) => tile.y === y && tile.x === rowLength - 1)!,
  //       direction: "WEST",
  //     }!;
  //   }),
  //   ...new Array(rowLength).fill("").map((_, x) => {
  //     return {
  //       ...tiles.find((tile) => tile.x === x && tile.y === 0)!,
  //       direction: "SOUTH",
  //     };
  //   }),
  //   ...new Array(rowLength).fill("").map((_, x) => {
  //     return {
  //       ...tiles.find((tile) => tile.x === x && tile.y === colLength - 1)!,
  //       direction: "NORTH",
  //     };
  //   }),
  // ] as BeamPart[];
  return "";
};
