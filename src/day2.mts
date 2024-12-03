import { fileURLToPath } from "node:url";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

// NOTE: no validation
const parseLine = (line: string): number[] =>
  line.split(" ").map((str) => +str);

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

const reportIsSafe1 = (levels: number[]): boolean => {
  if (levels.length < 2 || levels[0] === levels[1]) {
    return false;
  }

  const direction: "asc" | "desc" = levels[0] < levels[1] ? "asc" : "desc";

  return levels.every((level, index, levels) => {
    if (index < 1) {
      return true;
    }

    const diff = Math.abs(level - levels[index - 1]);

    if (diff < 1 || diff > 3) {
      return false;
    }

    switch (direction) {
      case "asc":
        return level > levels[index - 1];
      case "desc":
        return level < levels[index - 1];
      default:
        throw new Error("An unexpected error occurred!");
    }
  });
};

// For every element try to check if the report is safe by removing that single element
const reportIsSafe2 = (levels: number[]): boolean =>
  new Array<undefined>(levels.length)
    .fill(undefined)
    .map((_, i) => {
      const newArray = [...levels];
      newArray.splice(i, 1);
      return newArray;
    })
    .some(reportIsSafe1);

const countSafeReports1 = (reports: number[][]): number =>
  reports.reduce((sum, report) => (reportIsSafe1(report) ? sum + 1 : sum), 0);

const countSafeReports2 = (reports: number[][]): number =>
  reports.reduce((sum, report) => (reportIsSafe2(report) ? sum + 1 : sum), 0);

// https://adventofcode.com/2024/day/2
export function main() {
  const reports: number[][] = [];

  const parseCallback = (line: string) => {
    const levels = parseLine(line);

    reports.push(levels);
  };

  console.log("Advent of Code: Day 2\n");

  readData("data/day2.txt", parseCallback)
    .then(() => {
      const safeReportCount1 = countSafeReports1(reports);
      console.log(
        `Pt.1 - Safe reports count (no bad levels allowed): ${safeReportCount1}`
      );
      const safeReportCount2 = countSafeReports2(reports);
      console.log(
        `Pt.2 - Safe reports count (single bad level allowed): ${safeReportCount2}`
      );
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
