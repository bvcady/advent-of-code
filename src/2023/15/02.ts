import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const input = prior.getInput(file);

  const boxes = new Array(256)
    .fill("")
    .map((_) => new Map<string, number>()) as Map<string, number>[];

  const commands = input.split(",");
  const hashNums = (content: string) =>
    content
      .split("")
      .map((char) => char.charCodeAt(0))
      .reduce((totalCount, cur) => {
        return ((totalCount + cur) * 17) % 256;
      }, 0);

  const isAdd = (content: string) => {
    return content.includes("=");
  };

  commands.forEach((c) => {
    if (isAdd(c)) {
      const chars = c.split("=")?.[0];
      const val = c.split("=")?.[1];
      const boxN = hashNums(chars);
      console.log(c, boxN, boxes?.[boxN].set(chars, Number(val)));
    } else {
      const chars = c.split("-")?.[0];
      const boxN = hashNums(c.split("-")?.[0]);
      boxes[boxN].delete(chars);
    }
  });

  const totalCountAll = boxes.reduce((totalCount, currentBox, index) => {
    let vals = [] as number[];
    currentBox.forEach((entry) => vals.push(entry));
    return (
      totalCount +
      (index + 1) *
        vals.reduce(
          (boxtotalCountal, currentInBox, indexOfBoxItem) =>
            boxtotalCountal + (indexOfBoxItem + 1) * currentInBox,
          0
        )
    );
  }, 0);

  return totalCountAll;
};
