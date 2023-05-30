import React, { Dispatch, SetStateAction } from "react";

export interface TestCasesPassingDetailsProps {
  passPercentage: number;
  passFailRatio: string;
}

export interface TestCaseListProps {
  errors: Array<string>;
  setErrors: Dispatch<SetStateAction<Array<string>>>;
}
