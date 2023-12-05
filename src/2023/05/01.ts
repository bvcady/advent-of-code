import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n\n");
};

export const solution = (file: string): string | number => {
  const input = getInput(file);

  const everyMap = input.slice(1, 8).map((line) => {
    const text = line.split(":")?.[0]?.trim();
    const values = line
      .split(":")?.[1]
      ?.trim()
      ?.split("\n")
      .map((row) => row.split(" ").map((num) => Number(num)))
      .map((opt) => {
        return {
          drs: opt[0],
          srs: opt[1],
          rl: opt[2],
        };
      });

    return {
      text,
      values,
    };
  });

  let locations = input[0]
    .split(":")?.[1]
    ?.trim()
    ?.split(" ")
    .map((n) => Number(n));

  const finalLocations = locations.map((l) => {
    let newValue = l;
    everyMap.forEach((map) => {
      let ranges = [] as Record<string, number>[];
      map.values.find((val) => {
        const oStart = val.srs;
        const oEnd = val.srs + val.rl - 1;
        const start = val.drs;
        const end = val.drs + val.rl - 1;
        ranges.push({ oStart, oEnd, start, end });
      });
      newValue = ranges.reduce((newL, range, index) => {
        if (newValue >= range.oStart && newValue <= range.oEnd) {
          return (newL = newValue + range.start - range.oStart);
        }
        return newL;
      }, newValue);
    });

    return newValue;
  });

  return Math.min(...finalLocations);
};
