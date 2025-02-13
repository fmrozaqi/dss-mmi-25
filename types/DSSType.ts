export type WeightType = "benefit" | "cost";

export type Criteria = {
  id: string;
  active: boolean;
  name: string;
  weight: number;
  type: WeightType;
  score?: number;
  subCriteria: Criteria[];
};

export type Alternative = {
  id: string;
  name: string;
  score?: Criteria[];
};

export type DecisionMaker = {
  id: string;
  name: string;
  role: string;
  alternatives?: Alternative[];
};

export type Key = "name" | "weight" | "type";
