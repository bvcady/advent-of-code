import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = (file: string): string | number => {
  const input = getInput(file);
  const aroundEachSymbol = input
    .map((line, _index) => {
      const charsInLine = line.split("");
      return charsInLine
        .map((char, index) => {
          const match = char.match(/([^0-9|\.])/);

          if (match) {
            return {
              index,
              symbol: match?.[0],
              lines: [input[_index - 1], input[_index], input[_index + 1]],
            };
          } else return undefined;
        })
        .filter((item) => item !== undefined);
    })
    .filter((res) => res !== undefined);

  const sol = aroundEachSymbol.map(
    (s, _index) =>
      s?.map((item) => {
        const lines = item?.lines || [];
        const symbol = item?.symbol || "";
        const index = item?.index || -1;

        const left = lines[1].slice(0, index);
        const right = lines[1].slice(index + 1, 1000);

        const nLeft = Number(
          left.endsWith(".") ? 0 : left.split(".")?.slice(-1)?.[0]
        );

        const nRight = Number(
          right.startsWith(".") ? 0 : right.split(".")?.[0]
        );

        const checkFromMiddle = (
          line: string,
          startingNumber: string,
          checkingLeft?: boolean,
          checkingRight?: boolean
        ) => {
          let inc = 0;
          let leftdot = checkingRight;
          let rightdot = checkingLeft;
          let number = startingNumber;
          while (inc < line.length) {
            inc = inc + 1;
            if (!leftdot) {
              if (line.charAt(index - inc)?.match(/[0-9]/)) {
                number = line.charAt(index - inc) + number;
              } else {
                leftdot = true;
              }
            }
            if (!rightdot) {
              if (line.charAt(index + inc)?.match(/[0-9]/)) {
                number = number + line.charAt(index + inc);
              } else {
                rightdot = true;
              }
            }
          }
          return Number(number);
        };

        const checkAside = (line: string) => {
          const left = checkFromMiddle(line, "", true, false);
          const right = checkFromMiddle(line, "", false, true);

          return left + right;
        };

        const above = lines[0]?.charAt(index);

        const nAbove =
          above === "."
            ? checkAside(lines[0])
            : checkFromMiddle(lines[0], above);

        const below = lines[2]?.charAt(index);

        const nBelow =
          below === "."
            ? checkAside(lines[2])
            : checkFromMiddle(lines[2], below);

        return nAbove + nBelow + nLeft + nRight;
      })
  );

  return sol.reduce(
    // @ts-ignore
    (total, cur) => total + cur?.reduce((t, c) => t + c, 0) || 0,
    0
  );
};
