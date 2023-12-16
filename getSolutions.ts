import fs, { readFileSync } from "node:fs";
import path from "node:path";
const prompt = require("prompt-sync")({ sigint: true });

const args = process.argv.slice(2);

const y = args[0];
const d = args[1];

const solveSolutions = async () => {
  let inputOne: string;
  let inputTwo: string;

  let year = y;
  let day = d;
  let test = args[2];

  if (!(year && day)) {
    if (!year) {
      const yearInput = prompt(
        `What year? (defaults to ${new Date().getFullYear()}): `,
        new Date().getFullYear()
      );
      year = yearInput.toString().trim();
      console.log(yearInput);
    }

    if (year && !Number(year)) {
      return console.log("Next time please provide a number as a year.");
    }

    if (!day) {
      const dayInput = prompt(
        `What day? (defaults to ${("0" + new Date().getDate()).slice(-2)}): `,
        new Date().getDate()
      );
      day = dayInput.toString().trim();
      console.log(dayInput);
    }

    if (day && !Number(day)) {
      return console.log("Next time please provide a number as a day.");
    }
  }

  if (args[2] !== "test") {
    const autocomplete = ["y", "n", "yes", "no"];
    const defaultOption = "yes";
    const testInput = prompt(
      `Running for test? (defaults to ${defaultOption}): `,
      defaultOption,
      {
        autocomplete,
      }
    )
      ?.toString()
      ?.trim();

    if (!autocomplete?.includes(testInput)) {
      return console.log("Please only select [yes/no] or [y/n]");
    }
    test = testInput === "yes" || testInput === "y" ? "test" : "";
    console.log(testInput);
  }

  if (test !== "test") {
    inputOne = `./input/${year}/${day}/input-one.txt`;
    inputTwo = `./input/${year}/${day}/input-two.txt`;
  } else {
    inputOne = `./input/${year}/${day}/test-input-one.txt`;
    inputTwo = `./input/${year}/${day}/test-input-two.txt`;
  }

  const excerciseOneExists = fs.existsSync(`./src/${year}/${day}/01.ts`);
  if (!excerciseOneExists) {
    return console.log(
      `The excercise file was empty for ${year} - ${day} - excercise part one`
    );
  }

  const inputOneExists = fs.existsSync(inputOne);
  const inputTwoExists = fs.existsSync(inputTwo);

  if (!inputOneExists) {
    return console.log(
      `The input file (part one) was empty for ${year} - ${day}`
    );
  }
  if (!inputTwoExists) {
    return console.log(
      `The input file (part two) was empty for ${year} - ${day}`
    );
  }

  const {
    solution: firstSolution,
  }: { solution: (input: string) => Promise<string | number> } = await import(
    `./src/${year}/${day}/01.ts`
  );

  const excerciseTwoExists = fs.existsSync(`./src/${year}/${day}/02.ts`);
  if (!excerciseTwoExists) {
    return console.log(
      `The excercise file was empty for ${year} - ${day} - excercise part two`
    );
  }

  const {
    solution: secondSolution,
  }: { solution: (input: string) => Promise<string | number> } = await import(
    `./src/${year}/${day}/02.ts`
  );

  const solOne = await firstSolution(inputOne);
  const solTwo = await secondSolution(inputTwo);

  const testAnswersExists = fs.existsSync(
    path.join(__dirname, `input/${year}/${day}/test-output.txt`)
  );

  const testAnswers = testAnswersExists
    ? readFileSync(
        path.join(__dirname, `input/${year}/${day}/test-output.txt`)
      ).toString()
    : "";

  const testAnswerOne = testAnswers ? testAnswers?.split("\n")?.[0] : undefined;
  const testAnswerTwo = testAnswers ? testAnswers?.split("\n")?.[1] : undefined;

  if (!solOne && !solTwo) {
    return console.log(
      `There are no ${test ? "test " : ""}answers yet for this day.`
    );
  }

  const response: string[] = ["Here are your answers: \n"];

  const checkTestAnswers = () => {
    if (solOne) {
      response.push(`The test answer to part 1 is ${solOne}.`);
      response.push(`Expected awnser: ${testAnswerOne}`);
      response.push(
        solOne.toString() === testAnswerOne
          ? "🎉 The provided answer is correct"
          : "😠 The provided anser is incorrect"
      );
      //
    } else {
      response.push(`There is no test answer for part 1 (yet).`);
    }
    response.push("\n");
    if (solTwo) {
      response.push(`The test answer to part 2 is ${solTwo}.`);
      response.push(`Expected awnser: ${testAnswerTwo}`);
      response.push(
        solTwo.toString() === testAnswerTwo
          ? "🎉 The provided answer is correct"
          : "😠 The provided anser is incorrect"
      );
      //
    } else {
      response.push(`There is no test answer for part 2 (yet).`);
    }
    return console.log(
      solOne?.toString() === testAnswerOne &&
        solTwo?.toString() === testAnswerTwo
        ? "\x1b[42m"
        : "\x1b[43m",
      response?.join("\n")?.trim()
    );
  };

  const logRealAwnsers = () => {
    if (solOne) {
      response.push(`Your answer to part 1 is ${solOne}.`);
    } else {
      response.push(`There is no answer for part 1 (yet).`);
    }
    response.push("\n");
    if (solTwo) {
      response.push(`Your answer to part 2 is ${solTwo}.`);
      //
    } else {
      response.push(`There is no answer for part 2 (yet).`);
    }
    return console.log("\x1b[45m", response?.join("\n")?.trim());
  };

  if (test) {
    checkTestAnswers();
  } else logRealAwnsers();
};
solveSolutions();
