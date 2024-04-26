import React, { Dispatch, SetStateAction } from "react";
import { TestCaseImportOutcome } from "@madie/madie-models";

export interface TestCasesPassingDetailsProps {
  passPercentage: number;
  passFailRatio: string;
}

export interface TestCaseListProps {
  errors: Array<string>;
  setErrors: Dispatch<SetStateAction<Array<string>>>;
  setImportErrors?: Dispatch<SetStateAction<Array<string>>>;
  setWarnings?: Dispatch<SetStateAction<TestCaseImportOutcome[]>>;
}
