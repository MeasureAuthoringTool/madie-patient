import {
  mapCoverageCql,
  Population,
  CoverageMappedCql,
} from "./GroupCoverageHelpers";
import { CqlAntlr } from "@madie/cql-antlr-parser/dist/src";

jest.mock("@madie/cql-antlr-parser/dist/src", () => {
  return {
    CqlAntlr: jest.fn().mockImplementation(() => {
      return {
        parse: jest.fn().mockReturnValue({
          expressionDefinitions: [
            { name: "IP", text: "Initial Population Logic" },
            { name: "DENOM", text: "Denominator Logic" },
          ],
        }),
      };
    }),
  };
});

describe("mapCoverageCql", () => {
  const groupPopulations = {
    populations: [
      { id: "1", name: "IP", definition: "IP", criteriaReference: "criteria1" },
      {
        id: "2",
        name: "DENOM",
        definition: "DENOM",
        criteriaReference: "criteria2",
      },
      {
        id: "3",
        name: "NUMER",
        definition: null,
        criteriaReference: "criteria3",
      },
    ],
  };

  const allDefinitions = [
    {
      definitionName: "IP",
      definitionLogic: "Logic for IP",
      parentLibrary: "Library1",
      function: false,
    },
    {
      definitionName: "DENOM",
      definitionLogic: "Logic for DENOM",
      parentLibrary: "Library1",
      function: false,
    },
    {
      definitionName: "NUMER",
      definitionLogic: "Logic for NUMER",
      parentLibrary: "Library1",
      function: true,
    },
  ];

  test("should return mapped coverage CQL with valid inputs", () => {
    const measureCql = "some valid CQL";

    const result: CoverageMappedCql = mapCoverageCql(
      measureCql,
      groupPopulations,
      allDefinitions
    );

    expect(result).toEqual({
      populationDefinitions: {
        IP: { id: "1", text: "Initial Population Logic" },
        DENOM: { id: "2", text: "Denominator Logic" },
      },
      functions: {
        NUMER: {
          definitionLogic: "Logic for NUMER",
          parentLibrary: "Library1",
        },
      },
      definitions: {
        IP: {
          definitionLogic: "Logic for IP",
          parentLibrary: "Library1",
        },
        DENOM: {
          definitionLogic: "Logic for DENOM",
          parentLibrary: "Library1",
        },
      },
    });
  });

  test("should return empty result for undefined measureCql", () => {
    const result: CoverageMappedCql = mapCoverageCql(
      undefined,
      groupPopulations,
      allDefinitions
    );
    expect(result).toEqual(undefined);
  });

  test("should return empty result for empty populations", () => {
    const measureCql = "some valid CQL";
    const emptyPopulations = { populations: [] };

    const result: CoverageMappedCql = mapCoverageCql(
      measureCql,
      emptyPopulations,
      allDefinitions
    );

    expect(result.populationDefinitions).toEqual({});
  });
});
