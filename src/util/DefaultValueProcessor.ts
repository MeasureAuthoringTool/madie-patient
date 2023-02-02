import * as _ from "lodash";
import { Reference } from "fhir/r4";
import addCoverageValues from "./CoverageDefaultValueProcessor";
import addEncounterValues from "./EncounterDefaultValueProcessor";

export const addValues = (testCase: any): any => {
  // create a clone of testCase
  const resultJson: any = _.cloneDeep(testCase);

  // safe to assume single Patient within the Bonnie Export bundle.
  const patientId = _.find(
    resultJson.entry,
    (entry) => entry.resource.resourceType === "Patient"
  ).resource.id;
  const patientRef: Reference = { reference: `Patient/${patientId}` };

  addCoverageValues(resultJson, patientRef);
  addEncounterValues(resultJson);

  return resultJson;
};
