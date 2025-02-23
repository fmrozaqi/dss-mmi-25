import { Alternative, Criteria } from "@/types/DSSType";
import { RowSelectionState } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const useDSSInput = () => {
  const [criterias, setCriterias] = useState<Criteria[]>([]);

  useEffect(() => {
    const criterias =
      typeof window !== "undefined"
        ? localStorage.getItem("criteriaList")
        : undefined;
    if (criterias) {
      setCriterias(JSON.parse(criterias));
    } else {
      setCriterias([
        {
          id: uuidv4(),
          active: false,
          name: "Criteria 1",
          weight: 1,
          type: "benefit",
          subCriteria: [],
        },
      ]);
    }
  }, []);

  const [alternatives, setAlternatives] = useState<Alternative[]>([]);

  useEffect(() => {
    const alternatives =
      typeof window !== "undefined"
        ? localStorage.getItem("alternatives")
        : undefined;
    if (alternatives) {
      setAlternatives(JSON.parse(alternatives));
    } else {
      setAlternatives([{ id: uuidv4(), name: "Alternative 1" }]);
    }
  }, []);

  const addCriteria = () => {
    setCriterias([
      ...criterias,
      {
        id: uuidv4(),
        active: false,
        name: `Criteria ${criterias.length + 1}`,
        weight: 1,
        type: "benefit",
        subCriteria: [],
      },
    ]);
  };

  const addSubCriteriaById = (
    criteriaList: Criteria[],
    id: string
  ): Criteria[] => {
    return criteriaList.map((criteria) => {
      if (criteria.id === id) {
        return {
          ...criteria,
          subCriteria: [
            ...criteria.subCriteria,
            {
              id: uuidv4(),
              active: false,
              name: `Sub Criteria ${criteria.subCriteria.length + 1}`,
              weight: 1,
              type: criteria.type,
              subCriteria: [],
            },
          ],
        };
      }

      return {
        ...criteria,
        subCriteria: addSubCriteriaById(criteria.subCriteria, id),
      };
    });
  };

  const addSubCriteria = (id: string) => {
    const newCriterias = addSubCriteriaById(criterias, id);
    setCriterias(newCriterias);
  };

  function updateCriteriaById(
    criteriaList: Criteria[],
    id: string,
    updates: Partial<Omit<Criteria, "id" | "subCriteria">>
  ): Criteria[] {
    return criteriaList.map((criteria) => {
      if (criteria.id === id) {
        if (updates.type) {
          return {
            ...criteria,
            ...updates,
            subCriteria: criteria.subCriteria.map(
              (subCriteria) =>
                updateCriteriaById([subCriteria], subCriteria.id, updates)[0]
            ),
          };
        } else {
          return { ...criteria, ...updates };
        }
      }

      return {
        ...criteria,
        subCriteria: updateCriteriaById(criteria.subCriteria, id, updates),
      };
    });
  }

  const updateCriterias = (
    id: string,
    updates: Partial<Omit<Criteria, "id" | "subCriteria">>
  ) => {
    const newCriterias = updateCriteriaById(criterias, id, updates);
    setCriterias(newCriterias);
  };

  const updateActiveStatusById = (
    criteriaList: Criteria[],
    tableId: string,
    selectedRows: RowSelectionState
  ): Criteria[] => {
    return criteriaList.map((criteria, idx) => {
      const id = tableId ? [tableId, idx.toString()].join(".") : idx.toString();
      return {
        ...criteria,
        active: id in selectedRows,
        subCriteria: updateActiveStatusById(
          criteria.subCriteria,
          id,
          selectedRows
        ),
      };
    });
  };

  const updateActiveStatus = (selectedRows: RowSelectionState) => {
    const newCriterias = updateActiveStatusById(criterias, "", selectedRows);
    setCriterias(newCriterias);
  };

  const getSelectedRows = (
    criteriaList: Criteria[],
    tableId: string,
    selectedRows: RowSelectionState
  ) => {
    criteriaList.forEach((criteria, idx) => {
      const id = tableId ? [tableId, idx.toString()].join(".") : idx.toString();
      if (criteria.active) {
        selectedRows[id] = true;
      }
      selectedRows = getSelectedRows(criteria.subCriteria, id, selectedRows);
    });
    return selectedRows;
  };

  const getActiveState = () => {
    const criterias =
      typeof window !== "undefined"
        ? localStorage.getItem("criteriaList")
        : undefined;
    if (criterias) {
      const localStorageCriterias = JSON.parse(criterias);
      const selectedRows: RowSelectionState = getSelectedRows(
        localStorageCriterias,
        "",
        {}
      );
      return selectedRows;
    }
    return {};
  };

  function deleteCriteriaById(
    criteriaList: Criteria[],
    id: string
  ): Criteria[] {
    return criteriaList
      .filter((criteria) => criteria.id !== id)
      .map((criteria) => ({
        ...criteria,
        subCriteria: deleteCriteriaById(criteria.subCriteria, id),
      }));
  }

  const deleteCriteria = (id: string) => {
    const newCriterias = deleteCriteriaById(criterias, id);
    setCriterias(newCriterias);
  };

  const addAlternative = () => {
    setAlternatives([
      ...alternatives,
      { id: uuidv4(), name: `Alternative ${alternatives.length + 1}` },
    ]);
  };

  const removeAlternative = (id: string) => {
    const newAlternatives = alternatives.filter(
      (alternative) => alternative.id !== id
    );
    setAlternatives(newAlternatives);
  };

  const updateAlternatives = (id: string, update: Partial<Alternative>) => {
    const newAlternatives = alternatives.map((alternative) =>
      alternative.id === id ? { ...alternative, ...update } : alternative
    );
    setAlternatives(newAlternatives);
  };

  const saveAlternatives = () => {
    const newAlternatives = alternatives.map((alternative) => ({
      ...alternative,
      score: filteredCriteria,
    }));
    setAlternatives(newAlternatives);
    localStorage.setItem("alternatives", JSON.stringify(newAlternatives));
  };

  const filteredCriteria = useMemo(() => {
    const filterCriteria = (criterias: Criteria[]): Criteria[] =>
      criterias
        .filter((criteria) => criteria.active)
        .map((criteria) => ({
          ...criteria,
          subCriteria: filterCriteria(criteria.subCriteria),
        }));
    return filterCriteria(criterias);
  }, [criterias]);

  const saveCriterias = () => {
    localStorage.setItem("criteriaList", JSON.stringify(criterias));
  };

  const removeAlternatives = () => {
    localStorage.removeItem("alternatives");
  };

  return {
    criterias,
    alternatives,
    filteredCriteria,
    addCriteria,
    addSubCriteria,
    updateCriterias,
    updateActiveStatus,
    getActiveState,
    deleteCriteria,
    addAlternative,
    updateAlternatives,
    removeAlternative,
    saveAlternatives,
    saveCriterias,
    removeAlternatives,
  };
};
