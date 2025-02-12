import { DecisionMaker } from "@/types/DSSType";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const useDMInput = () => {
  const [decisionMakers, setDecisionMakers] = useState<DecisionMaker[]>([]);

  useEffect(() => {
    const storedDecisionMakers = localStorage.getItem("decisionMakers");
    if (storedDecisionMakers) {
      setDecisionMakers(JSON.parse(storedDecisionMakers));
    }
  }, []);

  const addDecisionMaker = () => {
    setDecisionMakers([
      ...decisionMakers,
      {
        id: uuidv4(),
        name: `Decision Maker ${decisionMakers.length + 1}`,
        role: "-",
      },
    ]);
  };

  const saveDecisionMakers = () => {
    localStorage.setItem("decisionMakers", JSON.stringify(decisionMakers));
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
  };
};
