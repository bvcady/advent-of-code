import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent;
};

export const getAllData = (
  file: string,
): { columns: string[][]; instructions: { amount: number; from: number; to: number }[] } => {
  const input = getInput(file);

  const stacks = input.split("\n\n")[0].split("\n");

  const stacksData = stacks.slice(0, stacks.length - 1);

  const hooks = /(\] )|( \[)|(\])|(\[)/g;

  const fromStacks = (): string[][] => {
    const rows = stacksData
      .map((row) =>
        row
          .replace(hooks, "*")
          .split("*")
          .filter((item) => !!item)
          .map((item) => {
            if (!(item.length > 1)) {
              return item;
            }

            const arr: string[] = [];
            let length = item.length;
            while (length > 0) {
              arr.push("*");
              length = length - 3;
              length = length - 1;
            }

            return arr;
          }),
      )
      .map((row) =>
        row.reduce((acc, row) => {
          if (typeof row === "number") {
            return [...acc, row];
          }
          return [...acc, ...row];
        }, []),
      );

    const cols = new Array(rows[0].length).fill([]);

    rows.forEach((row) =>
      (row as string[]).forEach((item, index) => {
        if (item !== "*") {
          cols[index] = [...cols[index], item];
        }
      }),
    );

    return cols.map((col) => col.reverse());
  };

  const columns = fromStacks();

  const instructionsRaw = input.split("\n\n")[1];

  const fromInstructions = (string: string) => {
    const numbers = string.match(/\d+/g);
    const amount = Number(numbers?.[0]);
    const from = Number(numbers?.[1]);
    const to = Number(numbers?.[2]);

    return { amount, from, to };
  };

  return { columns, instructions: instructionsRaw.split("\n").map(fromInstructions) };
};

export const solution = (file: string): string | number => {
  const { columns, instructions } = getAllData(file);

  instructions.map((inst) => {
    const amount = inst.amount;

    for (let i = 0; i < amount; i++) {
      const itemToMove = [...columns[inst.from - 1]].pop() as string;
      const fromArrayMinus = [...columns[inst.from - 1]].slice(
        0,
        columns[inst.from - 1].length - 1,
      );
      const toArrayPlus = [...columns[inst.to - 1], itemToMove];

      columns[inst.from - 1] = fromArrayMinus;
      columns[inst.to - 1] = toArrayPlus;
    }
  });

  return columns.reduce((acc, dat) => acc + dat.pop(), "");
};
