import { Calculator } from "fqm-execution";
import {
  CalculationOutput,
  ExecutionResult,
} from "fqm-execution/build/types/Calculator";
import { TestCase, Measure } from "@madie/madie-models";
import { ValueSet, Bundle } from "fhir/r4";

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
}

export default function calculationService(): CalculationService {
  return new CalculationService();
}
