import { Calculator } from "fqm-execution";
import { format } from "date-fns";
import {
  CalculationOutput,
  DetailedPopulationGroupResult,
} from "fqm-execution/build/types/Calculator";
import TestCase from "../models/TestCase";
import Measure from "../models/Measure";
import { FHIRHelpers } from "../util/FHIRHelpers";

// TODO consider converting into a context.
// OR a re-usable hook.
export class CalculationService {
  async calculateTestCases(
    measure: Measure,
    testCases: TestCase[]
  ): Promise<DetailedPopulationGroupResult[]> {
    const measureBundle = this.buildMeasureBundle(measure);
    const TestCaseBundles = testCases.map((testCase) => {
      return this.buildPatientBundle(testCase);
    });
    /* eslint no-console:off */
    console.log("measure Bundle", measureBundle);
    console.log("TestCase Bundle", TestCaseBundles);

    const results = await this.calculate(
      measureBundle,
      TestCaseBundles,
      measure.measurementPeriodStart,
      measure.measurementPeriodEnd
    );
    console.log("Results from fqm execution", results);
    return results?.results[0]?.detailedResults;
  }

  buildMeasureBundle(measure: Measure): fhir4.Bundle {
    return {
      resourceType: "Bundle",
      type: "transaction",
      entry: [
        // Measure Resource
        {
          resource: {
            resourceType: "Measure",
            status: "draft", //TODO convert measure.state to status enum.
            library: [
              `http://ecqi.healthit.gov/ecqms/Library/${measure.cqlLibraryName}`,
            ],
            // Hardcoded measure group: Proportion with IPP, NUM, and DENOM.
            group: [
              {
                population: [
                  {
                    id: "27CB432E-90F5-410D-AB6E-8595CB123344",
                    code: {
                      coding: [
                        {
                          system:
                            "http://terminology.hl7.org/CodeSystem/measure-population",
                          code: "initial-population",
                          display: "Initial Population",
                        },
                      ],
                    },
                    criteria: {
                      language: "text/cql.identifier",
                      expression: "ipp",
                    },
                  },
                  {
                    id: "0E19CEC4-017E-4BA5-89E2-1710CB300B92",
                    code: {
                      coding: [
                        {
                          system:
                            "http://terminology.hl7.org/CodeSystem/measure-population",
                          code: "denominator",
                          display: "Denominator",
                        },
                      ],
                    },
                    criteria: {
                      language: "text/cql.identifier",
                      expression: "denom",
                    },
                  },
                  {
                    id: "6505FF9E-A6BE-4134-809C-46294A10DA2C",
                    code: {
                      coding: [
                        {
                          system:
                            "http://terminology.hl7.org/CodeSystem/measure-population",
                          code: "numerator",
                          display: "Numerator",
                        },
                      ],
                    },
                    criteria: {
                      language: "text/cql.identifier",
                      expression: "num",
                    },
                  },
                ],
              },
            ],
          },
          request: { method: "PUT", url: `Measure/${measure.cqlLibraryName}` },
        },
        // Measure Library Resource
        {
          resource: {
            resourceType: "Library",
            url: `http://ecqi.healthit.gov/ecqms/Library/${measure.cqlLibraryName}`,
            status: "active",
            type: {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/library-type",
                  code: "logic-library",
                },
              ],
            },
            content: [
              { contentType: "text/cql", data: `${btoa(measure.cql)}` },
              {
                contentType: "application/elm+json",
                data: `${btoa(measure.elmJson)}`,
              },
            ],
          },
          request: { method: "PUT", url: `Library/${measure.cqlLibraryName}` },
        },
        // FHIR Helpers
        { ...FHIRHelpers },
      ],
    };
  }

  buildPatientBundle(testCase: TestCase): fhir4.Bundle {
    return JSON.parse(testCase.json);
  }

  async calculate(
    measureBundle,
    patientBundles,
    measurementPeriodStart,
    measurementPeriodEnd
  ): Promise<CalculationOutput> {
    return await Calculator.calculate(measureBundle, patientBundles, {
      includeClauseResults: false,
      measurementPeriodStart: measurementPeriodStart,
      measurementPeriodEnd: measurementPeriodEnd,
    });
  }
}

export default function useCalculation(): CalculationService {
  return new CalculationService();
}
