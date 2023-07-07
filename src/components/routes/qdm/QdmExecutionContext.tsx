import React, { createContext, useEffect, useState } from "react";
import { Measure } from "@madie/madie-models";
import { Bundle, ValueSet } from "fhir/r4";
import { measureStore } from "@madie/madie-util";
import { CqmMeasure } from "cqm-models";

export interface QdmExecutionContextHolder {
  measureState: [measure: Measure, setMeasure: (measure: Measure) => void];
  cqmMeasureState?: [
    cqmMeasure: CqmMeasure,
    setMeasureBundle: (measureBundle: CqmMeasure) => void
  ];
  valueSetsState: [
    valueSets: ValueSet[],
    setValueSets: (valueSets: ValueSet[]) => void
  ];

  executionContextReady: boolean;
  executing: boolean;
  setExecuting: (executing: boolean) => void;
}

const QdmExecutionContext = createContext<QdmExecutionContextHolder>(null);

export default QdmExecutionContext;
export const QdmExecutionContextProvider = QdmExecutionContext.Provider;
export const QdmExecutionContextConsumer = QdmExecutionContext.Consumer;

export const useQdmExecutionContext = () => {
  const context = React.useContext(QdmExecutionContext);
  if (context === undefined) {
    throw new Error(
      "useExecutionContext must be used within an ExecutionProvider"
    );
  }
  return context;
};
