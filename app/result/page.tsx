"use client";
import { useCalc } from "@/hooks/useCalc";
import { useDMInput } from "@/hooks/useDMInput";

export default function ResultPage() {
  const dms = useDMInput();
  const { getMatrixWeight, getMatrixScore } = useCalc();
  return (
    <div>
      <h1>Matrix Weight</h1>
      <pre>{JSON.stringify(getMatrixWeight(), null, 2)}</pre>
      <h1>Matrix Score</h1>
      <pre>
        {JSON.stringify(
          getMatrixScore(
            dms.getDecisionMakerById("9cd057ce-00c8-49c9-b8f4-85605242c43d")!
          ),
          null,
          2
        )}
      </pre>
    </div>
  );
}
