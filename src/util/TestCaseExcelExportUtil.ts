import * as _ from "lodash";
import {
  QDMPatient,
  DataElement,
  CqmMeasure,
  CqmExecutionResultsByPatient,
} from "cqm-models";
import {
  Measure,
  TestCase,
  Group,
  TestCaseExcelExportDto,
  PopulationDto,
  DefinitionDto,
  FunctionDto,
  TestCaseExecutionResultDto,
} from "@madie/madie-models";
import { CqlDefinitionCallstack } from "../components/editTestCase/groupCoverage/QiCoreGroupCoverage";
import {
  StatementCoverageResult,
  buildHighlightingForGroups,
} from "./cqlCoverageBuilder/CqlCoverageBuilder";

export const createExcelExportDtosForAllTestCases = (
  measure: Measure,
  cqmMeasure: CqmMeasure,
  calculationOutput: CqmExecutionResultsByPatient,
  callstack: CqlDefinitionCallstack
): TestCaseExcelExportDto[] => {
  const testCaseExcelExportDtos: TestCaseExcelExportDto[] = [];

  measure.groups?.forEach((group) => {
    const testCaseExecutionResultDtos: TestCaseExecutionResultDto[] = [];
    measure.testCases?.forEach((currentTestCase) => {
      const patient = JSON.parse(currentTestCase.json);
      const patientResults = calculationOutput[patient._id];
      const coverageResults = buildHighlightingForGroups(
        patientResults,
        cqmMeasure
      );
      const resultDto: TestCaseExecutionResultDto =
        buildTestCaseExecutionResult(
          currentTestCase,
          coverageResults,
          callstack
        );
      testCaseExecutionResultDtos.push(resultDto);
    });
    const testCaseExcelExportDto: TestCaseExcelExportDto = {
      groupId: group.id,
      groupNumber: findGroupNumber(measure.groups, group.id),
      testCaseExecutionResults: testCaseExecutionResultDtos,
    };
    testCaseExcelExportDtos.push(testCaseExcelExportDto);
  });

  return testCaseExcelExportDtos;
};

export const buildTestCaseExecutionResult = (
  currentTestCase: TestCase,
  coverageResults,
  callstack: CqlDefinitionCallstack
): TestCaseExecutionResultDto => {
  const qdmPatient: QDMPatient = JSON.parse(currentTestCase.json);
  return {
    populations: getTestCaseExecutionGroupInfo(currentTestCase),
    notes: "",
    last: currentTestCase?.series,
    first: currentTestCase?.title,
    birthdate: getReformattedDob(qdmPatient?.birthDatetime),
    expired: "",
    deathdate: "",
    ethnicity: getDataElementByStatus("ethnicity", qdmPatient),
    race: getDataElementByStatus("race", qdmPatient),
    gender: getDataElementByStatus("gender", qdmPatient),
    definitions: getTestCaseExecutionDefinitionsInfo(
      currentTestCase,
      coverageResults,
      callstack
    ),
    functions: getTestCaseExecutionFunctionsInfo(
      currentTestCase,
      coverageResults,
      callstack
    ),
  };
};

export function getReformattedDob(dob: string) {
  let formattedDob: string = "";
  if (dob) {
    const dateObj = new Date(dob);
    const year = dateObj.getUTCFullYear().toString();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    formattedDob = `${month}/${day}/${year}`;
  }
  return formattedDob;
}

export function getDataElementByStatus(
  status: string,
  patient: QDMPatient
): string {
  const element: DataElement = patient?.dataElements?.find(
    (element) => element?.qdmStatus === status
  );
  if (element) {
    return element.dataElementCodes?.[0]?.display;
  }
  return null;
}

export function getTestCaseExecutionGroupInfo(
  testCase: TestCase
): PopulationDto[] {
  let populations = [];
  testCase?.groupPopulations?.[0]?.populationValues?.forEach(
    (populationValue) => {
      populations.push({
        name: populationValue.name,
        expected: populationValue.expected,
        actual: populationValue.actual,
      } as PopulationDto);
    }
  );
  return populations;
}

export function getTestCaseExecutionDefinitionsInfo(
  testCase: TestCase,
  groupCoverageResult,
  callstack: CqlDefinitionCallstack
): DefinitionDto[] {
  let definitions = [];
  let result: StatementCoverageResult[];
  const statementResults =
    groupCoverageResult[testCase?.groupPopulations?.[0]?.groupId];
  if (statementResults) {
    result = statementResults
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((statementResult) =>
        definitionFilterCondition(statementResult, "Definitions")
      );
  }
  if (result && result.length > 0) {
    result.forEach((statementCoverageResult) => {
      definitions.push({
        logic: findDefinitionLogic(callstack, statementCoverageResult.name),
        actual: statementCoverageResult.result,
      } as DefinitionDto);
    });
  }
  return definitions;
}

export function getTestCaseExecutionFunctionsInfo(
  testCase: TestCase,
  groupCoverageResult,
  callstack: CqlDefinitionCallstack
): FunctionDto[] {
  let functions = [];
  let result: StatementCoverageResult[];
  const statementResults =
    groupCoverageResult[testCase?.groupPopulations?.[0]?.groupId];
  if (statementResults) {
    result = statementResults
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((statementResult) =>
        definitionFilterCondition(statementResult, "Functions")
      );
  }
  if (result && result.length > 0) {
    result.forEach((statementCoverageResult) => {
      functions.push({
        logic: findDefinitionLogic(callstack, statementCoverageResult.name),
        actual: statementCoverageResult.result,
      } as FunctionDto);
    });
  }
  return functions;
}

export const definitionFilterCondition = (
  statementResult,
  definitionCategory
) => {
  if (definitionCategory === "Definitions") {
    return (
      statementResult.type === undefined && statementResult.relevance !== "NA"
    );
  } else if (definitionCategory === "Functions") {
    return statementResult.type === "FunctionDef";
  }
  // for unused defines
  return (
    statementResult.relevance === "NA" && statementResult.type !== "FunctionDef"
  );
};

//this is used for excel-export: each group number will be a separate worksheet
export function findGroupNumber(groups: Group[], groupId: string): string {
  let groupNumber = null;
  if (groups && groups.length > 0) {
    groups.forEach((group, index) => {
      if (group.id === groupId) {
        groupNumber = (index + 1).toString();
        return;
      }
    });
  }
  return groupNumber;
}

//this is used for excel-export: TestCaseGroupDto.testCaseExecutionResults[].definitions[].logic
// and TestCaseGroupDto.testCaseExecutionResults[].functions[].logic
export function findDefinitionLogic(
  callstack: CqlDefinitionCallstack,
  definition: string
): string {
  let definitionLogic = definition;
  if (callstack) {
    Object.values(callstack).forEach((cqlExpressions) => {
      if (cqlExpressions[0].id === definition) {
        definitionLogic = cqlExpressions[0].logic;
      }
    });
  }
  return definitionLogic;
}
