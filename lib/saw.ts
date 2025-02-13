import { WeightType } from "@/types/DSSType";

export class SAW {
  static normalizedMatrix = (
    matrixScore: number[][],
    matrixWeightType: WeightType[]
  ): number[][] => {
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
    return matrixScore.map((alternativeScore) => {
      return alternativeScore.map((score, idx) => {
        if (matrixWeightType[idx] === "benefit") {
          return score / columnMinMax[idx][1];
        } else {
          return columnMinMax[idx][0] / score;
        }
      });
    });
  };

  static finalScore = (
    normalizedMatrix: number[][],
    normalizedWeight: number[]
  ) => {
    return normalizedMatrix.map((normalizedRow) => {
      return normalizedRow.reduce(
        (score, value, idx) => score + value * normalizedWeight[idx],
        0
      );
    });
  };
}
