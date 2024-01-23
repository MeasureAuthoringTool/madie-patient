import {
  ipHighlighting,
  testMeasureLibrary,
  testMeasureCalculationResult,
} from "../../__mocks__/QdmTestMeasureLibrary";
import { buildHighlightingForGroups } from "./CqlCoverageBuilder";

const cqmMeasure = {
  cql_libraries: [testMeasureLibrary],
};

describe("CQL Coverage Builder", () => {
  it("when cqm measure is undefined, coverage result is empty", () => {
    const coverageResults = buildHighlightingForGroups(
      testMeasureCalculationResult,
      undefined
    );
    expect(coverageResults).toEqual({});
  });

  it("when calculation results are undefined, coverage result is empty", () => {
    const coverageResults = buildHighlightingForGroups(undefined, cqmMeasure);
    expect(coverageResults).toEqual({});
  });

  it("Build coverage results for valid cqmMeasure anf calculation results", () => {
    const coverageResults = buildHighlightingForGroups(
      testMeasureCalculationResult,
      cqmMeasure
    );
    expect(coverageResults["group-1"].length).toEqual(6);
    const group1DefinitionResults = coverageResults["group-1"];
    const ip = group1DefinitionResults.find(
      (result) => result.name === "Initial Population"
    );
    expect(ip.type).toEqual(undefined);
    expect(ip.relevance).toEqual("TRUE");
    expect(ip.html).toEqual(ipHighlighting);
    expect(ip.result).toEqual(
      "[Encounter, Performed: Encounter Inpatient\n" +
        "START: 01/09/2020 12:00 AM\n" +
        "STOP: 01/10/2020 12:00 AM\n" +
        "CODE: SNOMEDCT 183452005]"
    );

    expect(coverageResults["group-2"].length).toEqual(6);
  });
});
