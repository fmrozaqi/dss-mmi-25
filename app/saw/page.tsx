"use client";
import { DSSInput } from "@/components/DSSInput";
import { useDSSInput } from "@/hooks/useDSSInput";
import { useMemo } from "react";

export default function SawPage() {
  const dss = useDSSInput();
  const { criterias, alternatives } = dss;

  const normalizedMatrix: number[][] = useMemo(() => {
    const maxValue = new Array(criterias.length).fill(0);
    const minValue = new Array(criterias.length).fill(9999999);
    alternatives.forEach((alternative) => {
      alternative.score.forEach((score, idx) => {
        if (score > maxValue[idx]) {
          maxValue[idx] = score;
        }
        if (score < minValue[idx]) {
          minValue[idx] = score;
        }
      });
    });
    const result: number[][] = [];
    alternatives.forEach((alternative) => {
      const normalizedRow: number[] = [];
      alternative.score.forEach((score, idx) => {
        if (criterias[idx].type === "benefit") {
          normalizedRow.push(score / maxValue[idx]);
        } else {
          normalizedRow.push(minValue[idx] / score);
        }
      });
      result.push(normalizedRow);
    });
    return result;
  }, [alternatives]);

  const normalizedWeight: number[] = useMemo(() => {
    var sum = 0;
    criterias.forEach((criteria) => {
      sum += criteria.weight;
    });
    const result: number[] = [];
    criterias.forEach((criteria) => {
      result.push(criteria.weight / sum);
    });
    return result;
  }, [criterias]);

  const finalScore: number[] = useMemo(() => {
    const result: number[] = [];
    normalizedMatrix.forEach((normalizedRow) => {
      var score = 0;
      normalizedRow.forEach((value, idx) => {
        score += value * normalizedWeight[idx];
      });
      result.push(score);
    });
    return result;
  }, [normalizedMatrix, normalizedWeight]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-2xl text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          Simple Additive Weighting (SAW) Content
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
          {normalizedMatrix.map((row, idxRow) => (
            <div key={`row${idxRow}`} className="flex flex-row">
              {row.map((value, idx) => (
                <div key={`${idxRow}-${idx}`} className="me-2">
                  {value ? value : "NaN"}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div>{finalScore}</div>
      </main>
    </div>
  );
}
