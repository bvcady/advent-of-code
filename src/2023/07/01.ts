import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = async (file: string): Promise<string | number> => {
  const rankings = [2, 3, 4, 5, 6, 7, 8, 9, "T", "J", "Q", "K", "A"].map(
    (item) => item.toString()
  );

  const input = getInput(file);
  const hands = input.map((line) => {
    return { hand: line.split(" ")?.[0], bid: Number(line.split(" ")?.[1]) };
  });

  const sortedHands = hands.sort((a, b) => {
    const nBased = (input: string) => {
      const n = input.split("").map((card) => rankings.indexOf(card));
      return n;
    };
    let compare = 0;
    const indexedA = nBased(a.hand);
    const indexedB = nBased(b.hand);
    let i = 0;
    while (i < 5) {
      if (indexedA[i] > indexedB[i]) {
        compare = -1;
        i = 5;
      }
      if (indexedB[i] > indexedA[i]) {
        compare = 1;
        i = 5;
      }
      i++;
    }
    return compare;
  });

  const checkHandType = (hand: string) => {
    const uniqueCards = hand.split("").reduce(
      (unique, card) => {
        if (!unique[card]) {
          return { ...unique, [card]: 1 };
        }
        return { ...unique, [card]: unique[card] + 1 };
      },
      {} as Record<string, number>
    );

    const cardsSorted = Object.keys(uniqueCards)
      .map((key) => {
        return { card: key, amount: uniqueCards[key] };
      })
      .sort((a, b) => b.amount - a.amount);

    const l = cardsSorted.length;

    switch (l) {
      case 5:
        return 1;
      case 4:
        return 2;
      case 3:
        if (cardsSorted[0].amount === 3) {
          return 4;
        }
        return 3;
      case 2:
        if (cardsSorted[0].amount === 4) {
          return 6;
        }
        return 5;
      case 1:
        return 7;
      default:
        return 0;
    }
  };

  const byHighestHand = sortedHands.sort(
    (a, b) => checkHandType(b.hand) - checkHandType(a.hand)
  );

  return byHighestHand
    .reverse()
    .reduce((acc, tot, index) => acc + tot.bid * (index + 1), 0);
};
