import { processPatientBundles, readImportFile } from "./FhirImportHelper";
import bonnieJson from "../__mocks__/bonniePatient.json";

describe("FHIR Import Helper utility functions", () => {
  describe("processPatientBundles", () => {
    it("should return a test case list for valid bundle", () => {
      const output = processPatientBundles(bonnieJson);
      expect(output).toBeTruthy();
      expect(output.length).toEqual(1);
      expect(output[0].id).toEqual("62c6c617e59fac0e20e02a03");
      expect(output[0].series).toEqual("Lork");
      expect(output[0].title).toEqual("Jason");
    });
  });

  describe("readImportFile", () => {
    it("should read a JSON file", async () => {
      const file = new File([JSON.stringify(bonnieJson)], "test.json", {
        type: "application/json",
      });
      const bundles = await readImportFile(file);
      expect(bundles).toBeTruthy();
      expect(bundles.length).toEqual(1);
    });

    it("should read a file", async () => {
      const file = new File(["NOT JSON CONTENTS"], "test.json", {
        type: "application/json",
      });
      await expect(readImportFile(file)).rejects.toThrow(
        "Unexpected token N in JSON at position 0"
      );
    });
  });
});
