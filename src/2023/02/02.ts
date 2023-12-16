import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const input = prior.getInput(file);
  const games = input.map((input) => {
    const sets = input
      .split(":")?.[1]
      ?.trim()
      ?.split(";")
      ?.map((scores) =>
        scores.split(",").map((score) => {
          const color = score.trim().split(" ")?.[1];
          const points = Number(score.trim().split(" ")?.[0]);
          return { color, points };
        })
      );

    const minimumPerCube = sets.reduce(
      (total, set) => {
        let newTotal = total;
        Object.keys(total)?.forEach((key) => {
          const colorValue =
            set.find((score) => score.color === key)?.points || 0;
          // @ts-ignore
          if (total[key] <= colorValue) {
            // @ts-ignore
            newTotal[key] = colorValue;
          }
        });
        return newTotal;
      },
      { red: 0, green: 0, blue: 0 }
    );

    const power =
      minimumPerCube.blue * minimumPerCube.green * minimumPerCube.red;

    return {
      game: Number(input.split(":")?.[0]?.trim()?.split(" ")?.[1]?.trim()),
      power,
    };
  });

  console.log(JSON.stringify(games, null, 2));
  return games.reduce((total, { power }) => total + power, 0);
};
