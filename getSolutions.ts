import fs, { readFile, readFileSync } from "node:fs";
import path from "node:path";
const prompt = require("prompt-sync")({ sigint: true });

const args = process.argv.slice(2);

const y = args[0];
const d = args[1];

const test = args[2];

const solveSolutions = async () => {
  let input: string;

  let year = y;
  let day = d;
  if (!(year && day)) {
    if (!year) {
      const yearInput = prompt("What year?\n", new Date().getFullYear());
      year = yearInput;
      console.log(yearInput);
    }

    if (year && !Number(year)) {
      console.log("Next time please provide a number as a year.");
      return;
    }

    if (!day) {
      const dayInput = prompt("What day?\n", new Date().getDate());
      day = dayInput;
      console.log(dayInput);
    }

    if (day && !Number(day)) {
      console.log("Next time please provide a number as a day.");
      return;
    }
  }

  if (test !== "test ") {
    input = `./input/${year}/${day}/input.txt`;
  } else {
    input = `./input/${year}/${day}/test-input.txt`;
  }

  const excerciseOneExists = fs.existsSync(`./src/${year}/${day}/01.ts`);
  if (!excerciseOneExists) {
    return console.log(
      `The excercise file was empty for ${year} - ${day} - excercise one`
    );
  }

  const inputExists = fs.existsSync(input);

  if (!inputExists) {
    return console.log(`The input file was empty for ${year} - ${day}`);
  }

  const {
    solution: firstSolution,
  }: { solution: (input: string) => string | number } = await import(
    `./src/${year}/${day}/01.ts`
  );

  const excerciseTwoExists = fs.existsSync(`./src/${year}/${day}/02.ts`);
  if (!excerciseTwoExists) {
    return console.log(
      `The excercise file was empty for ${year} - ${day} - excercise two`
    );
  }

  const {
    solution: secondSolution,
  }: { solution: (input: string) => string | number } = await import(
    `./src/${year}/${day}/02.ts`
  );

  const solOne = firstSolution(input);
  const solTwo = secondSolution(input);

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
        solOne.toString() === testAnswerTwo
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

// if (solOne) {
//   answerString =
//     answerString +
//     `The ${test ? "test " : ""}answer to part 1 is ${solOne}. ${
//       test ? `\nExpected awnser: ${testAnswerOne}` : ""
//     } ${
//       testAnswerOne === solOne.toString()
//         ? "\n🎉 The provided answer is correct"
//         : "\n😠 The provided anser is incorrect"
//     }`;
// } else {
//   answerString =
//     answerString + `There is no ${test ? "test " : ""}answer for part 1 (yet).`;
// }

// if (solTwo) {
//   answerString =
//     answerString +
//     `\n \nThe ${test ? "test " : ""}answer to part 2 is ${solTwo}. ${
//       test ? `\nExpected awnser: ${testAnswerTwo}` : ""
//     } ${
//       testAnswerTwo === solTwo.toString()
//         ? "\n🎉 The provided answer is correct"
//         : "\n😠 The provided anser is incorrect"
//     }`;
// } else {
//   answerString =
//     answerString +
//     ` There is no ${test ? "test " : ""}answer for part 2 (yet).`;
// }
