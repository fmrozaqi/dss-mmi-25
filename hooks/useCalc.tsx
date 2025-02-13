import { Criteria, DecisionMaker, WeightType } from "@/types/DSSType";
import { useDMInput } from "./useDMInput";
import { useDSSInput } from "./useDSSInput";
import { normalizedWeight } from "@/lib/utils";

export const useCalc = () => {
  const { decisionMakers } = useDMInput();
  const { criterias } = useDSSInput();

  const getMatrixWeight = (): number[] => {
    const weight = criterias.map((criteria) => criteria.weight);
    const normalWeight = normalizedWeight(weight);
    return normalWeight;
  };

  const getMatrixWeightType = (): WeightType[] => {
    const weightType = criterias.map((criteria) => criteria.type);
    return weightType;
  };

  function computeScores(criteriaList: Criteria[]): number[] {
    function computeScore(criteria: Criteria): number {
      if (criteria.subCriteria.length === 0) {
        return criteria.score ?? 0; // Return direct score if it's a leaf
      }

      const totalWeight = criteria.subCriteria.reduce(
        (sum, c) => sum + c.weight,
        0
      );

      return criteria.subCriteria.reduce((sum, c) => {
        const weightRatio = totalWeight === 0 ? 0 : c.weight / totalWeight;
        return sum + weightRatio * computeScore(c);
      }, 0);
    }

    return criteriaList.map(computeScore);
  }

  const getMatrixScore = (dm: DecisionMaker): number[][] => {
    return dm?.alternatives?.map((alt) => computeScores(alt.score ?? [])) ?? [];
  };

  const getMeanScore = (): number[][] => {
    if (!decisionMakers.length) {
      return [];
    }
    const scores = decisionMakers.map((dm) => getMatrixScore(dm));
    const sumScores = scores[0].map((row, i) =>
      row.map((_, j) => scores.reduce((sum, A) => sum + A[i][j], 0))
    );
    const averageScores = sumScores.map((row) =>
      row.map((score) => score / decisionMakers.length)
    );
    return averageScores;
  };

  return {
    getMatrixWeight,
    getMatrixScore,
    getMatrixWeightType,
    getMeanScore,
  };
};
