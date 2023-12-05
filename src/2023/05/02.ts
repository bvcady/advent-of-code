import * as prior from "./01";

export const solution = (file: string): string | number => {
  const input = prior.getInput(file);

  const nums = input[0]
    ?.split(":")?.[1]
    ?.trim()
    .match(/\d*\d\s\d*\d/g);

  const seedRanges = nums?.map((r) => {
    const start = Number(r.split(" ")?.[0].trim());
    const length = Number(r.split(" ")?.[1].trim());

    return {
      start,
      length,
      end: start + length - 1,
    };
  });

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

  let lowest = Infinity;

  const finalLocations = (item: number) => {
    let newValue = item;
    everyMap.forEach((map) => {
      let ranges = [] as Record<string, number>[];
      map.values.find((val) => {
        const oStart = val.srs;
        const oEnd = val.srs + val.rl - 1;
        const start = val.drs;
        const end = val.drs + val.rl - 1;
        ranges.push({ oStart, oEnd, start, end });
      });
      newValue = ranges.reduce((newL, range) => {
        if (newValue >= range.oStart && newValue <= range.oEnd) {
          return (newL = newValue + range.start - range.oStart);
        }
        return newL;
      }, newValue);
    });
    if (newValue < lowest) {
      lowest = newValue;
    }
  };

  seedRanges?.forEach((range) => {
    for (let i = range.start; i <= range.end; i++) {
      finalLocations(i);
    }
  });

  return lowest;
};
