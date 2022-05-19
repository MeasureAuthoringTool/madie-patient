import { Calculator } from "fqm-execution";
import {
  CalculationOutput,
  ExecutionResult,
} from "fqm-execution/build/types/Calculator";
import { TestCase, Measure, PopulationType } from "@madie/madie-models";
import { FHIRHelpers } from "../util/FHIRHelpers";
import { getFhirMeasurePopulationCode } from "../util/PopulationsMap";

// TODO consider converting into a context.
// OR a re-usable hook.
export class CalculationService {
  async calculateTestCases(
    measure: Measure,
    testCases: TestCase[],
    measureBundle: fhir4.Bundle
  ): Promise<ExecutionResult<any>[]> {
    const TestCaseBundles = testCases.map((testCase) => {
      return this.buildPatientBundle(testCase);
    });

    const calculationOutput: CalculationOutput<any> = await this.calculate(
      measureBundle,
      TestCaseBundles,
      measure.measurementPeriodStart,
      measure.measurementPeriodEnd
    );
    return calculationOutput?.results;
  }

  // fqm Execution requires each patient to be with unique ID.
  // So assigning the testCase ID as patient ID to retrieve calculate multiple testcases
  buildPatientBundle(testCase: TestCase): fhir4.Bundle {
    const testCaseBundle: fhir4.Bundle = JSON.parse(testCase.json);
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
    measurementPeriodStart,
    measurementPeriodEnd
<<<<<<< HEAD
  ): Promise<CalculationOutput<any>> {
=======
  ): Promise<CalculationOutput> {
>>>>>>> develop
    try {
      return await Calculator.calculate(measureBundle, patientBundles, {
        includeClauseResults: false,
        measurementPeriodStart: measurementPeriodStart,
        measurementPeriodEnd: measurementPeriodEnd,
      });
    } catch (err) {
      console.error("An error occurred in FQM-Execution", err);
      throw err;
    }
  }
}

export default function calculationService(): CalculationService {
  return new CalculationService();
}
