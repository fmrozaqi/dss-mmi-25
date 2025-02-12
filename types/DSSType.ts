export type Criteria = {
  id: string;
  name: string;
  weight: number;
  type?: "benefit" | "cost";
  subCriteria: Criteria[];
};

export type Alternative = {
  name: string;
  score: number[];
};

export type Key = "name" | "weight" | "type";
