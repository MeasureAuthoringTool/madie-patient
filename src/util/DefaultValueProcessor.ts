import * as _ from "lodash";
import {
  DomainResource,
  Practitioner,
  Procedure,
  Reference,
  Encounter,
  Condition,
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
  const conditionReferences: string[] = [];
  resultJson?.entry?.forEach((entry) => {
    if (
      entry.resource.resourceType == "Encounter" &&
      entry.resource.diagnosis
    ) {
      entry.resource.diagnosis.forEach((diagnosis) => {
        conditionReferences.push(diagnosis?.condition?.reference);
      });
    }
  });
  resultJson.entry = resultJson?.entry?.map((entry) => {
    switch (entry.resource.resourceType) {
      case "Condition":
        return {
          ...entry,
          //resource: setSubjectReference(entry?.resource, patientRef),
          resource: conditionActions(
            entry?.resource,
            patientRef,
            conditionReferences
          ),
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
  addPractitionerValues(resultJson);

  return resultJson;
};

const addPractitionerValues = (testCaseJson) => {
  testCaseJson.entry.push({
    fullUrl: "http://Practitioner/123456",
    resource: {
      resourceType: "Practitioner",
      id: "practitioner-123456",
      name: [
        {
          family: "Evil",
          prefix: ["Dr"],
        },
      ],
      identifier: [
        {
          system: "http://hl7.org/fhir/sid/us-npi",
          value: "123456",
        },
      ],
    },
  });
  return testCaseJson;
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

const addConditionCategory = (
  conditionEntry: Condition,
  conditionReferences: string[]
) => {
  if (!conditionEntry?.category) {
    if (conditionReferences?.includes(`Condition/${conditionEntry.id}`)) {
      conditionEntry.category = [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/condition-category",
              code: "encounter-diagnosis",
              display: "Encounter Diagnosis",
            },
          ],
        },
      ];
    } else {
      conditionEntry.category = [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/condition-category",
              code: "problem-list-item",
              display: "Problem List Item",
            },
          ],
        },
      ];
    }
  }
  return conditionEntry;
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
const conditionActions = (
  resource: DomainResource,
  patientRef: Reference,
  conditionReferences: string[]
) => {
  let tempResource: any;
  tempResource = setReference(resource, "subject", patientRef);
  tempResource = addConditionCategory(tempResource, conditionReferences);
  return tempResource;
};
