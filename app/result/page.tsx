"use client";
import Matrix from "@/components/ui/matrix";
import { useCalc } from "@/hooks/useCalc";
import { useDSSInput } from "@/hooks/useDSSInput";
import { SAW } from "@/lib/saw";
import { createMatrixString } from "@/lib/utils";
import { WP } from "@/lib/wp";
import { TOPSIS } from "@/lib/topsis";
import { useDMInput } from "@/hooks/useDMInput";
import { BarChartCustom } from "@/components/ui/bar-chart";
import { ChartConfig } from "@/components/ui/chart";
import CriteriaTable from "@/components/ui/criteria-table";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";

export default function ResultPage() {
  const { decisionMakers } = useDMInput();
  const { alternatives, criterias } = useDSSInput();
  const { getMatrixWeightType, getMatrixWeight, getMeanScore } = useCalc();

  const getSAWFinalScore = () => {
    const sawNormalizedMatrix = SAW.normalizedMatrix(
      getMeanScore(),
      getMatrixWeightType()
    );
    return SAW.finalScore(sawNormalizedMatrix, getMatrixWeight());
  };

  const getSAWFinalScoreMatrix = () => {
    const sawMatrixFinalScore = getSAWFinalScore().map((score) => [score]);
    const alternativeNames = alternatives.map(
      (alternative) => alternative.name
    );
    return createMatrixString(sawMatrixFinalScore, alternativeNames, []);
  };

  const getWPFinalScore = () => {
    const wpPoweredAlternative = WP.poweredAlternative(
      getMeanScore(),
      getMatrixWeightType(),
      getMatrixWeight()
    );
    const wpFinalScore = WP.finalScore(wpPoweredAlternative);
    return WP.normalizedFinalScore(wpFinalScore);
  };

  const getWPFinalScoreMatrix = () => {
    const wpMatrixFinalScore = getWPFinalScore().map((score) => [score]);
    const alternativeNames = alternatives.map(
      (alternative) => alternative.name
    );
    return createMatrixString(wpMatrixFinalScore, alternativeNames, []);
  };

  const getTopsisFinalScore = () => {
    const topsisNormalizedMatrix = TOPSIS.normalizedMatrix(getMeanScore());
    const topsisWeightedNormalizedMatrix = TOPSIS.weightedNormalizedMatrix(
      topsisNormalizedMatrix,
      getMatrixWeight()
    );
    const topsisIdealSolutions = TOPSIS.idealSolutions(
      topsisWeightedNormalizedMatrix,
      getMatrixWeightType()
    );
    return TOPSIS.closenessIdealSolutions(
      topsisWeightedNormalizedMatrix,
      topsisIdealSolutions
    );
  };
  const getTopsisFinalScoreMatrix = () => {
    const topsisMatrixFinalScore = getTopsisFinalScore().map((score) => [
      score,
    ]);
    const alternativeNames = alternatives.map(
      (alternative) => alternative.name
    );
    return createMatrixString(topsisMatrixFinalScore, alternativeNames, []);
  };

  const getChartData = () => {
    const saw: Record<string, number | string> = { dss: "SAW" };
    const wp: Record<string, number | string> = { dss: "WP" };
    const topsis: Record<string, number | string> = { dss: "TOPSIS" };
    alternatives.forEach((alternative, idx) => {
      saw[alternative.id] = getSAWFinalScore()[idx];
      wp[alternative.id] = getWPFinalScore()[idx];
      topsis[alternative.id] = getTopsisFinalScore()[idx];
    });

    return [saw, wp, topsis];
  };

  const chartData = getChartData();

  const getChartConfig = () => {
    const color = ["#68c7c1", "#faca78", "#f57f5b", "#dd5341", "#794a3a"];
    const cartConfig: Record<string, Record<string, string>> = {};
    alternatives.forEach((alternative, idx) => {
      cartConfig[alternative.id] = {
        label: alternative.name,
        color: color[idx % 5],
      };
    });
    return cartConfig;
  };
  const chartConfig = getChartConfig() satisfies ChartConfig;

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "downloaded-page",
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="w-4/5 space-y-6 px-20 pt-10 mx-auto" ref={componentRef}>
        <h1 className="text-2xl font-bold text-gray-800">Decision Matrix</h1>

        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">Criterias</h2>
            <ul className="mt-2 space-y-1 text-gray-600">
              {criterias.map((criteria, idx) => (
                <li key={idx}>{`C${idx + 1}: ${criteria.name} (${(
                  getMatrixWeight()[idx] * 100
                ).toFixed(2)}%)`}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">
              Alternatives
            </h2>
            <ul className="mt-2 space-y-1 text-gray-600">
              {alternatives.map((alternative, idx) => (
                <li key={idx}>{`A${idx + 1}: ${alternative.name}`}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">
              Decision Makers
            </h2>
            <ul className="mt-2 space-y-1 text-gray-600">
              {decisionMakers.map((dm, idx) => (
                <li key={idx}>{`DM${idx + 1}: ${dm.name} as ${dm.role}`}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">SAW</h2>
            <Matrix data={getSAWFinalScoreMatrix()} />
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">WP</h2>
            <Matrix data={getWPFinalScoreMatrix()} />
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">TOPSIS</h2>
            <Matrix data={getTopsisFinalScoreMatrix()} />
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Bar Chart</h2>
          <BarChartCustom
            chartData={chartData}
            chartConfig={chartConfig}
            xAxisName="dss"
          />
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Lampiran</h2>
          {decisionMakers.map((dm) => (
            <div className="mt-4" key={dm.id}>
              <h2 className="text-md font-semibold text-gray-700">{dm.name}</h2>
              <h2 className="text-sm text-gray-700">{dm.role}</h2>

              {dm.alternatives?.map((alternative) => (
                <div className="mt-4" key={alternative.id}>
                  <h2 className="text-md font-semibold text-gray-700">
                    {alternative.name}
                  </h2>
                  <CriteriaTable data={alternative.score ?? []} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center py-5">
        <Button
          variant="default"
          className="mx-auto"
          onClick={() => handlePrint()}
        >
          Download Report
        </Button>
      </div>
    </div>
  );
}
