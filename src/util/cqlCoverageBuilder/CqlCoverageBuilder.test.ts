import {
  ipHighlighting,
  testMeasureLibrary,
  testMeasureCalculationResult,
} from "../../__mocks__/QdmTestMeasureLibrary";
import {
  buildHighlightingForGroups,
  buildHighlightingForAllGroups,
  updateAllGroupResults,
} from "./CqlCoverageBuilder";
import ControllingHighBloodPressureResults from "../../mockdata/qdm/controllingHBPCalculationResults.json";
import {
  stratificationTestMeasure,
  stratificationExecutionResults,
} from "../../mockdata/qdm/QdmStratifications/stratification_execution_results";

const cqmMeasure = {
  cql_libraries: [testMeasureLibrary],
  population_sets: [{ id: "group-1" }, { id: "group-2" }],
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

  it("Build coverage results for valid cqmMeasure and calculation results", () => {
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

describe("Build Highlighting for all groups", () => {
  it("when cqm measure is undefined, coverage result is empty", () => {
    const coverageResults = buildHighlightingForAllGroups(
      testMeasureCalculationResult,
      undefined
    );
    expect(coverageResults).toEqual({});
  });

  it("when calculation results are undefined, coverage result is empty", () => {
    const coverageResults = buildHighlightingForAllGroups(
      undefined,
      cqmMeasure
    );
    expect(coverageResults).toEqual({});
  });

  it("should build coverage results for a measure that has a group with stratification", () => {
    const coverageResults = buildHighlightingForGroups(
      stratificationExecutionResults,
      stratificationTestMeasure
    );
    expect(coverageResults["group-1"].length).toEqual(3);
    const group1DefinitionResults = coverageResults["group-1"];
    const qualifyingEnc = group1DefinitionResults[0];
    expect(qualifyingEnc.name).toEqual("Qualifying Encounters");
    expect(qualifyingEnc.relevance).toEqual("TRUE");
    const ip = group1DefinitionResults[1];
    expect(ip.name).toEqual("Initial Population");
    expect(ip.result).toEqual("true");
    expect(ip.relevance).toEqual("TRUE");
    const strata = group1DefinitionResults[2];
    expect(strata.name).toEqual("Stratificaction 1");
    expect(strata.result).toEqual("true");
    expect(strata.relevance).toEqual("TRUE");
  });

  it("should build highlighting for all the groups, include stratification if present", () => {
    const coverageResults = buildHighlightingForAllGroups(
      {
        "66fc253ea450c10000890c30": stratificationExecutionResults,
      },
      stratificationTestMeasure
    );

    expect(coverageResults["group-1"].length).toEqual(3);
    const group1DefinitionResults = coverageResults["group-1"];
    const qualifyingEnc = group1DefinitionResults[0];
    expect(qualifyingEnc.name).toEqual("Qualifying Encounters");
    expect(qualifyingEnc.relevance).toEqual("TRUE");
    const ip = group1DefinitionResults[1];
    expect(ip.name).toEqual("Initial Population");
    expect(ip.result).toEqual("true");
    expect(ip.relevance).toEqual("TRUE");
    const strata = group1DefinitionResults[2];
    expect(strata.name).toEqual("Stratificaction 1");
    expect(strata.result).toEqual("true");
    expect(strata.relevance).toEqual("TRUE");
  });
});

describe("updateAllGroupResults", () => {
  it("should merge clause results from all test cases", () => {
    const output = updateAllGroupResults(ControllingHighBloodPressureResults);

    const clause66 = output[0]?.clauseResults?.find(
      (s) =>
        s.library_name === "ControllingHighBloodPressure2" && s.localId === "66"
    );
    expect(clause66).toBeTruthy();
    expect(clause66.final).toEqual("TRUE");

    const clause273 = output[0]?.clauseResults?.find(
      (s) =>
        s.library_name === "ControllingHighBloodPressure2" &&
        s.localId === "273"
    );
    expect(clause273).toBeTruthy();
    expect(clause273.final).toEqual("TRUE");

    const clause252 = output[0]?.clauseResults?.find(
      (s) =>
        s.library_name === "ControllingHighBloodPressure2" &&
        s.localId === "252"
    );
    expect(clause252).toBeTruthy();
    expect(clause252.final).toEqual("FALSE");
  });
});
