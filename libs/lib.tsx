import { IdealSolution } from "@/app/topsis/page";

export function formatArray(input: string[][]): string {
  return input
    .map((row, index) => {
      const formattedRow = row.join(" & ");
      return index === input.length - 1 ? formattedRow : formattedRow + " \\\\";
    })
    .join("\n");
}

export const matrixExpression = (input: string[][]) => `
    \\[
    \\begin{array}{ccc}
      ${formatArray(input)}
    \\end{array}
    \\]
  `;

export function convertToArrayOfArrays(input: number[]): string[][] {
  return input.map((num, index) => [
    `a${index + 1}`,
    num.toFixed(3).toString(),
  ]);
}

export function convertToRank(input: number[]): string[][] {
  return input.map((num, index) => [`Rank \\ ${index + 1}`, `a${num}`]);
}

export function formatMatrixNormalization(input: number[][]): string[][] {
  const header: string[] = [""];
  input[0].forEach((_, idx) => {
    header.push(`c${idx + 1}`);
  });
  const formattedRows = input.map((row, rowIndex) => {
    const formattedRow = row.map((num) => num.toFixed(3).toString());
    return [`w${rowIndex + 1}`, ...formattedRow];
  });

  return [header, ...formattedRows];
}

export function formatWeight(input: number[]): string[][] {
  const header: string[] = [];
  input.forEach((_, idx) => {
    header.push(`w${idx + 1}`);
  });
  const formattedWeight = input.map((num) => num.toFixed(3).toString());
  return [header, formattedWeight];
}

export function formatIdealSolution(input: IdealSolution[]): string[][] {
  const header: string[] = [];
  input.forEach((_, idx) => {
    header.push(`d${idx + 1}`);
  });
  const formattedISBest = input.map((is) => `+: \\ ${is.bestCase.toFixed(3)}`);
  const formattedISWorst = input.map(
    (is) => `-: \\ ${is.worstCase.toFixed(3)}`
  );
  return [header, formattedISBest, formattedISWorst];
}
