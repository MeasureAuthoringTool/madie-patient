import * as _ from "lodash";
import {
  DomainResource,
  Practitioner,
  Procedure,
  Reference,
  Encounter,
} from "fhir/r4";

import addCoverageValues from "./CoverageDefaultValueProcessor";

export const addValues = (testCase: any): any => {
  // create a clone of testCase
  const resultJson: any = _.cloneDeep(testCase);

  // safe to assume single Patient within the Bonnie Export bundle.
  const patientId = _.find(
    resultJson.entry,
    (entry) => entry?.resource?.resourceType === "Patient"
  )?.resource?.id;
  if (!patientId) {
    throw new Error("Unable to parse Patient Resource");
  }
  const patientRef: Reference = { reference: `Patient/${patientId}` };

  resultJson.entry = resultJson?.entry?.map((entry) => {
    switch (entry.resource.resourceType) {
      case "Condition":
        return {
          ...entry,
          resource: setSubjectReference(entry?.resource, patientRef),
        };
      case "Device":
        return {
          ...entry,
          resource: setPatientReference(entry?.resource, patientRef),
        };
      case "MedicationAdministration":
        return {
          ...entry,
          resource: setSubjectReference(entry?.resource, patientRef),
        };
      case "MedicationRequest":
      case "ServiceRequest":
        return {
          ...entry,
          resource: addingDefaultMedicationOrServiceRequestProperties(
            entry?.resource,
            patientRef
          ),
        };
      case "Observation":
        return {
          ...entry,
          resource: setSubjectReference(entry?.resource, patientRef),
        };
      case "Procedure":
        return {
          ...entry,
          resource: addingDefaultProcedureProperties(
            entry?.resource,
            patientRef
          ),
        };
      case "Practitioner":
        return {
          ...entry,
          resource: addingDefaultPractitionerProperties(entry?.resource),
        };
      case "Encounter":
        return {
          ...entry,
          resource: encounterDefaultProperties(entry?.resource, patientRef),
        };
      default:
        return entry;
    }
  });

  addCoverageValues(resultJson, patientRef);

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

const addingDefaultMedicationOrServiceRequestProperties = (
  medicationOrServiceRequestEntry: any,
  patientRef: Reference
) => {
  if (!medicationOrServiceRequestEntry?.status) {
    medicationOrServiceRequestEntry.status = "active";
  }
  if (!medicationOrServiceRequestEntry.intent) {
    medicationOrServiceRequestEntry.intent = "order";
  }
  if (!medicationOrServiceRequestEntry.subject) {
    medicationOrServiceRequestEntry.subject = patientRef;
  }
  return medicationOrServiceRequestEntry;
};

const addingDefaultProcedureProperties = (
  procedureEntry: Procedure,
  patientRef: Reference
) => {
  if (!procedureEntry?.status) {
    procedureEntry.status = "completed";
  }
  if (!procedureEntry?.subject) {
    procedureEntry.subject = patientRef;
  }
  return procedureEntry;
};

function encounterDefaultProperties(encounterEntry: Encounter, patientRef) {
  if (!encounterEntry.status) {
    encounterEntry.status = "finished";
  }
  if (!encounterEntry.subject) {
    encounterEntry.subject = patientRef;
  }
  return encounterEntry;
}

const setReference = (resource: DomainResource, el, ref: Reference) => {
  if (!resource[el]) {
    resource[el] = ref;
  }
  return resource;
};

const setPatientReference = (
  resource: DomainResource,
  patientRef: Reference
) => {
  return setReference(resource, "patient", patientRef);
};

const setSubjectReference = (
  resource: DomainResource,
  patientRef: Reference
) => {
  return setReference(resource, "subject", patientRef);
};
