import React, { createContext, useEffect, useState } from "react";
import { Measure } from "@madie/madie-models";
import { Bundle, ValueSet } from "fhir/r4";
import { measureStore } from "@madie/madie-util";

export interface ExecutionContextHolder {
  measureState: [measure: Measure, setMeasure: (measure: Measure) => void];
  bundleState: [
    measureBundle: Bundle,
    setMeasureBundle: (measureBundle: Bundle) => void
  ];
  valueSetsState: [
    valueSets: ValueSet[],
    setValueSets: (valueSets: ValueSet[]) => void
  ];
  executionContextReady: boolean;
}

const ExecutionContext = createContext<ExecutionContextHolder>(null);

const ExecutionProvider = ({ children }: any) => {
  const [measureBundle, setMeasureBundle] = useState<Bundle>();
  const [valueSets, setValueSets] = useState<ValueSet[]>();
  const [measure, setMeasure] = useState<any>(measureStore.state);
  const [executionContextReady, setExecutionContextReady] = useState<boolean>();

  useEffect(() => {
    setExecutionContextReady(!!measureBundle && !!valueSets && !!measure);
  }, [measureBundle, valueSets, measure]);

  return (
    <ExecutionContext.Provider
      value={{
        measureState: [measure, setMeasure],
        bundleState: [measureBundle, setMeasureBundle],
        valueSetsState: [valueSets, setValueSets],
        executionContextReady,
      }}
    >
      children
    </ExecutionContext.Provider>
  );
};

export default ExecutionContext;
export const ExecutionContextProvider = ExecutionContext.Provider;
export const ExecutionContextConsumer = ExecutionContext.Consumer;

export const useExecutionContext = () => {
  const context = React.useContext(ExecutionContext);
  if (context === undefined) {
    throw new Error(
      "useExecutionContext must be used within an ExecutionProvider"
    );
  }
  return context;
};
