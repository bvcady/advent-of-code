import * as prior from "./01";

export const solution = (file: string): string | number => {
  const { columns, instructions } = prior.getAllData(file);

  instructions.map((inst) => {
    const amount = inst.amount;
    const fromArray = columns[inst.from - 1];
    const toArray = columns[inst.to - 1];
    const itemsToMove = [...fromArray].slice(-amount).filter((item) => !!item);

    const fromArrayMinus = [...fromArray].slice(0, fromArray.length - amount);
    const toArrayPlus = [...toArray, ...itemsToMove];

    columns[inst.from - 1] = fromArrayMinus;
    columns[inst.to - 1] = toArrayPlus;
  });

  return columns.reduce((acc, dat) => acc + dat.pop(), "");
};
