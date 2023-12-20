import { cloneTestCase } from "./QdmTestCaseHelper";
import { TestCase } from "@madie/madie-models";
import { QDMPatient, EncounterOrder, AssessmentPerformed } from "cqm-models";

// group all tests for this utility
describe("QdmTestCaseHelper", () => {
  // group tests for the cloneTestCase function
  describe("cloneTestCase", () => {
    it("should return input for null testcase input", () => {
      const output = cloneTestCase(null);
      expect(output).toBeFalsy();
    });

    it("should return input for undefined testcase input", () => {
      const output = cloneTestCase(undefined);
      expect(output).toBeFalsy();
    });

    it("should clone and replace IDs in a test case with no json", () => {
      const inputTestCase: TestCase = {
        id: "InputID1",
        title: "OriginalTitle",
        series: "OriginalGroup",
        patientId: "original-patient-id",
        createdAt: "",
        createdBy: "",
        description: "",
        executionStatus: "",
        groupPopulations: [],
        hapiOperationOutcome: undefined,
        lastModifiedAt: "",
        lastModifiedBy: "",
        name: null,
        validResource: false,
      };
      const output = cloneTestCase(inputTestCase);
      expect(output).not.toEqual(inputTestCase);
      expect(output.id).not.toEqual(inputTestCase.id);
      expect(output.title).not.toEqual(inputTestCase.title);
      expect(output.series).toEqual(inputTestCase.series);
      expect(output.patientId).not.toEqual(inputTestCase.patientId);
    });

    it("should clone and replace IDs, and QDM Patient ID, in a test case with empty json", () => {
      const inputTestCase: TestCase = {
        id: "InputID1",
        title: "OriginalTitle",
        series: "OriginalGroup",
        patientId: "original-patient-id",
        createdAt: "",
        createdBy: "",
        description: "",
        executionStatus: "",
        groupPopulations: [],
        hapiOperationOutcome: undefined,
        lastModifiedAt: "",
        lastModifiedBy: "",
        name: null,
        validResource: false,
        json: "{}",
      };
      const output = cloneTestCase(inputTestCase);
      expect(output).not.toEqual(inputTestCase);
      expect(output.id).not.toEqual(inputTestCase.id);
      expect(output.title).not.toEqual(inputTestCase.title);
      expect(output.series).toEqual(inputTestCase.series);
      expect(output.patientId).not.toEqual(inputTestCase.patientId);
      expect(output.json).toBeTruthy();
      const jsonObj = JSON.parse(output.json);
      expect(jsonObj._id).toBeTruthy();
    });

    it("should clone and replace IDs, and QDM Patient ID, in a test case with QDM Patient json", () => {
      const qdmPatient = new QDMPatient();
      qdmPatient.dataElements.push(new EncounterOrder());
      qdmPatient.dataElements.push(new AssessmentPerformed());
      const inputTestCase: TestCase = {
        id: "InputID1",
        title: "OriginalTitle",
        series: "OriginalGroup",
        patientId: "original-patient-id",
        createdAt: "",
        createdBy: "",
        description: "",
        executionStatus: "",
        groupPopulations: [],
        hapiOperationOutcome: undefined,
        lastModifiedAt: "",
        lastModifiedBy: "",
        name: null,
        validResource: false,
        json: JSON.stringify(qdmPatient),
      };
      const output = cloneTestCase(inputTestCase);
      expect(output).not.toEqual(inputTestCase);
      expect(output.id).not.toEqual(inputTestCase.id);
      expect(output.title).not.toEqual(inputTestCase.title);
      expect(output.series).toEqual(inputTestCase.series);
      expect(output.patientId).not.toEqual(inputTestCase.patientId);
      expect(output.json).toBeTruthy();
      const jsonObj = new QDMPatient(JSON.parse(output.json));
      expect(jsonObj._id).toBeTruthy();
      expect(jsonObj.dataElements).toBeTruthy();
      expect(jsonObj.dataElements[0]).toBeTruthy();
      expect(jsonObj.dataElements[0].toJSON()).toEqual(
        qdmPatient.dataElements[0].toJSON()
      );
      expect(jsonObj.dataElements[1]).toBeTruthy();
      expect(jsonObj.dataElements[1].toJSON()).toEqual(
        qdmPatient.dataElements[1].toJSON()
      );
    });
  });
});
