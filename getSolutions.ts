const args = process.argv.slice(2);

const y = args[0];
const d = args[1];

const test = args[2];

if (!(y && d)) {
  console.error(`Please provide a year and a day`);
}

if (!Number(y) || !Number(d)) {
  console.error(`Please provide a year and a day as a number`);
}

let input: string;

if (test !== "test ") {
  input = `./input/${y}/${d}/input.txt`;
} else {
  input = `./input/${y}/${d}/test-input.txt`;
}

if (!input) {
  console.error("The input was empty.");
}

const solveSolutions = async () => {
  const { solution: firstSolution }: { solution: (input: string) => string | number } =
    await import(`./src/${y}/${d}/01.ts`);
  const { solution: secondSolution }: { solution: (input: string) => string | number } =
    await import(`./src/${y}/${d}/02.ts`);

  let answerString = ``;

  const solOne = firstSolution(input);
  const solTwo = secondSolution(input);

  if (!solOne && !solTwo) {
    return console.log(`There are no ${test ? "test " : ""}answers yet for this day.`);
  }

  if (solOne) {
    answerString = answerString.concat(`The ${test ? "test " : ""}answer to part 1 is ${solOne}.`);
  } else {
    answerString = answerString.concat(
      `There is no ${test ? "test " : ""}answer for part 1 (yet).`,
    );
  }

  if (solTwo) {
    answerString = answerString.concat(` The ${test ? "test " : ""}answer to part 2 is ${solTwo}.`);
  } else {
    answerString = answerString.concat(
      ` There is no ${test ? "test " : ""}answer for part 2 (yet).`,
    );
  }

  return console.log(answerString);
};

solveSolutions();
