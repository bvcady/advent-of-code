import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

// Reworked the solution back from Part 2 as I didn't have the repo before and didn't save my work for Part 1 separate
export const solution = (file: string): string | number => {
  const input = getInput(file).map((row) =>
    row.split(",").map((item) => item.split("-").map((number) => Number(number))),
  );

  console.log(input);

  const oneContainsTheOtherFully = (arr1: number[], arr2: number[]) => {
    const firstRange = new Array(arr1[1] - arr1[0] + 1).fill(0).map((_, index) => arr1[0] + index);
    const secondRange = new Array(arr2[1] - arr2[0] + 1).fill(0).map((_, index) => arr2[0] + index);

    return (
      (firstRange[0] >= secondRange[0] &&
        firstRange[firstRange.length - 1] <= secondRange[secondRange.length - 1]) ||
      (secondRange[0] >= firstRange[0] &&
        secondRange[secondRange.length - 1] <= firstRange[firstRange.length - 1])
    );
  };

  return input.filter((dat) => oneContainsTheOtherFully(dat[0], dat[1])).length;
};
