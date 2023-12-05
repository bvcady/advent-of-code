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

  // const lowest =
  //   seedRanges?.reduce(
  //     (lowest, r) => (r.start < lowest ? r.start : lowest),
  //     Infinity
  //   ) || Infinity;
  // const highest =
  //   seedRanges?.reduce(
  //     (highest, r) => (r.end > highest ? r.end : highest),
  //     0
  //   ) || 0;
  // console.log({ lowest, highest });

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

  // const revEveryMap = [...everyMap].reverse();

  // const lowestOptions = (
  //   text: string,
  //   previousLowest?: { originalStart: number; originalEnd: number }[]
  // ) => {
  //   console.log({ previousLowest });

  //   const allMappings =
  //     everyMap
  //       .find((map) => map.text === text)
  //       ?.values.map((v) => {
  //         const start = v.drs;
  //         const originalStart = v.srs;
  //         const end = start + v.rl - 1;
  //         const originalEnd = v.srs + v.rl - 1;
  //         return { start, end, originalStart, originalEnd };
  //       }) || [];

  //   const lowestMapping = allMappings?.sort((a, b) => a.start - b.start)?.[0];

  //   const completeMappings =
  //     lowestMapping.start === 0
  //       ? allMappings
  //       : [
  //           {
  //             start: 0,
  //             end: lowestMapping.start - 1,
  //             originalStart: 0,
  //             originalEnd: lowestMapping.start - 1,
  //           },
  //           ...allMappings,
  //         ];

  //   const response = previousLowest?.length
  //     ? completeMappings.filter((m) =>
  //         previousLowest.find(
  //           (obj) =>
  //             (obj.originalEnd >= m.start && obj.originalEnd <= m.end) ||
  //             (obj.originalStart >= m.start && obj.originalStart <= m.end)
  //         )
  //       )
  //     : [completeMappings?.[0]];
  //   return response;
  // };

  // let prevLowestOptions = [] as {
  //   originalStart: number;
  //   originalEnd: number;
  // }[];

  // revEveryMap.forEach((r) => {
  //   const findings = lowestOptions(r.text, prevLowestOptions);
  //   prevLowestOptions = findings;
  //   console.log(findings.reduce((tot, f) => tot + f.end - f.start, 0));
  // });

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
      newValue = ranges.reduce((newL, range, index) => {
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
    console.log(range);
    for (let i = range.start; i <= range.end; i++) {
      finalLocations(i);
    }
    console.log(lowest);
  });

  console.log(lowest);
  // console.log(prevLowestOptions);
  // lowestOptions.map((low) =>
  //   low.start === 0
  //     ? { start: low.originalStart, end: low.originalEnd }
  //     : { start: 0, end: low.start - 1 }
  // );
  // console.log(seedRanges?.reduce((tot, r) => tot + r.length, 0));

  // let locations = input[0]
  //   .split(":")?.[1]
  //   ?.trim()
  //   ?.split(" ")
  //   .map((n) => Number(n));

  // const finalLocations = locations.map((l) => {
  //   let newValue = l;
  //   everyMap.forEach((map) => {
  //     let ranges = [] as Record<string, number>[];
  //     map.values.find((val) => {
  //       const oStart = val.srs;
  //       const oEnd = val.srs + val.rl - 1;
  //       const start = val.drs;
  //       const end = val.drs + val.rl - 1;
  //       ranges.push({ oStart, oEnd, start, end });
  //     });
  //     newValue = ranges.reduce((newL, range, index) => {
  //       if (newValue >= range.oStart && newValue <= range.oEnd) {
  //         return (newL = newValue + range.start - range.oStart);
  //       }
  //       return newL;
  //     }, newValue);
  //   });

  //   return newValue;
  // });
  return lowest;
};
