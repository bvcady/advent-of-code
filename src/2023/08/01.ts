import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent;
};

type Node = { from: string; dir: { L: string; R: string } };

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);

  const [directions, nodesRaw] = input.split("\n\n");

  const nodes = nodesRaw.split("\n").map((node) => {
    const [from, LRraw] = node.split(" = ");
    const dir = LRraw.match(/([A-Z])\w+/g) || [];
    const [L, R] = dir;
    return { from, dir: { L, R } };
  }) as Node[];

  let position = nodes.find((node) => node.from === "AAA") as Node | undefined;
  let dirPos = 0;
  while (position?.from !== "ZZZ") {
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
