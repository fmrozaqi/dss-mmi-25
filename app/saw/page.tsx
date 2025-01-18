"use client";
import { useState } from "react";

type Key = "name" | "weight" | "type";

export default function SawPage() {
  const [criterias, setCriterias] = useState([
    { name: "", weight: 0, type: "benefit" },
  ]);

  const [alternatives, setAlternatives] = useState<
    { name: string; score: number[] }[]
  >([{ name: "test", score: [0] }]);

  const resetAlternatives = (index?: number) => {
    alternatives.map((alternative) => {
      if (index !== undefined) {
        alternative.score.splice(index, 1);
      } else {
        alternative.score.push(0);
      }
    });
    setAlternatives(alternatives);
  };

  const addCriteria = () => {
    setCriterias([...criterias, { name: "", weight: 0, type: "benefit" }]);
    resetAlternatives();
  };

  const updateCriterias = (index: number, key: Key, value: string) => {
    const newCriterias = [...criterias];
    if (key === "weight") {
      newCriterias[index][key] = parseInt(value);
    } else {
      newCriterias[index][key] = value;
    }
    setCriterias(newCriterias);
  };

  const deleteCriteria = (deleteIndex: number) => {
    const newCriterias = criterias.filter((_, index) => index !== deleteIndex);
    setCriterias(newCriterias);
    resetAlternatives(deleteIndex);
  };

  const addAlternative = () => {
    const score = new Array(criterias.length).fill(0);
    setAlternatives([...alternatives, { name: "hehe", score }]);
  };

  const deleteAlternative = (deleteIndex: number) => {
    const newAlternatives = alternatives.filter(
      (_, index) => index !== deleteIndex
    );
    setAlternatives(newAlternatives);
  };

  const updateAlternatives = (index: number, key: string, value: string) => {
    const newAlternatives = [...alternatives];
    if (key === "name") {
      newAlternatives[index][key] = value;
    } else {
      newAlternatives[index]["score"][parseInt(key)] = parseInt(value);
    }
    setAlternatives(newAlternatives);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-2xl text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          Simple Additive Weighting (SAW) Content
        </div>
        <div>
          <h1 className="pb-4">Criterias Input Form</h1>
          {criterias.map((weight, index) => (
            <div key={index} className="flex flex-row pb-4">
              <label>
                Criteria Name:
                <input
                  type="text"
                  value={weight.name}
                  onChange={(e) =>
                    updateCriterias(index, "name", e.target.value)
                  }
                  className="mx-1 text-background p-1"
                />
              </label>
              <label>
                weight:
                <input
                  type="number"
                  value={weight.weight}
                  onChange={(e) =>
                    updateCriterias(index, "weight", e.target.value)
                  }
                  className="mx-1 text-background p-1 w-20"
                />
              </label>
              <div className="ps-3 grid gap-2 grid-cols-2">
                <label>
                  <input
                    type="radio"
                    name={`type-${index}`}
                    value="cost"
                    checked={weight.type === "cost"}
                    onChange={(e) =>
                      updateCriterias(index, "type", e.target.value)
                    }
                  />
                  Cost
                </label>
                <label>
                  <input
                    type="radio"
                    name={`type-${index}`}
                    value="benefit"
                    checked={weight.type === "benefit"}
                    onChange={(e) =>
                      updateCriterias(index, "type", e.target.value)
                    }
                  />
                  Benefit
                </label>
              </div>
              {criterias.length > 1 && (
                <button
                  onClick={() => deleteCriteria(index)}
                  className="ms-4 rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base px-4 sm:px-5"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addCriteria}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Add Criteria
          </button>
          <table className="my-4 table-auto border-collapse border border-gray-300 w-full text-center">
            <thead>
              <tr className="bg-[#222]">
                <th
                  key="alternative"
                  className="border border-black-300 px-4 py-2"
                >
                  Alternative
                </th>
                {criterias.map((weight, idx) => (
                  <th key={idx} className="border border-black-300 px-4 py-2">
                    c{idx + 1}
                  </th>
                ))}
                <th
                  key={"action"}
                  className="border border-black-300 px-4 py-2 w-20"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {alternatives.map((alternative, idx) => (
                <tr key={idx}>
                  <td
                    key={alternative.name}
                    className="border border-gray-300 px-4 py-2"
                  >
                    {alternative.name}
                  </td>
                  {Array.from({ length: criterias.length }, (_, colIdx) => (
                    <td
                      key={colIdx}
                      className="border border-gray-300 px-4 py-2"
                    >
                      <input
                        type="number"
                        value={alternative["score"][colIdx]}
                        onChange={(e) =>
                          updateAlternatives(
                            idx,
                            colIdx.toString(),
                            e.target.value
                          )
                        }
                        className="mx-1 text-background p-1 w-20"
                      />
                    </td>
                  ))}
                  <td
                    key={alternative.name + "delete"}
                    className="border border-gray-300 px-4 py-2"
                  >
                    <button
                      onClick={() => {
                        deleteAlternative(idx);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addAlternative}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Add Alternative
          </button>
        </div>
      </main>
    </div>
  );
}
