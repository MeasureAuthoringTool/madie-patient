import _, { result } from "lodash";
import { addValues } from "./DefaultValueProcessor";

describe("Modify JSON to add Default Values", () => {
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

  it("should set Coverage.payor Reference to the default Organization", () => {
    const coverageJson = require("../mockdata/testcase_wo_coverage.json");
    const resultJson: any = addValues(coverageJson);

    expect(resultJson).toBeDefined();

    const results = resultJson?.entry.filter((entry) => {
      return (
        entry.resource.resourceType === "Coverage" &&
        entry.resource.payor[0]?.reference === "Organization/123456"
      );
    });

    expect(results).toBeDefined();
    expect(results.length).toBe(1);

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
    const medicationRequestJson = require("../mockdata/medication_request_test.json");
    const resultJson: any = addValues(medicationRequestJson);

    expect(resultJson).toBeDefined();
    let results = resultJson?.entry.filter((entry) => {
      return (
        entry.resource?.resourceType === "MedicationRequest" &&
        entry.resource?.status === "active" &&
        entry.resource?.intent === "order"
      );
    });
    expect(results).toBeDefined();

    expect(results.length).toBe(1);
  });
  it('should set a missing Encounter.subject to an object containing patient ID and a missing Encounter.status to finished', () => {
    const encounterRequestJson = require("../mockdata/testcase_with_Coverage.json");
    const resultJson: any = addValues(encounterRequestJson);
    console.log(resultJson.entry[0])
    expect(resultJson).toBeDefined();
    expect(resultJson.entry[0].resource.status).toBe("finished")
    expect(resultJson.entry[0].resource.subject.reference).toBe("Patient/numer-pos-EXM135v11QICore4")
  });
});
