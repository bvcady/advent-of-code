# Advent of Code

Re-usable Advent of Code repo (updated 2023)

## Install tools

Run command:
`npm i`
This installs node, typescript and some cli tools.

## Create new excercise file:

Run `npm run new-day` and either directly provide `YYYY DD` to the CLI command like so `npm run new-day 2023 01` or wait for the prompt in the command line.

Entering no year and day for the prompt will default to the current Year and Day.

## What is then set up?

The previous command will generate 2 typescript files (`src/YYYY/DD/01.ts && 02.ts`) that will have reference to the input folder that contain 2 template input files for both 'test-input.txt' and 'input.txt'. These are automatically imported in the excercise files.

## Running test and actual excercise:

Run `npm run start` and either and either directly provide `YYYY DD` and `test` to the CLI command like so `npm run start 2023 01 test`. Similar to the `new-day` command you could also use the prompts.

Running the command with test will excecute your code based on the `test-input.txt` file. Otherwise it will run the actual input text.

This project does not use any testing library but has some feedback in the console when the code excecuted on the `test-input.txt` does not result in the correct test result expected output.

Any logs ran in the code are also logged in the terminal when running test or actual start commands.
