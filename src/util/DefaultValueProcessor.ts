import * as _ from "lodash";
import { Reference, MedicationRequest, Procedure, Encounter } from "fhir/r4";
import addCoverageValues from "./CoverageDefaultValueProcessor";

export const addValues = (testCase: any): any => {
  // create a clone of testCase
  const resultJson: any = _.cloneDeep(testCase);

  // safe to assume single Patient within the Bonnie Export bundle.
  const patientId = _.find(
    resultJson.entry,
    (entry) => entry.resource.resourceType === "Patient"
  ).resource.id;
  const patientRef: Reference = { reference: `Patient/${patientId}` };

  function addingDefaultMedicationRequestProperties(
    medicationRequestEntry: MedicationRequest
  ) {
    if (!medicationRequestEntry?.status) {
      medicationRequestEntry.status = "active";
    }
    if (!medicationRequestEntry.intent) {
      medicationRequestEntry.intent = "order";
    }
    return medicationRequestEntry;
  }

  function addingDefaultProcedureProperties(procedureEntry: Procedure) {
    if (!procedureEntry?.status) {
      procedureEntry.status = "completed";
    }
    return procedureEntry;
  }

  function encounterDefaultProperties(encounterEntry: Encounter) {
    if (
      !encounterEntry.status ||
      encounterEntry.status.toLowerCase() == "finished"
    ) {
      encounterEntry.status = "finished";
    }
    if (!encounterEntry.subject) {
      encounterEntry.subject = { reference: `Patient/${patientId}` };
    }
    return encounterEntry;
  }

  const entriesWithDefaultValues = resultJson?.entry?.map((entry) => {
    switch (entry.resource.resourceType) {
      case "MedicationRequest":
        return {
          ...entry,
          resource: addingDefaultMedicationRequestProperties(entry?.resource),
        };
      case "Procedure":
        return {
          ...entry,
          resource: addingDefaultProcedureProperties(entry?.resource),
        };
      case "Encounter":
        return {
          ...entry,
          resource: encounterDefaultProperties(entry?.resource),
        };
      default:
        return entry;
    }
  });

  resultJson.entry = entriesWithDefaultValues;

  addCoverageValues(resultJson, patientRef);

  return resultJson;
};
