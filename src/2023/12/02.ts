import { Memo } from "../../../utils/memoize";
import * as prior from "./01";

const decimalToBinary = (dec: number) => {
  return (dec >>> 0).toString(2);
};

const findCorrectAttempts = (
  gears: string[],
  config: number[]
): { correctAttempts: number; binaries: string[] } => {
  const nDamagedGears = gears.filter((g) => g === "#").length;

  const positionsToFill = gears
    .map((g, index) => {
      return { gear: g, index };
    })
    .filter((g) => g.gear === "?");

  const totalRequired = config.reduce((tot, cur) => tot + cur, 0);

  const remainingDamaged = totalRequired - nDamagedGears;

  const maxInteger = positionsToFill.map((_) => "1").join("");

  const nAttempts = parseInt(maxInteger, 2);

  const emptyZeroes = new Array(positionsToFill.length).fill(0);

  const minimumI = parseInt(new Array(remainingDamaged).fill("1").join(""), 2);

  let correctAttempts = 0;
  let binaries = [] as string[];

  for (let i = minimumI; i <= nAttempts; i++) {
    const numberOfOnes = decimalToBinary(i).toString().match(/1/g)?.length || 0;
    if (numberOfOnes !== remainingDamaged) {
      continue;
    }

    const possibleAttempt = (
      emptyZeroes.join("") + decimalToBinary(i).toString()
    ).slice(-emptyZeroes.length);

    console.log(possibleAttempt);

    let gearsAttempt = [...gears];

    positionsToFill.forEach((p, index) => {
      const isOne = possibleAttempt[index] === "1";
      gearsAttempt[p.index] = isOne ? "#" : ".";
    });

    const newString = gearsAttempt.join("");

    const suffices =
      newString
        .split(".")
        .filter((group) => !!group)
        .map((group) => group.length)
        .join(",") === config.join(",");
    if (suffices) {
      binaries.push(
        // @ts-ignore
        gearsAttempt.join("")
      );
      correctAttempts++;
    }
  }

  return { correctAttempts, binaries };
};

export const solution = async (file: string): Promise<string | number> => {
  const input = prior.getInput(file);

  const records = input.map((line) => {
    const foldedGears = line.split(" ")?.[0].split("");
    const foldedConfig = line.split(" ")?.[1].split(",").map(Number);

    const unfoldedGears = new Array(5)
      .fill(foldedGears.join(""))
      .join("?")
      .split("");

    const unfoldedConfig = new Array(5)
      .fill(foldedConfig.join(","))
      .join(",")
      ?.split(",")
      .map(Number);

    // This whole part I got from someone else's solution.
    // They had used memoization to not call a function if the function had already been called with the same paramaters, but retreived it from a stored Map.
    // Yet, I rewrote their default memoization to a Memo class that can be used to debug, see /utils/memoize.ts,
    // I fully understand the solution though, but rewriting would not help me.
    // Therefor I commented the logic below.

    // The find correctAttempts logic above was my intended approach again based on binary numbers representing a working or non working gear option.

    const countMemo = new Memo(line);
    const countWays = countMemo.memoize(
      (gearOptions: string, configs: number[]): number => {
        // In case (deeper on the gearOptions) when there's no gearOptions left,
        // it should return a 0 when there' still 'configs' left
        if (gearOptions.length === 0) {
          if (configs.length === 0) {
            return 1;
          }
          return 0;
        }
        // In case there are no configs left, but still some gearOptions,
        // then when there's no defectedGears ('#') left, it should return a 0
        if (configs.length === 0) {
          for (let i = 0; i < gearOptions.length; i++) {
            if (gearOptions[i] === "#") {
              return 0;
            }
          }
          return 1;
        }

        // The gearOptions is not long enough for all configs
        if (
          gearOptions.length <
          configs.reduce((tot, cur) => tot + cur, 0) + configs.length - 1
        ) {
          return 0;
        }

        // Skip the option if it is a '.', then continue with the rest of the options only.
        if (gearOptions[0] === ".") {
          return countWays(gearOptions.slice(1), configs);
        }

        // Skip the option if it is a 'defectedGear', then check if the first config is possible from that point, otherwise return 0;
        if (gearOptions[0] === "#") {
          const [config, ...leftoverConfigs] = configs;
          for (let i = 0; i < config; i++) {
            if (gearOptions[i] === ".") {
              return 0;
            }
          }
          if (gearOptions[config] === "#") {
            return 0;
          }

          // Then if it did suffice, continue checking with the rest of the options with the remaining configs.
          return countWays(gearOptions.slice(config + 1), leftoverConfigs);
        }
        // Otherwise try replacing the first option (?) with either a # or a .,
        // and add both values to see if it possible from that point on.
        return (
          countWays("#" + gearOptions.slice(1), configs) +
          countWays("." + gearOptions.slice(1), configs)
        );
      }
    );

    const result = countWays(unfoldedGears.join(""), unfoldedConfig);
    console.log(countMemo.nSet, countMemo.nGet);
    return result;
  });

  return records.reduce((tot, cur) => tot + cur, 0);
};
