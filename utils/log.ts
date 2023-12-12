export const log = (input: unknown) => {
  if (["string", "number"].includes(typeof input)) {
    return console.log(input);
  }

  return console.log(JSON.stringify(input, null, 1));
};
