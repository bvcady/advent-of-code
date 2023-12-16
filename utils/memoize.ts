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

export class Memo {
  public stored: Map<string, unknown>;
  public id: string;

  constructor(name?: string) {
    this.stored = new Map<string, unknown>();
    this.id = name || randomUUID();
  }

  public memoize<Args extends unknown[], Result>(
    originalFunction: (...args: Args) => Result
  ) {
    return (...args: Args) => {
      const key = JSON.stringify(args);
      if (this.stored.has(key)) {
        return this.stored.get(key)! as Result;
      }

      const result = originalFunction(...args);
      this.stored.set(key, result);
      return result;
    };
  }
}
