"use client";
import { DSSInput } from "@/components/DSSInput";
import { useDSSInput } from "@/hooks/useDSSInput";
import { useMemo } from "react";

type IdealSolution = {
  bestCase: number;
  worstCase: number;
};

export default function TopsisPage() {
  const dss = useDSSInput();
  const { criterias, alternatives } = dss;

  const normalizedMatrix: number[][] = useMemo(() => {
    const sumSquare = new Array(criterias.length).fill(0);
    alternatives.forEach((alternative) => {
      alternative.score.forEach((score, idx) => {
        sumSquare[idx] += score * score;
      });
    });
    const result: number[][] = [];
    alternatives.forEach((alternative) => {
      const normalizedRow: number[] = [];
      alternative.score.forEach((score, idx) => {
        normalizedRow.push(score / Math.sqrt(sumSquare[idx]));
      });
      result.push(normalizedRow);
    });
    return result;
  }, [alternatives, criterias]);

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

  const weightedNormalizedMatrix: number[][] = useMemo(() => {
    const result: number[][] = [];
    normalizedMatrix.forEach((row) => {
      const normalizedRow: number[] = [];
      row.forEach((score, idx) => {
        normalizedRow.push(normalizedWeight[idx] * score);
      });
      result.push(normalizedRow);
    });
    return result;
  }, [normalizedMatrix, normalizedWeight]);

  const idealSolutions: IdealSolution[] = useMemo(() => {
    const maxValue = new Array(criterias.length).fill(0);
    const minValue = new Array(criterias.length).fill(9999999);
    weightedNormalizedMatrix.forEach((row) => {
      row.forEach((score, idx) => {
        if (score > maxValue[idx]) {
          maxValue[idx] = score;
        }
        if (score < minValue[idx]) {
          minValue[idx] = score;
        }
      });
    });
    const result: IdealSolution[] = [];
    criterias.forEach((criteria, idx) => {
      console.log(criteria);
      if (criteria.type === "benefit") {
        result.push({
          bestCase: maxValue[idx],
          worstCase: minValue[idx],
        });
      } else {
        result.push({
          bestCase: minValue[idx],
          worstCase: maxValue[idx],
        });
      }
    });
    return result;
  }, [weightedNormalizedMatrix, criterias]);

  const closenessIdealSolutions: number[] = useMemo(() => {
    const result: number[] = [];
    weightedNormalizedMatrix.forEach((row) => {
      let positiveIdealSolution = 0;
      let negativeIdealSolution = 0;
      row.forEach((val, idx) => {
        positiveIdealSolution += Math.pow(
          val - idealSolutions[idx].bestCase,
          2
        );
        negativeIdealSolution += Math.pow(
          val - idealSolutions[idx].worstCase,
          2
        );
      });

      positiveIdealSolution = Math.sqrt(positiveIdealSolution);
      negativeIdealSolution = Math.sqrt(negativeIdealSolution);
      result.push(
        negativeIdealSolution / (positiveIdealSolution + negativeIdealSolution)
      );
    });
    return result;
  }, [weightedNormalizedMatrix, idealSolutions]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 font-[family-name:let(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-2xl text-center sm:text-left font-[family-name:let(--font-geist-mono)]">
          Technique for Order Preference by Similarity to Ideal Solution
          (TOPSIS) Content
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
          {weightedNormalizedMatrix.map((row, idxRow) => (
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
          {idealSolutions.map((value, idxRow) => (
            <div key={`row${idxRow}`} className="flex flex-row">
              {"bestcase: " +
                value.bestCase +
                ", worstcase: " +
                value.worstCase}
            </div>
          ))}
        </div>
        <div>
          {closenessIdealSolutions.map((val, idx) => (
            <div key={idx}>{val}</div>
          ))}
        </div>
      </main>
    </div>
  );
}
