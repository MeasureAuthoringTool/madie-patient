import { addValues } from "./DefaultValueProcessor";

describe("Modify JSON to add Default Values", () => {
  it('should set Coverage.status to "active" in the TestCase', () => {
    const coverageJson = require("../mockdata/testcase_with_Coverage.json");
    const resultJson: any = addValues(coverageJson);

    expect(resultJson).toBeDefined();
    let results = resultJson?.entry.find((entry) => {
      return (
        entry.resource.resourceType == "Coverage" &&
        entry.resource.status == "active"
      );
    });
    expect(results).toBeDefined();
  });

  it("should add Coverage Resource in the TestCase if one doesn't exist", () => {
    const nonCoverageJson = require("../mockdata/testcase_with_Coverage.json");
    const resultJson: any = addValues(nonCoverageJson);
    expect(resultJson).toBeDefined();

    let results = resultJson?.entry.find((entry) => {
      if (
        typeof entry !== "undefined" &&
        typeof entry.resource !== "undefined" &&
        typeof entry.resource.resourceType !== "undefined"
      ) {
        return (
          entry.resource.resourceType == "Coverage" &&
          entry.resource.status == "active"
        );
      }
    });

    expect(results).toBeDefined();
  });
});
