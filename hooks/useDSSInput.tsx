import { Alternative, Criteria, Key } from "@/types/DSSType";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const useDSSInput = () => {
  const [criterias, setCriterias] = useState<Criteria[]>([
    {
      id: uuidv4(),
      name: "Criteria 1",
      weight: 1,
      type: "benefit",
      subCriteria: [],
    },
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
    setCriterias([
      ...criterias,
      {
        id: uuidv4(),
        name: `Criteria ${criterias.length + 1}`,
        weight: 1,
        type: "benefit",
        subCriteria: [],
      },
    ]);
    resetAlternatives();
  };

  const updateCriterias = (index: number, key: Key, value: string) => {
    const newCriterias = [...criterias];
    if (key === "weight") {
      newCriterias[index][key] = parseFloat(value);
    } else if (key === "name") {
      newCriterias[index][key] = value;
    } else {
      newCriterias[index][key] = value === "benefit" ? "benefit" : "cost";
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
      newAlternatives[index]["score"][parseInt(key)] = parseFloat(value);
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
