import {
  determineGroupResult,
  determineGroupResultStratification,
} from "./TestCasePopulationListUtil";
import {
  DisplayPopulationValue,
  PopulationType,
  StratificationExpectedValue,
} from "@madie/madie-models";

describe("determineGroupResult", () => {
  it("should return initial for false isTestCaseExecuted input", () => {
    const output = determineGroupResult("boolean", [], false);
    expect(output).toEqual("initial");
  });

  it("should return pass for empty populations for boolean PopBasis", () => {
    const output = determineGroupResult("boolean", [], [], true);
    expect(output).toEqual("pass");
  });

  it("should return pass for empty populations for non-boolean PopBasis", () => {
    const output = determineGroupResult("Encounter", [], [], true);
    expect(output).toEqual("pass");
  });

  it("should return pass for matching populations values (true) for boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: true,
        expected: true,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: true,
        expected: true,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: true,
        expected: true,
      },
    ];
    const output = determineGroupResult(
      "Encounter",
      populations,
      populations,
      true
    );
    expect(output).toEqual("pass");
  });

  it("should return pass for matching populations values (false) for boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: false,
        expected: false,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: false,
        expected: false,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: false,
        expected: false,
      },
    ];
    const output = determineGroupResult(
      "Encounter",
      populations,
      populations,
      true
    );
    expect(output).toEqual("pass");
  });

  it("should return pass for matching populations values (false) for boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: false,
        expected: undefined,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: false,
        expected: false,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: false,
        expected: undefined,
      },
    ];
    const output = determineGroupResult(
      "Encounter",
      populations,
      populations,
      true
    );
    expect(output).toEqual("pass");
  });

  it("should return fail for non-matching populations values for boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: true,
        expected: false,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: false,
        expected: false,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: false,
        expected: undefined,
      },
    ];
    const output = determineGroupResult(
      "Encounter",
      populations,
      populations,
      true
    );
    expect(output).toEqual("fail");
  });

  it("should return fail for non-matching populations values for boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: true,
        expected: true,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: false,
        expected: false,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: true,
        expected: false,
      },
    ];
    const output = determineGroupResult(
      "Encounter",
      populations,
      populations,
      true
    );
    expect(output).toEqual("fail");
  });

  it("should return pass for matching populations values for non-boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: 2,
        expected: 2,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: 0,
        expected: 0,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: 1,
        expected: 1,
      },
    ];
    const output = determineGroupResult(
      "Encounter",
      populations,
      populations,
      true
    );
    expect(output).toEqual("pass");
  });

  it("should return pass for matching populations values (undefined) for non-boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: 2,
        expected: 2,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: 0,
        expected: undefined,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: 0,
        expected: undefined,
      },
    ];
    const output = determineGroupResult(
      "Encounter",
      populations,
      populations,
      true
    );
    expect(output).toEqual("pass");
  });

  it("should return pass for matching populations values (empty) for non-boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: 2,
        expected: 2,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: 0,
        expected: null,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: 0,
        expected: "" as any,
      },
    ];
    const output = determineGroupResult(
      "Encounter",
      populations,
      populations,
      true
    );
    expect(output).toEqual("pass");
  });

  it("should return fail for matching populations values (zero) for non-boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: 2,
        expected: 0,
      },
    ];
    const output = determineGroupResult(
      "Encounter",
      populations,
      populations,
      true
    );
    expect(output).toEqual("fail");
  });

  it("should return fail for matching populations values (undefined) for non-boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: 1,
        expected: undefined,
      },
    ];
    const output = determineGroupResult(
      "Encounter",
      populations,
      populations,
      true
    );
    expect(output).toEqual("fail");
  });

  it("should return fail for matching populations values (empty) for non-boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: 1,
        expected: "" as any,
      },
    ];
    const output = determineGroupResult(
      "Encounter",
      populations,
      populations,
      true
    );
    expect(output).toEqual("fail");
  });

  it("should return pass for matching populations values (empty) for non-boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: 2,
        expected: 2,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: 0,
        expected: null,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: 1,
        expected: 1,
      },
      {
        id: "4",
        name: PopulationType.DENOMINATOR_EXCLUSION,
        actual: "" as any,
        expected: undefined,
      },
    ];
    const output = determineGroupResult(
      "Encounter",
      populations,
      populations,
      true
    );
    expect(output).toEqual("pass");
  });
});

