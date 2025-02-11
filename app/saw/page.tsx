"use client";
import { DSSInput } from "@/components/DSSInput";
import { useDSSInput } from "@/hooks/useDSSInput";
import { useMemo } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import {
  convertToArrayOfArrays,
  convertToRank,
  formatMatrixNormalization,
  formatWeight,
  matrixExpression,
} from "@/libs/lib";

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
        if (criterias.length)
          if (criterias[idx].type === "benefit") {
            normalizedRow.push(score / maxValue[idx]);
          } else {
            normalizedRow.push(minValue[idx] / score);
          }
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

  const finalScore: number[] = useMemo(() => {
    const result: number[] = [];
    normalizedMatrix.forEach((normalizedRow) => {
      let score = 0;
      normalizedRow.forEach((value, idx) => {
        score += value * normalizedWeight[idx];
      });
      result.push(score);
    });
    return result;
  }, [normalizedMatrix, normalizedWeight]);

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
        <div className="flex flex-col items-center justify-center w-full">
          <MathJaxContext renderMode="post">
            <div className="mb-5">
              <MathJax>{"\\[ Normalized \\ Weight \\]"}</MathJax>
              <MathJax dynamic>
                {matrixExpression(formatWeight(normalizedWeight))}
              </MathJax>
            </div>
            <div className="mb-5">
              <MathJax>{"\\[ Normalized \\ Matrix \\]"}</MathJax>
              <MathJax dynamic>
                {matrixExpression(formatMatrixNormalization(normalizedMatrix))}
              </MathJax>
            </div>
            <div className="mb-5">
              <MathJax>{"\\[ Final \\ Score \\]"}</MathJax>
              <MathJax dynamic>
                {matrixExpression(convertToArrayOfArrays(finalScore))}
              </MathJax>
            </div>
            <div className="mb-5">
              <MathJax>{"\\[ Ranking \\]"}</MathJax>
              <MathJax dynamic>
                {matrixExpression(convertToRank(ranks))}
              </MathJax>
            </div>
          </MathJaxContext>
        </div>
      </main>
    </div>
  );
}
