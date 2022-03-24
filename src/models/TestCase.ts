import { MeasurePopulation } from "./MeasurePopulation";
import { MeasureScoring } from "./MeasureScoring";

export default interface TestCase {
  id: string;
  title: string;
  description: string;
  name: string;
  series: string;
  createdAt: string;
  createdBy: string;
  lastModifiedAt: string;
  lastModifiedBy: string;
  json?: string;
  executionStatus: string;
  measurementPeriodStart: Date;
  measurementPeriodEnd: Date;
  groupPopulations: GroupPopulation[];
  hapiOperationOutcome: HapiOperationOutcome;
}

export interface GroupPopulation {
  group: string;
  scoring: MeasureScoring;
  populationValues: PopulationValue[];
}

export interface PopulationValue {
  name: MeasurePopulation;
  expected: boolean;
  actual: boolean;
}

export interface MeasurementPeriod {
  start: Date;
  end: Date;
}

export interface HapiOperationOutcome {
  code: number;
  message: string;
  outcomeResponse: HapiOutcomeResponse;
}

export interface HapiOutcomeResponse {
  resourceType: string;
  text: string;
  issue: HapiIssue[];
}

export interface HapiIssue {
  severity: string;
  code: string;
  diagnostics: string;
  location: string[];
}
