export type Criteria = {
  name: string;
  weight: number;
  type: string;
};

export type Alternative = {
  name: string;
  score: number[];
};

export type Key = "name" | "weight" | "type";
