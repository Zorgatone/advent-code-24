import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

const readData = async (fileName: string): Promise<string> =>
  await readFile(fileName, { encoding: "utf-8" });

const getMulOperation = (chars: string[]): [number, number] | null => {
  let op1: number = Number.NaN;
  let op2: number = Number.NaN;

  if (chars.slice(0, 4).join("") !== "mul(") {
    return null;
  }

  let currentIndex = 4;
  let strAcc = "";
  let commaFound = false;
  while (true) {
    const currChar = chars[currentIndex];

    if (currChar.length > 1) {
      // unsupported character represented on multiple codepoints
      return null;
    }

    if (
      "0".charCodeAt(0) <= currChar.charCodeAt(0) &&
      currChar.charCodeAt(0) <= "9".charCodeAt(0)
    ) {
      // It's a digit character part of the number we're multiplying [0-9]
      strAcc += currChar;
    } else if (strAcc.length > 0 && currChar === "," && !commaFound) {
      op1 = Number(strAcc);
      if (Number.isNaN(op1) || !isFinite(op1)) {
        return null; // Failed to parse it
      }
      strAcc = "";
      commaFound = true;
    } else if (commaFound && currChar === ")") {
      op2 = Number(strAcc);
      if (Number.isNaN(op2) || !isFinite(op2)) {
        return null; // Failed to parse it
      }
      return [op1, op2];
    } else {
      return null;
    }

    ++currentIndex;
  }
};

const mul = (n1: number, n2: number) => n1 * n2;

const parseData = (data: string): Array<[number, number]> => {
  const mulOps: Array<[number, number]> = [];

  const chars = Array.from(data);
  for (let index = 0, length = chars.length; index < length; index++) {
    if (chars[index] === "m") {
      const sliced = chars.slice(index);
      const mulOp = getMulOperation(sliced);
      if (mulOp) {
        mulOps.push(mulOp);
      }
    }
  }

  return mulOps;
};

// https://adventofcode.com/2024/day/3
export function main() {
  console.log("Advent of Code: Day 3\n");

  readData("data/day3.txt")
    .then((data) => {
      const parsedData = parseData(data);

      if (parsedData.length < 1) {
        throw new Error("Empty data!");
      }

      const mulOpsSum = parsedData.reduce(
        (acc, [n1, n2]) => acc + mul(n1, n2),
        0
      );

      console.log(`Pt.1 - mult() operations sum: ${mulOpsSum}`);
    })
    .catch((error: unknown) => {
      console.error(error);
    });
}

if (
  import.meta.url.startsWith("file:") &&
  process.argv[1] === fileURLToPath(import.meta.url)
) {
  // Main ESM module
  main();
}

export default main;
