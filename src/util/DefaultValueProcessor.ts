import * as _ from "lodash";
import {
  HumanName,
  MedicationRequest,
  Practitioner,
  Procedure,
  Reference,
} from "fhir/r4";
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

  resultJson.entry = resultJson?.entry?.map((entry) => {
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
      case "Practitioner":
        return {
          ...entry,
          resource: addingDefaultPractitionerProperties(entry?.resource),
        };
      default:
        return entry;
    }
  });

  addCoverageValues(resultJson, patientRef);
  addEncounterValues(resultJson);

  return resultJson;
};

const addingDefaultPractitionerProperties = (practitioner: Practitioner) => {
  if (!practitioner?.name) {
    practitioner.name = [
      {
        family: "Evil",
        prefix: ["Dr"],
      },
    ];
  }
  if (!practitioner?.identifier) {
    practitioner.identifier = [
      {
        system: "http://hl7.org/fhir/sid/us-npi",
        value: "123456",
      },
    ];
  }
  return practitioner;
};

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
