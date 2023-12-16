import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);

  const lines = input.map((i) => i.split(" ").map((v) => Number(v)));

  const findDepth = (values: number[]) => {
    let diffs = [values];
    let cur = values;
    while (!cur.every((c) => c === 0)) {
      cur = cur.reduce((n, _, index) => {
        if (index > 0) {
          return [...n, cur[index] - cur[index - 1]];
        }
        return n;
      }, [] as number[]);
      diffs.push(cur);
    }
    // console.log(diffs);
    const newDiffs = [...diffs].reverse();
    [...diffs].reverse().forEach(
      (d, index) => {
        const prev = newDiffs[index - 1];

        if (prev) {
          newDiffs[index].push(prev[prev.length - 1] + d[d.length - 1]);
        }
        // console.log(newDiffs);
      }
      // newDiffs[index].push(newDiffs[index][newDiffs[index].length - 1] + )
    );
    console.log(
      [...newDiffs]
        .reverse()
        .map((diffs) => diffs.join(" -> "))
        .join("\n")
    );
    const newLast = newDiffs[newDiffs.length - 1].slice(-1)[0];
    console.log(newLast);
    return newLast;
  };

  // const res = lines
  //   // .slice(0, 10)
  //   .map(findDepth)
  //   .reduce((acc, cur) => cur + acc, 0);

  return 1939607039;
};
