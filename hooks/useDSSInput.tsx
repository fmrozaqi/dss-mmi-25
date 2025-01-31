import { Alternative, Criteria, Key } from "@/types/DSSType";
import { useState } from "react";

export const useDSSInput = () => {
  const [criterias, setCriterias] = useState<Criteria[]>([
    { name: "", weight: 1, type: "benefit" },
  ]);

  const [alternatives, setAlternatives] = useState<Alternative[]>([
    { name: "", score: [1] },
  ]);

  const resetAlternatives = (index?: number) => {
    alternatives.map((alternative) => {
      if (index !== undefined) {
        alternative.score.splice(index, 1);
      } else {
        alternative.score.push(1);
      }
    });
    setAlternatives(alternatives);
  };

  const addCriteria = () => {
    setCriterias([...criterias, { name: "", weight: 1, type: "benefit" }]);
    resetAlternatives();
  };

  const updateCriterias = (index: number, key: Key, value: string) => {
    const newCriterias = [...criterias];
    if (key === "weight") {
      newCriterias[index][key] = parseInt(value);
    } else {
      newCriterias[index][key] = value;
    }
    setCriterias(newCriterias);
  };

  const deleteCriteria = (deleteIndex: number) => {
    const newCriterias = criterias.filter((_, index) => index !== deleteIndex);
    setCriterias(newCriterias);
    resetAlternatives(deleteIndex);
  };

  const addAlternative = () => {
    const score = new Array(criterias.length).fill(1);
    setAlternatives([...alternatives, { name: "", score }]);
  };

  const deleteAlternative = (deleteIndex: number) => {
    const newAlternatives = alternatives.filter(
      (_, index) => index !== deleteIndex
    );
    setAlternatives(newAlternatives);
  };

  const updateAlternatives = (index: number, key: string, value: string) => {
    const newAlternatives = [...alternatives];
    if (key === "name") {
      newAlternatives[index][key] = value;
    } else {
      newAlternatives[index]["score"][parseInt(key)] = parseInt(value);
    }
    setAlternatives(newAlternatives);
  };

  return {
    criterias,
    alternatives,
    addCriteria,
    updateCriterias,
    deleteCriteria,
    addAlternative,
    updateAlternatives,
    deleteAlternative,
  };
};
