export type Criteria = {
  id: string;
  active: boolean;
  name: string;
  weight: number;
  type?: "benefit" | "cost";
  subCriteria: Criteria[];
};

export type Alternative = {
  name: string;
  score: number[];
};

export type DecisionMaker = {
  id: string;
  name: string;
  role: string;
};

export type Key = "name" | "weight" | "type";