describe("determineGroupResultStratification", () => {
  it("Should return initial state when isTestCaseExported is false", () => {
    const output = determineGroupResultStratification(null, null, null, false);
    expect(output).toEqual("initial");
  });

  it("Should return fail state when patient based stratification result doesn't match", () => {
    const stratification: StratificationExpectedValue = {
      expected: true,
      id: "test-id",
      name: "Strat-1",
      actual: false,
    };
    const output = determineGroupResultStratification(
      "boolean",
      stratification,
      stratification,
      true
    );
    expect(output).toEqual("fail");
  });

  it("Should return pass state when patient based stratification result matches", () => {
    const stratification: StratificationExpectedValue = {
      expected: true,
      id: "test-id",
      name: "Strat-1",
      actual: true,
    };
    const output = determineGroupResultStratification(
      "boolean",
      stratification,
      stratification,
      true
    );
    expect(output).toEqual("pass");
  });

  it("Should return fail state when patient based stratification expected is null and actual is true", () => {
    const stratification: StratificationExpectedValue = {
      expected: null,
      id: "test-id",
      name: "Strat-1",
      actual: true,
    };
    const output = determineGroupResultStratification(
      "boolean",
      stratification,
      stratification,
      true
    );
    expect(output).toEqual("fail");
  });

  it("Should return fail state when patient based stratification expected is true and actual is null", () => {
    const stratification: StratificationExpectedValue = {
      expected: true,
      id: "test-id",
      name: "Strat-1",
      actual: null,
    };
    const output = determineGroupResultStratification(
      "boolean",
      stratification,
      stratification,
      true
    );
    expect(output).toEqual("fail");
  });

  it("Should return pass state when patient based stratification expected and actual are null or undefined", () => {
    const stratification: StratificationExpectedValue = {
      expected: undefined,
      id: "test-id",
      name: "Strat-1",
      actual: null,
    };
    const output = determineGroupResultStratification(
      "boolean",
      stratification,
      stratification,
      true
    );
    expect(output).toEqual("pass");
  });

  it("Should return fail state when non-patient based stratification result doesn't match", () => {
    const stratification: StratificationExpectedValue = {
      expected: 2,
      id: "test-id",
      name: "Strat-1",
      actual: 1,
    };
    const output = determineGroupResultStratification(
      "Encounter",
      stratification,
      stratification,
      true
    );
    expect(output).toEqual("fail");
  });

  it("Should return pass state when non-patient based stratification result matches", () => {
    const stratification: StratificationExpectedValue = {
      expected: 2,
      id: "test-id",
      name: "Strat-1",
      actual: 2,
    };
    const output = determineGroupResultStratification(
      "Encounter",
      stratification,
      stratification,
      true
    );
    expect(output).toEqual("pass");
  });

  it("Should return fail state when non-patient based stratification expected is null", () => {
    const stratification: StratificationExpectedValue = {
      expected: null,
      id: "test-id",
      name: "Strat-1",
      actual: 1,
    };
    const output = determineGroupResultStratification(
      "Encounter",
      stratification,
      stratification,
      true
    );
    expect(output).toEqual("fail");
  });

  it("Should return fail state when non-patient based stratification actual is null", () => {
    const stratification: StratificationExpectedValue = {
      expected: 2,
      id: "test-id",
      name: "Strat-1",
      actual: null,
    };
    const output = determineGroupResultStratification(
      "Encounter",
      stratification,
      stratification,
      true
    );
    expect(output).toEqual("fail");
  });

  it("Should return pass state when non-patient based stratification expected and actual are null or undefined", () => {
    const stratification: StratificationExpectedValue = {
      expected: undefined,
      id: "test-id",
      name: "Strat-1",
      actual: null,
    };
    const output = determineGroupResultStratification(
      "Encounter",
      stratification,
      stratification,
      true
    );
    expect(output).toEqual("pass");
  });
});
