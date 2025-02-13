import { Criteria, DecisionMaker } from "@/types/DSSType";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDebouncedCallback } from "use-debounce";

export const useDMInput = () => {
  const [decisionMakers, setDecisionMakers] = useState<DecisionMaker[]>([]);

  const debounceSetDM = useDebouncedCallback((value) => {
    setDecisionMakers(value);
  }, 1000);

  useEffect(() => {
    const storedDecisionMakers =
      typeof window !== "undefined"
        ? localStorage.getItem("decisionMakers")
        : undefined;
    if (storedDecisionMakers) {
      debounceSetDM(JSON.parse(storedDecisionMakers));
    }
  }, []);

  const addDecisionMaker = () => {
    debounceSetDM([
      ...decisionMakers,
      {
        id: uuidv4(),
        name: `Decision Maker ${decisionMakers.length + 1}`,
        role: "-",
      },
    ]);
  };

  function updateCriteriaById(
    criteriaList: Criteria[],
    id: string,
    updates: Partial<Omit<Criteria, "id" | "subCriteria">>
  ): Criteria[] {
    return criteriaList.map((criteria) => {
      if (criteria.id === id) {
        return { ...criteria, ...updates };
      }

      return {
        ...criteria,
        subCriteria: updateCriteriaById(criteria.subCriteria, id, updates),
      };
    });
  }

  const updateScore = (
    dmId: string,
    altId: string,
    critId: string,
    score: number
  ) => {
    const newDM = decisionMakers.map((dm) => {
      if (dm.id === dmId) {
        return {
          ...dm,
          alternatives: dm.alternatives?.map((alt) => {
            if (alt.id === altId) {
              return {
                ...alt,
                score: updateCriteriaById(alt.score || [], critId, { score }),
              };
            }
            return alt;
          }),
        };
      }
      return dm;
    });

    debounceSetDM(newDM);
  };

  const saveDecisionMakers = () => {
    typeof window !== "undefined"
      ? localStorage.setItem("decisionMakers", JSON.stringify(decisionMakers))
      : undefined;
  };

  const updateDecisionMaker = (id: string, update: Partial<DecisionMaker>) => {
    setDecisionMakers((prev) =>
      prev.map((dm) => (dm.id === id ? { ...dm, ...update } : dm))
    );
  };

  const removeDecisionMaker = (id: string) => {
    setDecisionMakers((prev) => prev.filter((dm) => dm.id !== id));
  };

  const getDecisionMakerById = (id: string) => {
    return decisionMakers.find((dm) => dm.id === id);
  };

  return {
    decisionMakers,
    addDecisionMaker,
    saveDecisionMakers,
    updateDecisionMaker,
    removeDecisionMaker,
    getDecisionMakerById,
    updateScore,
  };
};
