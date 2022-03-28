import { Calculator } from "fqm-execution";
import {
  CalculationOutput,
  DetailedPopulationGroupResult,
  ExecutionResult,
} from "fqm-execution/build/types/Calculator";
import TestCase from "../models/TestCase";
import Measure from "../models/Measure";
import { FHIRHelpers } from "../util/FHIRHelpers";
import { getFhirMeasurePopulationCode } from "../util/PopulationsMap";
import { PopulationType } from "../models/MeasurePopulation";

// TODO consider converting into a context.
// OR a re-usable hook.
export class CalculationService {
  async calculateTestCases(
    measure: Measure,
    testCases: TestCase[]
  ): Promise<ExecutionResult[]> {
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
    return results?.results;
  }

  private buildMeasureBundle(measure: Measure): fhir4.Bundle {
    const bundle: fhir4.Bundle = {
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
            group: [],
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
    const measureResource: fhir4.Measure = bundle.entry.find(
      (e) => e.resource.resourceType === "Measure"
    ).resource as fhir4.Measure;

    this.buildMeasureGroups(measure, measureResource);

    return bundle;
  }

  private buildMeasureGroups(measure: Measure, measureResource: fhir4.Measure) {
    measure.groups.map((group) => {
      const fhirMeasureGroup: fhir4.MeasureGroup = {};
      fhirMeasureGroup.population = this.buildMeasureGroup(group.population);
      measureResource.group.push(fhirMeasureGroup);
    });
  }

  private buildMeasureGroup(
    measurePopulations: PopulationType
  ): fhir4.MeasureGroupPopulation[] {
    const msrPops: [string, string][] = Object.entries(measurePopulations);
    return msrPops.map((population) => {
      return this.buildMeasureGroupPopulation(population);
    });
  }

  private buildMeasureGroupPopulation(
    measurePopulation: [string, string]
  ): fhir4.MeasureGroupPopulation {
    return {
      code: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/measure-population",
            code: getFhirMeasurePopulationCode(measurePopulation[0]),
            display: measurePopulation[0],
          },
        ],
      },
      criteria: {
        language: "text/cql.identifier",
        // TODO Use correct display content.
        expression: measurePopulation[1],
      },
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

export default function calculationService(): CalculationService {
  return new CalculationService();
}
