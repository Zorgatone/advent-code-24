import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

// NOTE: no validation
const parseLine = (line: string): [number, number] => {
  let numStr1: string = undefined!;
  let numStr2: string = undefined!;

  for (
    let index = 0, separatorIndex = -1, length = line.length;
    index < length;
    index++
  ) {
    const char = line[index];

    if (char === " " && separatorIndex < 0) {
      separatorIndex = index;
      numStr1 = line.substring(0, separatorIndex);
    } else if (char !== " " && separatorIndex > -1) {
      numStr2 = line.substring(separatorIndex);
    }
  }

  return [+numStr1!, +numStr2!];
};

const readData = async (
  fileName: string,
  callBack: (line: string) => void
): Promise<void> => {
  const fileStream = createReadStream(fileName, { encoding: "utf-8" });
  const rl = createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    callBack(line);
  }
};

const sortFn = (a: number, b: number) => b - a;

// NOTE: no validation
const listDiff = (listLeft: number[], listRight: number[]): number => {
  const sortedLeft = listLeft.sort(sortFn);
  const sortedRight = listRight.sort(sortFn);

  let distance: number = 0;

  for (let index = 0, length = listLeft.length; index < length; index++) {
    distance += Math.abs(sortedLeft[index] - sortedRight[index]);
  }

  return distance;
};

// https://adventofcode.com/2024/day/1
const main = () => {
  const listLeft: number[] = [];
  const listRight: number[] = [];

  const parseCallback = (line: string) => {
    const [left, right] = parseLine(line);

    listLeft.push(left);
    listRight.push(right);
  };

  readData("data/day1.txt", parseCallback)
    .then(() => {
      const totalDistance = listDiff(listLeft, listRight);
      console.log(`Result: ${totalDistance}`);
    })
    .catch((error) => {
      console.error(error);
    });
};

main();
