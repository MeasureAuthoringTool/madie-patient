import * as _ from "lodash";
import {
  DomainResource,
  MedicationRequest,
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
    (entry) => entry.resource.resourceType === "Patient"
  ).resource.id;
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
        return {
          ...entry,
          resource: addingDefaultMedicationRequestProperties(
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

function addingDefaultMedicationRequestProperties(
  medicationRequestEntry: MedicationRequest,
  patientRef: Reference
) {
  if (!medicationRequestEntry?.status) {
    medicationRequestEntry.status = "active";
  }
  if (!medicationRequestEntry.intent) {
    medicationRequestEntry.intent = "order";
  }
  if (!medicationRequestEntry.subject) {
    medicationRequestEntry.subject = patientRef;
  }
  return medicationRequestEntry;
}

function addingDefaultProcedureProperties(
  procedureEntry: Procedure,
  patientRef: Reference
) {
  if (!procedureEntry?.status) {
    procedureEntry.status = "completed";
  }
  if (!procedureEntry?.subject) {
    procedureEntry.subject = patientRef;
  }
  return procedureEntry;
}

function encounterDefaultProperties(encounterEntry: Encounter, patientRef) {
  if (
    !encounterEntry.status ||
    encounterEntry.status.toLowerCase() == "finished"
  ) {
    encounterEntry.status = "finished";
  }
  if (!encounterEntry.subject) {
    encounterEntry.subject = patientRef;
  }
  return encounterEntry;
}

function setReference(resource: DomainResource, el, ref: Reference) {
  if (!resource[el]) {
    resource[el] = ref;
  }
  return resource;
}

function setPatientReference(resource: DomainResource, patientRef: Reference) {
  return setReference(resource, "patient", patientRef);
}

function setSubjectReference(resource: DomainResource, patientRef: Reference) {
  return setReference(resource, "subject", patientRef);
}
