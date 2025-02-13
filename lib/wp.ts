import { WeightType } from "@/types/DSSType";

export class WP {
  static poweredAlternative = (
    matrixScore: number[][],
    matrixWeightType: WeightType[],
    matrixWeight: number[]
  ) => {
    return matrixScore.map((row) => {
      return row.map((score, idx) => {
        if (matrixWeightType[idx] === "benefit") {
          return Math.pow(score, matrixWeight[idx]);
        } else {
          return Math.pow(score, -matrixWeight[idx]);
        }
      });
    });
  };

  static finalScore = (poweredAlternative: number[][]) => {
    return poweredAlternative.map((normalizedRow) => {
      return normalizedRow.reduce((score, value) => score * value, 1);
    });
  };

  static normalizedFinalScore = (finalScore: number[]) => {
    const sum = finalScore.reduce((prev, current) => prev + current, 0);
    return finalScore.map((value) => {
      return value / sum;
    });
  };
}
