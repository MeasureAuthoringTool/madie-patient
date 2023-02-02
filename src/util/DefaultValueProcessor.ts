import * as _ from "lodash";
import {
  addingDefaultMedicationRequestProperties,
  addingDefaultProcedureProperties,
} from "./AddDefaultValuesProcessor";
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

  const entriesWithDefaultValues = resultJson?.entry?.map((entry) => {
    switch (entry.resource.resourceType) {
      case "MedicationRequest":
        return addingDefaultMedicationRequestProperties(entry);
      case "Procedure":
        return addingDefaultProcedureProperties(entry);
      default:
        return entry;
    }
  });

  resultJson.entry = entriesWithDefaultValues;

  addCoverageValues(resultJson, patientRef);
  addEncounterValues(resultJson);

  return resultJson;
};
