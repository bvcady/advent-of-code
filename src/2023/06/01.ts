import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = (file: string): string | number => {
  const input = getInput(file);
  const raceDetails = input.reduce(
    (tot, line) => {
      return {
        ...tot,
        [line.split(":")?.[0].trim()]:
          line.split(":")?.[1].match(/(\d)+/g) || [],
      };
    },
    {} as Record<string, string[]>
  );

  const checkRace = (race: { time: string; distance: string }) => {
    let d = Number(race.time) - 1;
    let maxHoldTime = Number(race.time) - 1;
    let winningSolutions = [] as number[];
    while (d >= 1) {
      let newDistance = d + d * (maxHoldTime - d);
      if (newDistance > Number(race.distance)) {
        winningSolutions.push(newDistance);
      }
      d--;
    }

    return winningSolutions.length;
  };
  const raceDetailsMapped = raceDetails.Time.map((t, index) =>
    checkRace({ time: t, distance: raceDetails.Distance[index] })
  );

  return raceDetailsMapped.reduce((tot, cur) => tot * cur, 1);
};
