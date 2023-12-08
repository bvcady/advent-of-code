import * as prior from "./01";

type Node = { from: string; dir: { L: string; R: string } };
export const solution = (file: string): string | number => {
  const input = prior.getInput(file);

  const [directions, nodesRaw] = input.split("\n\n");

  console.log(directions);

  const nodes = nodesRaw.split("\n").map((node) => {
    const [from, LRraw] = node.split(" = ");
    const dir = LRraw.replace("(", "")
      .replace(")", "")
      .split(",")
      .map((i) => i.trim());
    const [L, R] = dir;
    return { from, dir: { L, R } };
  }) as Node[];

  let positions = nodes.filter((node) => node.from.endsWith("A")) as Node[];
  let dirPos = 0;
  let allFinished = false;

  const getPath = (pos: Node) => {
    let position = pos as Node | undefined;
    let dirPos = 0;
    while (!position?.from.endsWith("Z")) {
      const instruction = directions.charAt(dirPos % directions.length);
      const current = position;
      // @ts-ignore
      const nextName = current?.dir[instruction];
      const next = nodes.find((node) => node.from === nextName);

      position = next;
      dirPos++;
    }

    return dirPos;
  };

  const dirs = [...positions].map((p) => getPath(p));
  console.log(dirs);

  // I did not write a script but I knew I'd have to use a way to find the least common multiple of the 6 paths.
  // I used an online source that gave me the answer.
  // I managed to copy / write a script myself after:

  const getGCD = (a: number, b: number): number => {
    if (b === 0) {
      return a;
    }
    return getGCD(b, a % b);
  };

  const getLCMofArray = (input: number[], index: number): number => {
    if (index === input.length - 1) {
      return input[index];
    }

    let a = input[index];
    let b = getLCMofArray(input, index + 1);

    return (a * b) / getGCD(a, b);
  };

  const lcm = getLCMofArray(dirs, 0);
  console.log(lcm);

  //  Below is a brute force method, which would take ours.

  // while (!allFinished) {
  //   if (dirPos % 10000 === 0) {
  //     console.log(dirPos);
  //   }
  //   const instruction = directions.charAt(dirPos % directions.length);

  //   if (positions.every((p) => p.from?.endsWith("Z"))) {
  //     allFinished = true;
  //   }

  //   [...positions].forEach((p) => {
  //     const current = positions.indexOf(p);
  //     // @ts-ignore
  //     const next = nodes.find((node) => node.from === p.dir[instruction]);
  //     positions[current] = next as Node;
  //   });

  //   dirPos++;
  // }
  return 0;
};

// const current = position;
// // @ts-ignore
// const nextName = current?.dir[instruction];
// const next = nodes.find((node) => node.from === nextName);

// if (dirPos < 100)
//   console.log(
//     [
//       position?.from,
//       "-->",
//       instruction,
//       "[",
//       position?.dir.L,
//       ",",
//       position?.dir.R,
//       "]",
//       "-->",
//       nextName,
//     ].join(" ")
//   );
// position = next;
// return next?.from.endsWith("Z") || false;
