import _ from "lodash";
import { addValues } from "./DefaultValueProcessor";
import { Practitioner } from "fhir/r4";

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

  it("Should set identifier and name attributes to Practitioner", () => {
    const defaultFamilyName = "Evil";
    const defaultPrefix = "Dr";
    const defaultIdentifierSystem = "http://hl7.org/fhir/sid/us-npi";
    const defaultIdentifierValue = "123456";

    const testCaseWithPractitioner = require("../mockdata/testCase_with_Practitioner.json");
    const updatedTestCaseWithDefaults: any = addValues(
      testCaseWithPractitioner
    );

    expect(updatedTestCaseWithDefaults).toBeDefined();
    const practitioners: Practitioner[] = [];
    _.forEach(
      updatedTestCaseWithDefaults?.entry,
      (entry) =>
        entry.resource?.resourceType === "Practitioner" &&
        practitioners.push(entry.resource)
    );
    expect(practitioners.length).toBe(4);

    // Nothing should be changed for 1st practitioner
    expect(practitioners[0].name[0].family).toBe("Careful");
    expect(practitioners[0].name[0].prefix[0]).toBe("Dr");
    expect(practitioners[0].identifier[0].system).toBe(
      "urn:oid:2.16.840.1.113883.4.336"
    );
    expect(practitioners[0].identifier[0].value).toBe("Practitioner-23");

    // name and identifier defaults are added to 2nd practitioner
    expect(practitioners[1].name[0].family).toBe(defaultFamilyName);
    expect(practitioners[1].name[0].prefix[0]).toBe(defaultPrefix);
    expect(practitioners[1].identifier[0].system).toBe(defaultIdentifierSystem);
    expect(practitioners[1].identifier[0].value).toBe(defaultIdentifierValue);

    // only default name is added to 3rd practitioner
    expect(practitioners[2].name[0].family).toBe(defaultFamilyName);
    expect(practitioners[2].name[0].prefix[0]).toBe(defaultPrefix);
    expect(practitioners[2].identifier[0].system).toBe(
      "urn:oid:2.16.840.1.113883.4.336"
    );
    expect(practitioners[2].identifier[0].value).toBe("Practitioner-23");

    // only default identifier is added to 4th practitioner
    expect(practitioners[3].name[0].family).toBe("Careful");
    expect(practitioners[3].name[0].prefix[0]).toBe("Dr");
    expect(practitioners[3].identifier[0].system).toBe(defaultIdentifierSystem);
    expect(practitioners[3].identifier[0].value).toBe(defaultIdentifierValue);
  });
});
