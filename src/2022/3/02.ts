import * as prior from "./01";

export const solution = (file: string) => {
  const input = prior.getInput(file);

  const checkData: string[][] = [];

  while (input.length > 0) {
    checkData.push(input.splice(0, 3));
  }

  return checkData
    .map((dat) => dat[0].split("").find((char) => dat[1].includes(char) && dat[2].includes(char)))
    .map((char) => prior.alphaBet.indexOf(char as string))
    .reduce((acc, dat) => acc + dat, 0);
};
