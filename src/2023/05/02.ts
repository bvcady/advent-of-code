import { start } from "repl";
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
      seeds: [
        {
          start,
          end: start + length - 1,
        },
      ],
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

  console.log(seedRanges?.length);

  let lowest = Infinity;
  const withDepth = seedRanges?.map((range) => {
    let currentRange: Record<string, Record<"start" | "end", number>[]> = range;
    everyMap.forEach((map, index) => {
      console.log(map.text);
      currentRange[map.text] = currentRange[
        index > 0 ? everyMap[index - 1].text : "seeds"
      ].reduce(
        (collection, range) => {
          let oldRanges = [] as Record<"start" | "end", number>[];
          // console.log({ rangeStart: range.start, rangeEnd: range.end });
          let addedRanges = [] as Record<"start" | "end", number>[];
          map.values.forEach((val) => {
            let newRange = {} as Record<"start" | "end", number>;

            const startVal = val.srs;
            const endVal = val.srs + val.rl - 1;

            // console.log({ startVal, endVal });

            if (startVal <= range.end && endVal >= range.start) {
              const deltaStart =
                startVal - range.start >= 0 ? startVal - range.start : 0;
              const deltaEnd =
                range.end >= val.srs + val.rl - 1
                  ? val.srs + val.rl - 1 - range.end
                  : 0;

              // console.log({ deltaStart, deltaEnd });

              const delta = val.drs - val.srs;

              newRange.start = deltaStart + range.start + delta;
              newRange.end = range.end - deltaEnd + delta;

              const oldRange = {
                start: deltaStart + range.start,
                end: range.end - deltaEnd,
              };

              oldRanges.push(oldRange);
              addedRanges.push(newRange);
            } else {
              // console.log("Vals not in range");
            }
          });

          if (addedRanges.length) {
            const slices = range;
            const remainder = [] as Record<"start" | "end", number>[];
            console.log({ oldRanges });
            console.log({ addedRanges });
            oldRanges
              .sort((a, b) => a.start - b.start)
              .forEach((r, index) => {
                let newRemainder = { start: 0, end: 0 };
                if (r.start !== slices.start) {
                  newRemainder.start = slices.start;
                  newRemainder.end = r.start - 1;
                  slices.start = r.end + 1;
                  slices.end = oldRanges[index]?.start - 1;
                  remainder.push(newRemainder);
                }
              });
            console.log({ remainder });

            return [...collection, ...addedRanges, ...remainder];
          } else {
            return [...collection, range];
          }
        },
        [] as Record<"start" | "end", number>[]
      );
    });
    return currentRange;
  });
  console.log(JSON.stringify(withDepth, null, 2));

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

  return lowest;
};
