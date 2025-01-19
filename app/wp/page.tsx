"use client";
import { DSSInput } from "@/components/DSSInput";
import { useDSSInput } from "@/hooks/useDSSInput";
import { useMemo } from "react";

export default function WpPage() {
  const dss = useDSSInput();
  const { criterias, alternatives } = dss;

  const normalizedWeight: number[] = useMemo(() => {
    let sum = 0;
    criterias.forEach((criteria) => {
      sum += criteria.weight;
    });
    const result: number[] = [];
    criterias.forEach((criteria) => {
      result.push(criteria.weight / sum);
    });
    return result;
  }, [criterias]);

  const poweredAlternative: number[][] = useMemo(() => {
    const result: number[][] = [];
    alternatives.forEach((alternative) => {
      const normalizedRow: number[] = [];
      alternative.score.forEach((score, idx) => {
        if (criterias[idx].type === "benefit") {
          normalizedRow.push(Math.pow(score, normalizedWeight[idx]));
        } else {
          normalizedRow.push(Math.pow(score, -normalizedWeight[idx]));
        }
      });
      result.push(normalizedRow);
    });
    return result;
  }, [alternatives, normalizedWeight, criterias]);

  const finalScore: number[] = useMemo(() => {
    const result: number[] = [];
    poweredAlternative.forEach((normalizedRow) => {
      let score = 1;
      normalizedRow.forEach((value) => {
        score *= value;
      });
      result.push(score);
    });
    return result;
  }, [poweredAlternative]);

  const normalizedFinalScore: number[] = useMemo(() => {
    const sum = finalScore.reduce((prev, current) => prev + current, 0);
    const result: number[] = [];
    finalScore.forEach((value) => {
      result.push(value / sum);
    });
    return result;
  }, [finalScore]);

  const ranks: number[] = useMemo(() => {
    const sortedIndices = [...finalScore.keys()].sort(
      (a, b) => finalScore[b] - finalScore[a]
    );
    const result: number[] = [];
    sortedIndices.forEach((originalIndex, rank) => {
      result[originalIndex] = rank + 1; // Rank starts from 1
    });
    return result;
  }, [finalScore]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 font-[family-name:let(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-2xl text-center sm:text-left font-[family-name:let(--font-geist-mono)]">
          Weighted Product (WP) Content
        </div>
        <DSSInput
          criterias={dss.criterias}
          alternatives={dss.alternatives}
          addCriteria={dss.addCriteria}
          updateCriterias={dss.updateCriterias}
          deleteCriteria={dss.deleteCriteria}
          addAlternative={dss.addAlternative}
          updateAlternatives={dss.updateAlternatives}
          deleteAlternative={dss.deleteAlternative}
        />
        <div>
          {poweredAlternative.map((row, idxRow) => (
            <div key={`row${idxRow}`} className="flex flex-row">
              {row.map((value, idx) => (
                <div key={`${idxRow}-${idx}`} className="me-2">
                  {value}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div>
          {normalizedWeight.map((val, idx) => (
            <div key={idx}>{val}</div>
          ))}
        </div>
        <div>
          {finalScore.map((val, idx) => (
            <div key={idx}>{val}</div>
          ))}
        </div>
        <div>
          {normalizedFinalScore.map((val, idx) => (
            <div key={idx}>{val}</div>
          ))}
        </div>
        <div>
          {ranks.map((val, idx) => (
            <div key={idx}>{"A" + val}</div>
          ))}
        </div>
      </main>
    </div>
  );
}
