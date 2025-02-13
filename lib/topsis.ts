import { IdealSolution } from "@/app/topsis/page";
import { WeightType } from "@/types/DSSType";

export class TOPSIS {
  static normalizedMatrix = (matrixScore: number[][]) => {
    const denominator =
      matrixScore[0]?.map((_, colIndex) =>
        Math.sqrt(
          matrixScore.reduce((sum, row) => sum + (row[colIndex] ?? 0) ** 2, 0)
        )
      ) ?? [];
    return matrixScore.forEach((rowScore) => {
      return rowScore.map((score, idx) => {
        return score / denominator[idx];
      });
    });
  };

  static weightedNormalizedMatrix = (
    normalizedMatrix: number[][],
    matrixWeight: number[]
  ) => {
    return normalizedMatrix.map((rowScore) => {
      return rowScore.map((score, idx) => {
        return matrixWeight[idx] * score;
      });
    });
  };

  static idealSolutions = (
    matrixScore: number[][],
    matrixWeightType: WeightType[]
  ): IdealSolution[] => {
    const columnMinMax =
      matrixScore[0]?.map((_, colIndex) =>
        matrixScore.reduce(
          ([min, max], row) => [
            Math.min(min, row[colIndex] ?? Infinity),
            Math.max(max, row[colIndex] ?? -Infinity),
          ],
          [Infinity, -Infinity]
        )
      ) ?? [];
    return matrixWeightType.map((type, idx) => ({
      bestCase:
        type === "benefit" ? columnMinMax[idx][1] : columnMinMax[idx][0],
      worstCase:
        type === "benefit" ? columnMinMax[idx][0] : columnMinMax[idx][1],
    }));
  };

  static closenessIdealSolutions = (
    matrixScore: number[][],
    idealSolutions: IdealSolution[]
  ) => {
    return matrixScore.map((rowScore) => {
      const idealSolution = rowScore
        .reduce(
          ([positif, negatif], val, idx) => [
            positif + Math.pow(val - idealSolutions[idx].bestCase, 2),
            negatif + Math.pow(val - idealSolutions[idx].worstCase, 2),
          ],
          [0, 0]
        )
        .map((val) => Math.sqrt(val));

      return idealSolution[1] / (idealSolution[0] + idealSolution[1]);
    });
  };
}
