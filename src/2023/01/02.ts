import * as prior from "./01";

export const solution = (file: string): string | number => {
  const input = prior.getInput(file);

  const options = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  const patFW = /(one|two|three|four|five|six|seven|eight|nine|[0-9])/;
  const patBW = /(eno|owt|eerht|ruof|evif|xis|neves|thgie|enin|[0-9])/;

  const matchingWords = input.map((line: string) => {
    const makeForward = (line: string) => {
      console.log(line);
      const match = line.match(patFW)?.[0];

      return match?.length === 1 ? match : options.indexOf(match || "");
    };

    const makeBackward = (line: string) => {
      let newLine = line.split("")?.reverse().join("");
      console.log(newLine);

      const reversedOptions = options.map((opt) =>
        opt.split("").reverse().join("")
      );
      const match = newLine.match(patBW)?.[0];
      return match?.length === 1 ? match : reversedOptions.indexOf(match || "");
    };

    const firstFromFront = makeForward(line);
    const firstFromBack = makeBackward(line);

    const joinedNumbers = Number([firstFromFront, firstFromBack].join(""));
    console.log(joinedNumbers);
    return joinedNumbers;
  });

  return matchingWords.reduce((acc, cur) => (acc += cur), 0);
};
