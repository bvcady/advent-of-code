import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = (file: string): string | number => {
  // Very poorly optimized solution for Part 1. Overcomplicating things with converting the posibilities for ? to a binary number.
  // Then the binary digits were counted (to see there were as many as the required broken gears, minus the gears in the list already),
  // and then converted to either # or a .
  const input = getInput(file);

  const records = input.map((line) => {
    const gears = line.split(" ")?.[0]?.split("");
    const dConfig = line.split(" ")?.[1]?.split(",").map(Number);

    const decimalToBinary = (dec: number) => {
      return (dec >>> 0).toString(2);
    };

    const nDamagedGears = gears.filter((g) => g === "#")?.length || 0;

    const positionsToFill = gears
      .map((g, index) => {
        return { gear: g, index };
      })
      .filter((g) => g.gear === "?");

    const remainingDamaged =
      dConfig.reduce((tot, cur) => tot + cur, 0) - nDamagedGears;

    const maxInteger = positionsToFill.map((_) => "1").join("");
    const maxConfigurations = parseInt(maxInteger, 2);

    const nAttempts = new Array(maxConfigurations + 1).fill(0);
    const emptyZeroes = new Array(positionsToFill.length).fill(0);

    const attempts = nAttempts
      .map((_, i) => {
        const binaryAttempt = (
          emptyZeroes.join("") + decimalToBinary(i).toString()
        ).slice(-emptyZeroes.length);

        return {
          binaryAttempt,
          countOne: binaryAttempt.match(/1/g)?.length || 0,
        };
      })
      .filter(({ countOne, binaryAttempt }) => {
        return countOne === remainingDamaged;
      });

    let correctAttempts = 0;

    attempts.forEach((att) => {
      let gearsAttempt = gears;
      positionsToFill.forEach((p, index) => {
        gearsAttempt[p.index] = att.binaryAttempt[index] === "1" ? "#" : ".";
      });

      const newString = gearsAttempt.join("");

      const suffices =
        newString
          .split(".")
          .filter((group) => !!group)
          .map((group) => group.length)
          .join(",") === dConfig.join(",");
      if (suffices) {
        // console.log(att, "-->", newString);
        correctAttempts++;
      }
    });
    return correctAttempts;
  });

  // console.log(records.join(", "));

  return records.reduce((tot, cur) => tot + cur, 0);
};
