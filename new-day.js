const fs = require("fs");
const prompt = require("prompt-sync")({ sigint: true });
const path = require("path");
const arguments = process.argv.slice(2);

const y = arguments[0];
const d = arguments[1];

const checkAndCreateFile = ({
  fileType,
  pathString,
  fileContent,
  year,
  day,
}) => {
  const fileExists = fs.existsSync(path.join(__dirname, pathString));

  if (fileExists) {
    console.log(
      "\x1b[100m",
      `⚠️ There already exists file with type [${fileType}] for ${year} - ${day}.`
    );
    return;
  }

  if (!fileExists) {
    fs.writeFile(path.join(__dirname, pathString), fileContent, (err) => {
      if (err) {
        return console.error(err);
      }
    });
  }
};

const createNewDay = async (y, d) => {
  let year = y;
  let day = d;

  if (!(year && day)) {
    if (!year) {
      const yearInput = prompt("What year?\n", new Date().getFullYear());
      year = yearInput;
      console.log(yearInput);
    }

    if (year && !Number(year)) {
      return console.log("Next time please provide a number as a year.");
    }

    if (!day) {
      const dayInput = prompt("What day?\n", new Date().getDate());
      day = dayInput;
      console.log(dayInput);
    }

    if (day && !Number(day)) {
      return console.log("Next time please provide a number as a day.");
    }
  }

  const part01 = fs.readFileSync(
    path.join(__dirname, `templates/01.ts`),
    "utf-8"
  );
  const part02 = fs.readFileSync(
    path.join(__dirname, `templates/02.ts`),
    "utf-8"
  );

  fs.mkdir(
    path.join(__dirname, `input/${year}/${day}`),
    { recursive: true },
    (err) => {
      if (err) {
        return console.log(
          `Could not make new input folder for ${year} - ${day}`
        );
      }

      checkAndCreateFile({
        pathString: `input/${year}/${day}/input.txt`,
        fileType: "input",
        fileContent: "[insert excercise input]",
        year,
        day,
      });

      checkAndCreateFile({
        pathString: `input/${year}/${day}/test-input.txt`,
        fileType: "test input",
        fileContent: "[insert test input]",
        year,
        day,
      });

      checkAndCreateFile({
        pathString: `input/${year}/${day}/test-output.txt`,
        fileType: "test output",
        fileContent: "[expected output part 1]\n[expected output part 2]",
        year,
        day,
      });
    }
  );

  fs.mkdir(
    path.join(__dirname, `src/${year}/${day}`),
    { recursive: true },
    (err) => {
      if (err) {
        return console.log(
          `Could not make new excercise folder for ${year} - ${day}`
        );
      }

      checkAndCreateFile({
        pathString: `src/${year}/${day}/01.ts`,
        fileType: "excercise part one template",
        fileContent: part01,
        year,
        day,
      });

      checkAndCreateFile({
        pathString: `src/${year}/${day}/02.ts`,
        fileType: "excercise part two template",
        fileContent: part02,
        year,
        day,
      });
    }
  );

  console.log(
    "\x1b[46m",
    `👍 Succesfully created day ${day} in ${year} for you!`
  );
};

createNewDay(y, d);
