import React, { Dispatch, SetStateAction } from "react";
import { TestCaseImportOutcome } from "../../../../../madie-models/src/TestCase";

export interface TestCasesPassingDetailsProps {
  passPercentage: number;
  passFailRatio: string;
}

export interface TestCaseListProps {
  errors: Array<string>;
  setErrors: Dispatch<SetStateAction<Array<string>>>;
  setWarnings?: Dispatch<SetStateAction<TestCaseImportOutcome[]>>;
}
