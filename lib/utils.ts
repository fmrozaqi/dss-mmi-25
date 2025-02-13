import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const rank = (finalScore: number[]) => {
  const sortedIndices = [...finalScore.keys()].sort(
    (a, b) => finalScore[b] - finalScore[a]
  );
  const result: number[] = [];
  sortedIndices.forEach((originalIndex, rank) => {
    result[originalIndex] = rank + 1;
  });
  return result;
};

export const normalizedWeight = (matrixWeight: number[]) => {
  const sum = matrixWeight.reduce((sum, weight) => sum + weight, 0);
  return matrixWeight.map((weight) => weight / sum);
};

export function createMatrixString(
  matrix: number[][],
  rowHeaders: string[] = [],
  colHeaders: string[] = []
): string[][] {
  const result: string[][] = [];

  if (colHeaders.length > 0) {
    const headerRow: string[] = rowHeaders.length ? [""] : [];
    colHeaders.forEach((header) => {
      headerRow.push(header);
    });
    result.push(headerRow);
  }

  matrix.forEach((row, rowIndex) => {
    const resultRow: string[] = [];
    if (rowHeaders.length > 0) {
      resultRow.push(rowHeaders[rowIndex]);
    }
    row.forEach((cell) => {
      resultRow.push(cell.toFixed(3));
    });
    result.push(resultRow);
  });

  return result;
}
