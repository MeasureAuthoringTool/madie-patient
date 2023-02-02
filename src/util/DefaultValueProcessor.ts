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

  function addingDefaultMedicationRequestProperties(entry: any) {
    if (!entry?.resource?.status) {
      entry.resource.status = "active";
    }
    if (!entry?.resource?.intent) {
      entry.resource.intent = "order";
    }
    return entry;
  }

  function addingDefaultProcedureProperties(entry: any) {
    if (!entry?.resource?.status) {
      entry.resource.status = "completed";
    }
    return entry;
  }

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
