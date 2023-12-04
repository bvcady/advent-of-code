import * as prior from "./01";

export const solution = (file: string): string | number => {
  const input = prior.getInput(file);

  const cards = input.map((line) => {
    const game = Number(
      line.split(":")?.[0]?.trim()?.split(" ")?.slice(-1)?.[0]
    );
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
      game,
      yourNumbers,
      winningNumbers,
      newCards: new Array(nWinning)
        .fill("")
        .map((_, index) => game + 1 + index),
    };
  });

  const cardDistribution: Record<string, number> = new Array(input.length)
    .fill("")
    .reduce((acc, _, index) => {
      return {
        ...acc,
        [index + 1]: 1,
      };
    }, {});

  cards?.forEach((card) => {
    const game = card.game;
    const nDis = cardDistribution[game];

    for (let i = 0; i < nDis; i++) {
      card.newCards.forEach((_c) => (cardDistribution[_c] += 1));
    }
  });

  return Object.keys(cardDistribution).reduce(
    (tot, cur) => (tot += cardDistribution[cur]),
    0
  );
};
