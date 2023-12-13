import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n\n");
};

export const solution = (file: string): string | number => {
  const input = getInput(file);

  let total = 0;
  input.forEach((field, index) => {
    const rows = field.split("\n").map((line) => line.trim());

    const checkMirror = (mirroredOpt: number, input: string[]) => {
      let b = mirroredOpt;
      let a = mirroredOpt + 1;
      let inputBeforeB = [...input].slice(0, mirroredOpt);
      let inputAfterA = [...input].slice(mirroredOpt + 2, Infinity);
      let trueMirror = true;

      while (b >= 0 && a < input.length && trueMirror === true) {
        if (input[b] === input[a]) {
          trueMirror = true;
        } else {
          trueMirror = false;
        }

        a++;
        b--;
      }

      return trueMirror ? mirroredOpt : null;
    };

    const allMirroredOptRows = rows.reduce((opts, row, i) => {
      return row === rows[i + 1] ? [...opts, i] : opts;
    }, [] as number[]);

    let horizontals = 0;

    allMirroredOptRows.forEach((mir, _i) => {
      const result = checkMirror(mir, rows);
      if (typeof result === "number") {
        horizontals += 100 * (result + 1);
      }
    });

    const columns = field
      .split("\n")[0]
      .split("")
      .map((_, colIndex) =>
        field
          .split("\n")
          .map((row) => row[colIndex])
          .join("")
      );

    const allMirroredOptCols = columns.reduce((opts, column, i) => {
      return column === columns[i + 1] ? [...opts, i] : [...opts];
    }, [] as number[]);

    let verticals = 0;

    allMirroredOptCols.forEach((mir, _i) => {
      const result = checkMirror(mir, columns);
      if (typeof result === "number") {
        verticals += result + 1;
      }
    });

    total += horizontals + verticals;
  });

  return total;
};
