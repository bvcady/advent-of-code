import * as prior from "./01";

export const solution = (file: string): string | number => {
  const input = prior.getInput(file);

  let total = 0;
  input.forEach((field, index) => {
    console.log("checking field", index);
    const rows = field.split("\n").map((line) => line.trim());

    console.log(rows.join("\n"));

    const checkMirror = (mirroredOpt: number, input: string[]) => {
      let b = mirroredOpt;
      let a = mirroredOpt + 1;
      let inputBeforeB = [...input].slice(0, mirroredOpt);
      let inputAfterA = [...input].slice(mirroredOpt + 2, Infinity);
      let trueMirror = true;
      let totSmudges = 0;

      while (
        b >= 0 &&
        a < input.length &&
        trueMirror === true &&
        totSmudges <= 1
      ) {
        const nSmudges = input[b].split("").reduce((smudges, char, i) => {
          if (char !== input[a][i]) {
            return smudges + 1;
          }
          return smudges;
        }, 0);

        totSmudges += nSmudges;

        if (totSmudges <= 1) {
          trueMirror = true;
        } else {
          trueMirror = false;
        }

        a++;
        b--;
      }

      if (trueMirror && totSmudges === 1) {
        inputBeforeB.forEach((l) => console.log("\x1b[33m%s\x1b[0m", l));
        console.log("\x1b[33m%s\x1b[0m", input[mirroredOpt]);
        console.log("\x1b[43m%s\x1b[0m", "-".repeat(input[0].length));
        console.log("\x1b[33m%s\x1b[0m", input[mirroredOpt + 1]);
        inputAfterA.forEach((l) => console.log("\x1b[33m%s\x1b[0m", l));
        // // console.log("\n");
        console.log("true mirror at", mirroredOpt + 1);
      }

      return trueMirror && totSmudges === 1 ? mirroredOpt : null;
    };

    const allMirroredOptRows = rows.reduce((opts, row, i) => {
      const current = row;
      const next = rows[i + 1];
      const nSmudges = current.split("").reduce((smudges, char, _i) => {
        if (char !== next?.[_i]) {
          return smudges + 1;
        }
        return smudges;
      }, 0);

      return nSmudges <= 1 ? [...opts, i] : [...opts];
    }, [] as number[]);

    let horizontals = 0;
    console.log("--- rows ---");
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
      const current = column;
      const next = columns[i + 1];
      const nSmudges = current.split("").reduce((smudges, char, _i) => {
        if (char !== next?.[_i]) {
          return smudges + 1;
        }
        return smudges;
      }, 0);

      return nSmudges <= 1 ? [...opts, i] : [...opts];
    }, [] as number[]);

    let verticals = 0;
    console.log("--- columns ---");
    allMirroredOptCols.forEach((mir, _i) => {
      const result = checkMirror(mir, columns);
      if (typeof result === "number") {
        verticals += result + 1;
      }
    });

    console.log(horizontals, verticals);
    total += horizontals + verticals;
  });

  return total;
};
