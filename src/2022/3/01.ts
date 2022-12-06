import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const alphaBet: string[] = "_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Reworked the solution back from Part 2 as I didn't have the repo before and didn't save my work for Part 1 separate
export const solution = (file: string) => {
  const input = getInput(file);

  return input.reduce(
    (acc, line) =>
      acc +
      alphaBet.indexOf(
        line.split("").find((char) => line.slice(-(line.length / 2)).includes(char)) as string,
      ),
    0,
  );
};
