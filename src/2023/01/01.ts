import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = (file: string): string | number => {
  const input = getInput(file);

  const numbersFromLine = input.map((line) => {
    const numbersInLine = line.match(/[0-9]/g);
    const firstAndLast = [
      numbersInLine?.slice(0, 1),
      numbersInLine?.slice(-1),
    ]?.join("");
    return firstAndLast;
  });
  return numbersFromLine.reduce((acc, cur) => acc + Number(cur), 0);
};
