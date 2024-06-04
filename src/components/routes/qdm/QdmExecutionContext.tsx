import React, { createContext } from "react";
import { Measure } from "@madie/madie-models";
import { CqmMeasure } from "cqm-models";

export interface QdmExecutionContextHolder {
  measureState: [measure: Measure, setMeasure: (measure: Measure) => void];
  cqmMeasureState?: [
    cqmMeasure: CqmMeasure,
    setCqmMeasure: (cqmMeasure: CqmMeasure) => void
  ];
  executionContextReady: boolean;
  setExecutionContextReady: (executionContextReady: boolean) => void;
  executing: boolean;
  setExecuting: (executing: boolean) => void;
  contextFailure: boolean;
}

const QdmExecutionContext = createContext<QdmExecutionContextHolder>(null);

export default QdmExecutionContext;
export const QdmExecutionContextProvider = QdmExecutionContext.Provider;
export const QdmExecutionContextConsumer = QdmExecutionContext.Consumer;

export const useQdmExecutionContext = () => {
  const context = React.useContext(QdmExecutionContext);
  if (context === undefined) {
    throw new Error(
      "useQdmExecutionContext must be used within an ExecutionProvider"
    );
  }
  return context;
};
