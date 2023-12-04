import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = (file: string): string | number => {
  const input = getInput(file);
  const cards = input.map((line) => {
    const yourNumbers = line
      .split(":")?.[1]
      ?.trim()
      ?.split("|")?.[0]
      ?.trim()
      ?.split(" ")
      ?.filter((n) => !!n);
    const winningNumbers = line
      .split(":")?.[1]
      ?.trim()
      ?.split("|")?.[1]
      ?.trim()
      ?.split(" ")
      ?.filter((n) => !!n);
    const nWinning = yourNumbers.filter((n) => winningNumbers?.includes(n))
      ?.length;
    return {
      game: Number(line.split(":")?.[0]?.trim()?.split(" ")?.[1]),
      yourNumbers,
      winningNumbers,
      winnings: nWinning ? Math.pow(2, nWinning - 1) : 0,
    };
  });

  // console.log(JSON.stringify(cards, null, 2));
  return cards.reduce((tot, card) => tot + card.winnings, 0);
};
