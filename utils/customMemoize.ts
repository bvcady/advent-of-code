import { randomUUID } from "crypto";
// export function memoize<Args extends unknown[], Result>(
//   func: (...args: Args) => Result
// ): (...args: Args) => Result {
//   const stored = new Map<string, Result>();
//   return (...args) => {
//     const k = JSON.stringify(args);
//     if (stored.has(k)) {
//       return stored.get(k)!;
//     }
//     const result = func(...args);
//     stored.set(k, result);
//     return result;
//   };
// }

export class DirectionalMemoization {
  public stores: Map<string, unknown>[];
  public id: string;
  public n: number;

  constructor(name?: string) {
    this.stores = [
      new Map<string, unknown>(), // north
      new Map<string, unknown>(), // west
      new Map<string, unknown>(), // south
      new Map<string, unknown>(), // east
    ];

    this.id = name || randomUUID();
    this.n = 0;
  }

  public clearMemo() {
    this.stores = [
      new Map<string, unknown>(), // north
      new Map<string, unknown>(), // west
      new Map<string, unknown>(), // south
      new Map<string, unknown>(), // east
    ];
    this.n = 0;
  }

  public memoize<Args extends unknown[], Result>(
    originalFunction: (...args: Args) => Result
  ) {
    return (...args: Args) => {
      const currentStore = args?.[0] as number;
      const currentBoulders = JSON.stringify(args?.[1]);
      this.n++;

      if (currentStore < 0) {
        const result = originalFunction(...args);
        return result;
      }

      if (this.stores[currentStore].has(currentBoulders)) {
        if (currentStore === 0) {
          return false;
        }
        return this.stores[currentStore].get(currentBoulders) as Result;
      }
      const result = originalFunction(...args);
      this.stores[currentStore].set(currentBoulders, result);
      return result;
    };
  }
}
