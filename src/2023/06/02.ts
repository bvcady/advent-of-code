import * as prior from "./01";

export const solution = (file: string): string | number => {
  const input = prior.getInput(file);

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

  const time = raceDetails.Time.join("");
  const distance = raceDetails.Distance.join("");

  console.log(time, distance);

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

  const longResult = checkRace({ time, distance });
  console.log(longResult);
  return "";
};
