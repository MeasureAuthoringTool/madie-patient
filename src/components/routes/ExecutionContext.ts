import { createContext } from "react";
import { Measure } from "@madie/madie-models";
import { Bundle, ValueSet } from "fhir/r4";

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
}

const ExecutionContext = createContext<ExecutionContextHolder>(null);

export default ExecutionContext;
export const ExecutionContextProvider = ExecutionContext.Provider;
export const ExecutionContextConsumer = ExecutionContext.Consumer;
