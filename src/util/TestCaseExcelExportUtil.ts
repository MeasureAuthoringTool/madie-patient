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
  GroupPopulation,
  TestCaseExcelExportDto,
  PopulationDto,
  DefinitionDto,
  FunctionDto,
  StratificationDto,
  TestCaseExecutionResultDto,
  GroupedStratificationDto,
} from "@madie/madie-models";
import { CqlDefinitionCallstack } from "../components/editTestCase/groupCoverage/QiCoreGroupCoverage";
import {
  StatementCoverageResult,
  buildHighlightingForGroups,
} from "./cqlCoverageBuilder/CqlCoverageBuilder";
import { QdmCalculationService } from "../api/QdmCalculationService";

export const convertToNumber = (value: number | boolean | string) => {
  let convertedNumber: number = 0;
  if (typeof value === "string") {
    convertedNumber = Number(value);
  } else if (typeof value === "number") {
    convertedNumber = value;
  } else {
    convertedNumber = value === true ? 1 : 0;
  }
  return convertedNumber;
};

const populatePopulationDtos = (
  groupPopulation: GroupPopulation
): PopulationDto[] => {
  const populationDtos: PopulationDto[] = [];
  const popValues = groupPopulation?.populationValues;
  popValues?.forEach((pop) => {
    const expected: number = convertToNumber(pop.expected);
    const actual: number = convertToNumber(pop.actual);
    const popDto: PopulationDto = {
      name: pop.name,
      expected: expected,
      actual: actual,
      pass: expected === actual,
    };
    populationDtos.push(popDto);
  });
  return populationDtos;
};

const convertToStratDto = (strat): StratificationDto[] => {
  const stratificationDtos: StratificationDto[] = [];
  const expected: number = convertToNumber(strat.expected);
  const actual: number = convertToNumber(strat.actual);
  const stratDto: StratificationDto = {
    id: strat.id,
    name: "STRAT",
    expected: expected,
    actual: actual,
    pass: expected === actual,
  };
  stratificationDtos.push(stratDto);
  strat.populationValues?.forEach((pop) => {
    const expected: number = convertToNumber(strat.expected);
    const actual: number = convertToNumber(strat.actual);
    const stratDto: StratificationDto = {
      id: strat.id,
      name: pop.name,
      expected: expected,
      actual: actual,
      pass: expected === actual,
    };
    stratificationDtos.push(stratDto);
  });

  return stratificationDtos;
};
const populateStratificationDtos = (
  groupPopulation: GroupPopulation,
  groupNumber: number,
  stratNumber: number,
  testCaseId: string
): GroupedStratificationDto[] => {
  let stratificationDtos: StratificationDto[] = [];
  let groupedStratsDtos: GroupedStratificationDto[] = [];
  groupPopulation?.stratificationValues?.forEach((strat) => {
    stratificationDtos = convertToStratDto(strat);
    const groupedStratsDto = {
      testCaseId: testCaseId,
      stratId: strat.id,
      stratName: `PopSet${groupNumber} Stratification ${stratNumber}`,
      stratificationDtos: stratificationDtos,
    };
    groupedStratsDtos.push(groupedStratsDto);
    stratNumber += 1;
  });
  return groupedStratsDtos;
};

export const createExcelExportDtosForAllTestCases = (
  measure: Measure,
  cqmMeasure: CqmMeasure,
  calculationOutput: CqmExecutionResultsByPatient,
  callstack: CqlDefinitionCallstack
): TestCaseExcelExportDto[] => {
  const testCaseExcelExportDtos: TestCaseExcelExportDto[] = [];
  const qdmCalculationService = new QdmCalculationService();
  const testCasesForExport = _.cloneDeep(measure.testCases)
    .map((testCase) => {
      const patient: QDMPatient = JSON.parse(testCase.json);
      if (_.isNil(patient?._id)) {
        return null;
      }
      const patientResults = calculationOutput[patient._id];
      return qdmCalculationService.processTestCaseResults(
        testCase,
        [...measure.groups],
        measure,
        patientResults
      );
    })
    .filter((tc) => !_.isNil(tc));

  let groupNumber = 1;
  measure.groups?.forEach((group: Group) => {
    const testCaseExecutionResultDtos: TestCaseExecutionResultDto[] = [];
    testCasesForExport?.forEach((currentTestCase) => {
      const patient: QDMPatient = JSON.parse(currentTestCase.json);
      const patientResults = calculationOutput[patient._id];

      const groupPopulation = currentTestCase.groupPopulations?.find(
        (groupPopulation) => {
          return groupPopulation.groupId === group.id;
        }
      );

      let groupedStratDtos: GroupedStratificationDto[] = [];
      let stratNumber = 1;
      const populationDtos: PopulationDto[] =
        populatePopulationDtos(groupPopulation);
      groupedStratDtos = populateStratificationDtos(
        groupPopulation,
        groupNumber,
        stratNumber,
        currentTestCase.id
      );

      const coverageResults = buildHighlightingForGroups(
        patientResults,
        cqmMeasure
      );
      const resultDto: TestCaseExecutionResultDto =
        buildTestCaseExecutionResult(
          currentTestCase,
          coverageResults,
          callstack,
          populationDtos,
          groupedStratDtos
        );
      testCaseExecutionResultDtos.push(resultDto);
    });
    const testCaseExcelExportDto: TestCaseExcelExportDto = {
      groupId: group.id,
      groupNumber: findGroupNumber(measure.groups, group.id),
      testCaseExecutionResults: testCaseExecutionResultDtos,
    };
    testCaseExcelExportDtos.push(testCaseExcelExportDto);
    groupNumber += groupNumber;
  });

  return testCaseExcelExportDtos;
};

export const buildTestCaseExecutionResult = (
  currentTestCase: TestCase,
  coverageResults,
  callstack: CqlDefinitionCallstack,
  populationDtos: PopulationDto[],
  groupedStratsDtos: GroupedStratificationDto[]
): TestCaseExecutionResultDto => {
  const qdmPatient: QDMPatient = JSON.parse(currentTestCase.json);
  return {
    testCaseId: currentTestCase?.id,
    populations: populationDtos,
    notes: currentTestCase?.description,
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
    stratifications: groupedStratsDtos,
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
