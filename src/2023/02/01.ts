import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = (file: string): string | number => {
  const input = getInput(file);

  // The Elf would first like to know which games would have been possible
  // if the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes?

  const games = input.map((input) => {
    const sets = input
      .split(":")?.[1]
      ?.trim()
      ?.split(";")
      ?.map((scores) =>
        scores.split(",").map((score) => {
          const color = score.trim().split(" ")?.[1];
          const points = score.trim().split(" ")?.[0];
          return { color, points };
        })
      );

    const gameSuffices = sets
      .map((set) =>
        set.reduce(
          (combined, score) => {
            return { ...combined, [score.color]: Number(score.points) };
          },
          { red: 0, green: 0, blue: 0 }
        )
      )
      .every(({ red, green, blue }) => {
        return red <= 12 && green <= 13 && blue <= 14;
      });

    return {
      game: Number(input.split(":")?.[0]?.trim()?.split(" ")?.[1]?.trim()),
      gameSuffices,
    };
  });

  // console.log(JSON.stringify(games, null, 2));

  return games.reduce((total, { game, gameSuffices }) => {
    if (gameSuffices) {
      return total + game;
    }
    return total;
  }, 0);
};
