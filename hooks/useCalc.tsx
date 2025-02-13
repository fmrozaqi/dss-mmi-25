import { Criteria, DecisionMaker } from "@/types/DSSType";
import { useDMInput } from "./useDMInput";
import { useDSSInput } from "./useDSSInput";

export const useCalc = () => {
  //   const { decisionMakers } = useDMInput();
  const { criterias } = useDSSInput();

  const getMatrixWeight = (): number[] => {
    const weight = criterias.map((criteria) => criteria.weight);
    return weight;
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

  return {
    getMatrixWeight,
    getMatrixScore,
  };
};
