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
  hapiOperationOutcome: HapiOperationOutcome;
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
