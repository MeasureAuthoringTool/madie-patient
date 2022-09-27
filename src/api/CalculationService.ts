import { Calculator } from "fqm-execution";
import {
  CalculationOutput,
  ExecutionResult,
} from "fqm-execution/build/types/Calculator";
import { TestCase, Measure } from "@madie/madie-models";
import { ValueSet, Bundle } from "fhir/r4";
import * as _ from "lodash";

export interface StatementResultMap {
  [statementName: string]: number;
}

export interface GroupStatementResultMap {
  [groupId: string]: StatementResultMap;
}

export interface TestCaseGroupStatementResult {
  [testCaseId: string]: GroupStatementResultMap;
}

// TODO consider converting into a context.
// OR a re-usable hook.
export class CalculationService {
  async calculateTestCases(
    measure: Measure,
    testCases: TestCase[],
    measureBundle: Bundle,
    valueSets: ValueSet[]
  ): Promise<ExecutionResult<any>[]> {
    const TestCaseBundles = testCases.map((testCase) => {
      return this.buildPatientBundle(testCase);
    });

    const calculationOutput: CalculationOutput<any> = await this.calculate(
      measureBundle,
      TestCaseBundles,
      valueSets,
      measure.measurementPeriodStart,
      measure.measurementPeriodEnd
    );
    return calculationOutput?.results;
  }

  // fqm Execution requires each patient to be with unique ID.
  // So assigning the testCase ID as patient ID to retrieve calculate multiple testcases
  buildPatientBundle(testCase: TestCase): Bundle {
    const testCaseBundle: Bundle = JSON.parse(testCase.json);
    testCaseBundle.entry
      .filter((entry) => {
        return entry.resource.resourceType === "Patient";
      })
      .forEach((entry) => {
        entry.resource.id = testCase.id;
      });
    return testCaseBundle;
  }

  async calculate(
    measureBundle,
    patientBundles,
    valueSets,
    measurementPeriodStart,
    measurementPeriodEnd
  ): Promise<CalculationOutput<any>> {
    try {
      return await Calculator.calculate(
        measureBundle,
        patientBundles,
        {
          includeClauseResults: false,
          profileValidation: true,
          measurementPeriodStart: measurementPeriodStart,
          measurementPeriodEnd: measurementPeriodEnd,
        },
        valueSets
      );
    } catch (err) {
      console.error("An error occurred in FQM-Execution", err);
      throw err;
    }
  }

  processRawResults(rawResults: any): TestCaseGroupStatementResult {
    const testCaseResultMap: TestCaseGroupStatementResult = {};
    for (const tc of rawResults) {
      const testCaseId: string = tc?.patientId;
      const groupResults: any[] = tc?.detailedResults;
      const outputGroupResultsMap: GroupStatementResultMap = {};
      for (const groupResult of groupResults) {
        const groupId = groupResult?.groupId;
        const statementResults = groupResult?.statementResults;
        const defineResultMap: StatementResultMap = {};
        for (const statementResult of statementResults) {
          if (statementResult && statementResult.statementName) {
            if (typeof statementResult.raw === "boolean") {
              defineResultMap[statementResult.statementName] =
                statementResult?.raw ? 1 : 0;
            } else if (Array.isArray(statementResult?.raw)) {
              defineResultMap[statementResult.statementName] =
                statementResult?.raw?.length || 0;
            } else if (_.isNil(statementResult?.raw)) {
              defineResultMap[statementResult.statementName] = 0;
            } else {
              console.warn(`fell into else [${statementResult.statementName}]`, statementResult);
              defineResultMap[statementResult.statementName] = 0;
            }
          }
        }
        outputGroupResultsMap[groupId] = defineResultMap;
      }
      testCaseResultMap[testCaseId] = outputGroupResultsMap;
    }

    return testCaseResultMap;
  }
}

export default function calculationService(): CalculationService {
  return new CalculationService();
}
