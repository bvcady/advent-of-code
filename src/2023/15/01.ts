import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent;
};

export const solution = (file: string): string | number => {
  const input = getInput(file);

  const hashNums = input.split(",").map((val) =>
    val
      .split("")
      .map((char) => char.charCodeAt(0))
      .reduce((tot, cur) => {
        return ((tot + cur) * 17) % 256;
      }, 0)
  );

  return hashNums.reduce((tot, cur) => tot + cur, 0);
};
