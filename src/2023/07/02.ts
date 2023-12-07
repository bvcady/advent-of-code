import * as prior from "./01";

export const solution = (file: string): string | number => {
  const rankings = ["J", 2, 3, 4, 5, 6, 7, 8, 9, "T", "Q", "K", "A"].map(
    (item) => item.toString()
  );
  const input = prior.getInput(file);

  const hands = input.map((line) => {
    return { hand: line.split(" ")?.[0], bid: Number(line.split(" ")?.[1]) };
  });

  const checkHandType = (hand: string) => {
    // const highestCard = hand.split("").reduce((highest, current) => {
    //   const r = rankings.indexOf(current);
    //   return r > highest ? r : highest;
    // }, 0);

    const allOpts = hand.split("").filter((c) => c !== "J");

    const cardCounts = new Map();

    allOpts.forEach((opt) =>
      cardCounts.set(opt, (cardCounts.get(opt) || 0) + 1)
    );

    let arr = [] as Record<any, any>[];
    cardCounts.forEach((v, k) => arr.push({ card: k, value: v }));

    const highestCard = arr
      .sort((a, b) => rankings.indexOf(b.card) - rankings.indexOf(a.card))
      .sort((a, b) => b.value - a.value)?.[0]?.card;

    console.log(hand, "->", highestCard);

    const uniqueCards = hand
      .split("")
      .map((card) => {
        return card === "J" ? highestCard : card;
      })
      .reduce(
        (unique, card) => {
          if (!unique[card]) {
            return { ...unique, [card]: 1 };
          }
          return { ...unique, [card]: unique[card] + 1 };
        },
        {} as Record<string, number>
      );

    console.log(uniqueCards);

    const cardsSorted = Object.keys(uniqueCards)
      .map((key) => {
        return { card: key, amount: uniqueCards[key] };
      })
      .sort((a, b) => b.amount - a.amount);

    const l = cardsSorted.length;

    let rVal = 0;
    switch (l) {
      case 5:
        rVal = 1;
        break;
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
    return rVal;
  };

  const compareHands = (
    a: Record<string, number | string>,
    b: Record<string, number | string>
  ) => {
    const nBased = (input: string) => {
      const n = input.split("").map((card) => rankings.indexOf(card));
      return n;
    };

    let compare = 0;
    const indexedA = nBased(a.hand as string);
    const indexedB = nBased(b.hand as string);
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
  };

  const byHighestHand = hands
    .map((h) => {
      return { ...h, type: checkHandType(h.hand) };
    })
    .sort((a, b) => b.type - a.type)
    .reduce(
      (acc, cur) => {
        if (acc[cur.type]) {
          return { ...acc, [cur.type]: [...acc[cur.type], cur] };
        }
        return { ...acc, [cur.type]: [cur] };
      },
      {} as Record<number, Record<string, number | string>[]>
    );
  let newHands = [] as Record<string, number | string>[];

  for (let i = 7; i >= 0; i--) {
    newHands.push(
      ...(byHighestHand?.[i] || []).sort((a, b) => {
        return compareHands(a, b);
      })
    );
  }

  console.log("\n");
  console.log(
    [...newHands]
      .reverse()
      .map((c) => c.hand + " " + c.bid)
      .join("\n")
  );
  return newHands
    .reverse()
    .reduce((acc, cur, index) => acc + (cur.bid as number) * (index + 1), 0);
};
