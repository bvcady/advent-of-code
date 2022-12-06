const fs = require("fs");
const path = require("path");

const arguments = process.argv.slice(2);

const year = arguments[0];
const day = arguments[1];

if (!(year && day)) {
  console.error(`Please provide a year and a day`);
}

if (!Number(year) || !Number(day)) {
  console.error(`Please provide a year and a day as a number`);
}

const part01 = fs.readFileSync(path.join(__dirname, `templates/01.ts`), "utf-8");
const part02 = fs.readFileSync(path.join(__dirname, `templates/02.ts`), "utf-8");

const createNewDay = (year, day) => {
  fs.mkdir(path.join(__dirname, `input/${year}/${day}`), { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }

    fs.writeFile(
      path.join(__dirname, `input/${year}/${day}/input.txt`),
      "[insert input]",
      (err) => {
        if (err) {
          return console.error(err);
        }
      },
    );

    fs.writeFile(
      path.join(__dirname, `input/${year}/${day}/test-input.txt`),
      "[insert test input]",
      (err) => {
        if (err) {
          return console.error(err);
        }
      },
    );
  });

  fs.mkdir(path.join(__dirname, `src/${year}/${day}`), { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }

    fs.writeFile(path.join(__dirname, `src/${year}/${day}/01.ts`), part01, (err) => {
      if (err) {
        return console.error(err);
      }
    });

    fs.writeFile(path.join(__dirname, `src/${year}/${day}/02.ts`), part02, (err) => {
      if (err) {
        return console.error(err);
      }
    });
  });

  console.log(`Created ${day} for you!`);
};

createNewDay(year, day);
