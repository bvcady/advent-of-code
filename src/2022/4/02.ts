import * as prior from "./01";

export const solution = (file: string): string | number => {
  const input = prior
    .getInput(file)
    .map((row) => row.split(",").map((item) => item.split("-").map((number) => Number(number))));

  const oneContainsTheOther = (arr1: number[], arr2: number[]) => {
    const firstRange = new Array(arr1[1] - arr1[0] + 1).fill(0).map((_, index) => arr1[0] + index);
    const secondRange = new Array(arr2[1] - arr2[0] + 1).fill(0).map((_, index) => arr2[0] + index);

    return !!firstRange.find((item) => secondRange.includes(item));
  };

  return input.filter((dat) => oneContainsTheOther(dat[0], dat[1])).length;
};
