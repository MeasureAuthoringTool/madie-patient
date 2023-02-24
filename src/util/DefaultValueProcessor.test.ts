import _, { result } from "lodash";
import { addValues } from "./DefaultValueProcessor";
import { Practitioner } from "fhir/r4";

describe("Modify JSON to add Default Values", () => {
  it("should throw an Error when the patient ID cannot be found", () => {
    const badTestCaseJson = {
      entry: [
        {
          fullUrl: "601adb9198086b165a47f550",
          resource: {
            resourceType: "Patient",
          },
        },
      ],
    };
    expect(() => {
      addValues(badTestCaseJson);
    }).toThrowError();
  });

  it('should set Coverage.status to "active" in the TestCase', () => {
    const coverageJson = require("../mockdata/testcase_with_Coverage.json");
    const resultJson: any = addValues(coverageJson);

    expect(resultJson).toBeDefined();

    let results = resultJson?.entry.filter((entry) => {
      return (
        entry.resource.resourceType === "Coverage" &&
        entry.resource.status === "active"
      );
    });
    expect(results).toBeDefined();

    expect(results.length).toBe(1);
  });

  it('should set Coverage.status to "active" in the TestCase where there are multiple coverages', () => {
    const coverageJson = require("../mockdata/testcase_with_Coverages.json");
    const resultJson: any = addValues(coverageJson);

    expect(resultJson).toBeDefined();
    let results = resultJson?.entry.filter((entry) => {
      return (
        entry.resource.resourceType === "Coverage" &&
        entry.resource.status === "active"
      );
    });
    expect(results).toBeDefined();
    expect(results.length).toBe(2);
  });

  it("should add Coverage Resource in the TestCase if one doesn't exist", () => {
    const nonCoverageJson = require("../mockdata/testcase_wo_coverage.json");
    const resultJson: any = addValues(nonCoverageJson);
    expect(resultJson).toBeDefined();
    let results = resultJson?.entry.filter((entry) => {
      if (
        typeof entry !== "undefined" &&
        typeof entry.resource !== "undefined" &&
        typeof entry.resource.resourceType !== "undefined"
      ) {
        return (
          entry.resource.resourceType === "Coverage" &&
          entry.resource.status === "active"
        );
      }
    });

    expect(results).toBeDefined();

    expect(results.length).toBe(1);
  });

  it("should add entry to Coverage.payor with Reference to the default Organization", () => {
    const coverageJson = require("../mockdata/testcase_with_Coverages.json");
    const resultJson: any = addValues(coverageJson);

    expect(resultJson).toBeDefined();

    const results = resultJson?.entry.filter((entry) => {
      return (
        entry.resource.resourceType === "Coverage" &&
        _.find(entry.resource.payor, ["reference", "Organization/123456"]) !==
          undefined
      );
    });

    expect(results).toBeDefined();
    expect(results.length).toBe(2);

    const organizations = resultJson?.entry.filter(
      (entry) =>
        entry.resource.resourceType === "Organization" &&
        entry.resource.name === "Blue Cross Blue Shield of Texas"
    );
    expect(organizations).toHaveLength(1);
    expect(organizations[0].resource.id).toBe("123456");
  });

  it("should set Coverage.beneficiary Reference to the Patient", () => {
    const coverageJson = require("../mockdata/testcase_with_Coverage.json");
    const resultJson = addValues(coverageJson);

    const patientResource = _.find(
      resultJson.entry,
      (entry) => entry.resource.resourceType === "Patient"
    ).resource;

    resultJson?.entry?.forEach((entry) => {
      if (entry.resource.resourceType === "Coverage") {
        expect(entry.resource.beneficiary).toBeDefined();
        expect(entry.resource.beneficiary.reference).toBe(
          `Patient/${patientResource.id}`
        );
      }
    });
  });

  it('should set MedicationRequest.status to "active" and MedicationRequest.intent to "order" in the TestCase where there are multiple medication requests', () => {
    const medicationRequestJson = require("../mockdata/testcase_with_Medication_Request.json");
    const resultJson: any = addValues(medicationRequestJson);

    const patientResource = _.find(
      resultJson.entry,
      (entry) => entry.resource.resourceType === "Patient"
    ).resource;

    expect(resultJson).toBeDefined();
    let results = resultJson?.entry.filter((entry) => {
      return (
        entry.resource?.resourceType === "MedicationRequest" &&
        entry.resource?.status === "active" &&
        entry.resource?.intent === "order" &&
        entry.resource?.subject.reference === `Patient/${patientResource.id}`
      );
    });
    expect(results).toBeDefined();

    expect(results.length).toBe(1);
  });
  it("should set a missing Encounter.subject to an object containing patient ID and a missing Encounter.status to finished", () => {
    const encounterRequestJson = require("../mockdata/testcase_with_Coverage.json");
    const resultJson: any = addValues(encounterRequestJson);
    expect(resultJson).toBeDefined();
    expect(resultJson.entry[0].resource.status).toBe("finished");
    expect(resultJson.entry[0].resource.subject.reference).toBe(
      "Patient/numer-pos-EXM135v11QICore4"
    );
  });

  it("should not modify already set MedicationRequest status, intent, or subject values", () => {
    const medicationRequestJson = require("../mockdata/testcase_with_Medication_Request.json");
    const resultJson: any = addValues(medicationRequestJson);

    const patientResource = _.find(
      resultJson.entry,
      (entry) => entry.resource.resourceType === "Patient"
    ).resource;

    const medicationRequestResource = _.find(
      resultJson.entry,
      (entry) =>
        entry.resource.resourceType === "MedicationRequest" &&
        entry.resource.status === "cancelled"
    ).resource;

    expect(medicationRequestResource).toBeDefined();
    expect(medicationRequestResource.status).toBe("cancelled");
    expect(medicationRequestResource.intent).toBe("option");
    expect(medicationRequestResource.subject.reference).toBe(
      `Patient/${patientResource.id}`
    );
    const medicationRequestId = medicationRequestResource.id;

    expect(resultJson).toBeDefined();
    let results = resultJson?.entry.filter((entry) => {
      return (
        entry.resource?.resourceType === "MedicationRequest" &&
        entry.resource?.id === medicationRequestId
      );
    });
    expect(results).toBeDefined();
    expect(results.length).toBe(1);
    expect(medicationRequestResource.status).toBe("cancelled");
    expect(medicationRequestResource.intent).toBe("option");
    expect(medicationRequestResource.subject.reference).toBe(
      `Patient/${patientResource.id}`
    );
  });

  it("should set all the medication requests entries with status, intent and subject properties", () => {
    const serviceRequestJson = require("../mockdata/testcase_with_Service_Request.json");
    const beforeDefaultValuesJson: any = _.cloneDeep(
      serviceRequestJson
    )?.entry.filter(
      (entry) => entry.resource.resourceType === "ServiceRequest"
    ).length;

    const resultJson: any = addValues(serviceRequestJson);
    expect(resultJson).toBeDefined();
    let results = resultJson?.entry.filter((entry) => {
      return (
        entry.resource?.resourceType === "ServiceRequest" &&
        entry.resource?.status &&
        entry.resource?.intent &&
        entry.resource?.subject
      );
    }).length;

    expect(results).toBe(beforeDefaultValuesJson);
  });

  it("Should add a default Practitioner resource", () => {
    const defaultFamilyName = "Evil";
    const defaultPrefix = "Dr";
    const defaultIdentifierSystem = "http://hl7.org/fhir/sid/us-npi";
    const defaultIdentifierValue = "123456";

    const testCaseWithPractitioner = require("../mockdata/testCase_with_Practitioner.json");
    const updatedTestCaseWithDefaults: any = addValues(
      testCaseWithPractitioner
    );

    expect(updatedTestCaseWithDefaults).toBeDefined();
    const practitionerEntries = updatedTestCaseWithDefaults.entry.filter(
      (entry) => {
        return entry.resource?.resourceType === "Practitioner";
      }
    );
    expect(practitionerEntries.length).toBe(5);

    const defaultPractitioners = practitionerEntries.filter((p) => {
      return _.find(p.resource.identifier, ["value", "123456"]) !== undefined;
    });

    expect(defaultPractitioners).toHaveLength(1);

    expect(defaultPractitioners[0].resource.name[0].family).toBe(
      defaultFamilyName
    );
    expect(defaultPractitioners[0].resource.name[0].prefix[0]).toBe(
      defaultPrefix
    );
    expect(defaultPractitioners[0].resource.identifier[0].system).toBe(
      defaultIdentifierSystem
    );
    expect(defaultPractitioners[0].resource.identifier[0].value).toBe(
      defaultIdentifierValue
    );
  });

  it("should set Device.patient to Patient Reference", () => {
    const testCaseWithDevice = require("../mockdata/testCase_with_Practitioner.json");

    const updatedTestCaseWithDefaults: any = addValues(testCaseWithDevice);

    const patientResource = _.find(
      updatedTestCaseWithDefaults.entry,
      (entry) => entry.resource.resourceType === "Patient"
    ).resource;

    expect(updatedTestCaseWithDefaults).toBeDefined();
    const deviceEntries = updatedTestCaseWithDefaults?.entry.filter(
      (entry) => entry.resource?.resourceType === "Device"
    );
    expect(deviceEntries.length).toBe(1);
    expect(deviceEntries[0].resource.patient).toBeDefined();
    expect(deviceEntries[0].resource.patient.reference).toBe(
      `Patient/${patientResource.id}`
    );
  });

  it("should set all the Procedure entries with status and subject properties", () => {
    const serviceRequestJson = require("../mockdata/testcase_with_Procedure.json");
    const beforeProcedureCount: any = _.cloneDeep(
      serviceRequestJson
    )?.entry.filter(
      (entry) => entry.resource.resourceType === "Procedure"
    ).length;

    const resultJson: any = addValues(serviceRequestJson);
    expect(resultJson).toBeDefined();
    let afterProcedureCount = resultJson?.entry.filter((entry) => {
      return (
        entry.resource?.resourceType === "Procedure" &&
        entry.resource?.status &&
        entry.resource?.subject
      );
    }).length;
    expect(afterProcedureCount).toEqual(beforeProcedureCount);
  });

  it("should set MedicationAdministration.subject to Patient Reference", () => {
    const testCase = require("../mockdata/testCase_with_Practitioner.json");

    const updatedTestCaseWithDefaults: any = addValues(testCase);

    const patientResource = _.find(
      updatedTestCaseWithDefaults.entry,
      (entry) => entry.resource.resourceType === "Patient"
    ).resource;

    expect(updatedTestCaseWithDefaults).toBeDefined();
    const entries = updatedTestCaseWithDefaults?.entry.filter(
      (entry) => entry.resource?.resourceType === "MedicationAdministration"
    );
    expect(entries.length).toBe(1);
    expect(entries[0].resource.subject).toBeDefined();
    expect(entries[0].resource.subject.reference).toBe(
      `Patient/${patientResource.id}`
    );
  });

  it("should set Observation.subject to Patient Reference", () => {
    const testCase = require("../mockdata/testCase_with_Practitioner.json");

    const updatedTestCaseWithDefaults: any = addValues(testCase);

    const patientResource = _.find(
      updatedTestCaseWithDefaults.entry,
      (entry) => entry.resource.resourceType === "Patient"
    ).resource;

    expect(updatedTestCaseWithDefaults).toBeDefined();
    const entries = updatedTestCaseWithDefaults?.entry.filter(
      (entry) => entry.resource?.resourceType === "Observation"
    );
    expect(entries.length).toBe(1);
    expect(entries[0].resource.subject).toBeDefined();
    expect(entries[0].resource.subject.reference).toBe(
      `Patient/${patientResource.id}`
    );
  });

  it("should set Condition.subject to Patient Reference", () => {
    const testCase = require("../mockdata/testCase_with_Practitioner.json");

    const updatedTestCaseWithDefaults: any = addValues(testCase);

    const patientResource = _.find(
      updatedTestCaseWithDefaults.entry,
      (entry) => entry.resource.resourceType === "Patient"
    ).resource;

    expect(updatedTestCaseWithDefaults).toBeDefined();
    const entries = updatedTestCaseWithDefaults?.entry.filter(
      (entry) => entry.resource?.resourceType === "Condition"
    );
    expect(entries.length).toBe(1);
    expect(entries[0].resource.subject).toBeDefined();
    expect(entries[0].resource.subject.reference).toBe(
      `Patient/${patientResource.id}`
    );
  });
  it("should set Condition.category to encounter properties if encounter references it", () => {
    const testCase = require("../mockdata/testcase_with_Conditions.json");

    const updatedTestCaseWithDefaults: any = addValues(testCase);

    expect(updatedTestCaseWithDefaults).toBeDefined();
    const entries = updatedTestCaseWithDefaults?.entry.filter(
      (entry) => entry.resource?.resourceType === "Condition"
    );
    expect(entries.length).toBe(2);
    expect(entries[0].resource.category[0].coding[0]).toBeDefined();
    expect(entries[0].resource.category[0].coding[0].code).toBe(
      "encounter-diagnosis"
    );
    expect(entries[1].resource.category[0].coding[0]).toBeDefined();
    expect(entries[1].resource.category[0].coding[0].code).toBe(
      "problem-list-item"
    );
  });
});
