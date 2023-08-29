import { Calculator } from "cqm-execution";
import { CqmMeasure, IndividualResult } from "cqm-models";
import {
  Group,
  Measure,
  PopulationExpectedValue,
  PopulationType,
  TestCase,
} from "@madie/madie-models";
import * as _ from "lodash";
import { ExecutionStatusType } from "./CalculationService";
import { GroupPopulation } from "@madie/madie-models/dist/TestCase";
import { isTestCasePopulationObservation } from "../util/Utils";
import { getPopulationTypesForScoring } from "../util/PopulationsMap";

export enum CqmPopulationType {
  IPP = "initialPopulation",
  DENOM = "denominator",
  DENEX = "denominator-exclusion",
  DENEXCEP = "denominator-exception",
  NUMER = "numerator",
  NUMEX = "numerator-exclusion",
  MSRPOPL = "measure-population",
  MSRPOPLEX = "measure-population-exclusion",
  OBSERV = "measure-observation",
}

export interface CqmExecutionResultsByPatient {
  [patientId: string]: CqmExecutionPatientResultsByPopulationSet;
}

export interface CqmExecutionPatientResultsByPopulationSet {
  [populationSetId: string]: IndividualResult;
}

export class QdmCalculationService {
  async calculateQdmTestCases(
    cqmMeasure: CqmMeasure,
    patients: any[]
  ): Promise<CqmExecutionResultsByPatient> {
    // Example options; includes directive to produce pretty statement results.
    const options = {
      doPretty: false, // getting errors inside cqm-execution with this on, need to debug more
    };

    const calculationResults = await Calculator.calculate(
      cqmMeasure,
      patients,
      cqmMeasure.value_sets,
      options
    );
    // set onto window for any environment debug purposes
    if (localStorage.getItem("madieDebug") || (window as any).madieDebug) {
      // eslint-disable-next-line no-console
      console.log("cqm execution calculation results", calculationResults);
    }
    return calculationResults;
  }

  mapMeasureGroup(measure: Measure, measureGroup: Group): GroupPopulation {
    return {
      groupId: measureGroup.id,
      scoring: measure.scoring,
      populationBasis: String(measure.patientBasis),
      stratificationValues: [],
      populationValues: getPopulationTypesForScoring(measureGroup)?.map(
        (population: PopulationExpectedValue) => ({
          name: population.name,
          expected: measure.patientBasis ? false : null,
          actual: measure.patientBasis ? false : null,
          id: population.id,
          criteriaReference: population.criteriaReference,
        })
      ),
    };
  }

  isValuePass(actual: any, expected: any, patientBased: boolean) {
    if (patientBased) {
      return !!actual == !!expected;
    } else {
      const actualVal = _.isNil(actual) ? 0 : _.toNumber(actual);
      const expectedVal = _.isNil(expected) ? 0 : _.toNumber(expected);
      return actualVal == expectedVal;
    }
  }

  isGroupPass(groupPopulation: GroupPopulation, patientBased: boolean) {
    let groupPass = true;

    if (groupPopulation) {
      groupPopulation.populationValues?.every((popVal) => {
        const isObs = isTestCasePopulationObservation(popVal);
        groupPass =
          groupPass &&
          this.isValuePass(
            popVal.actual,
            popVal.expected,
            isObs ? false : patientBased
          );
        return groupPass;
      });

      groupPopulation?.stratificationValues?.every((stratVal) => {
        groupPass =
          groupPass &&
          this.isValuePass(stratVal.actual, stratVal.expected, patientBased);
        return groupPass;
      });
    }

    return groupPass;
  }

  processTestCaseResults(
    testCase: TestCase,
    measureGroups: Group[],
    measure: Measure,
    populationGroupResults: CqmExecutionPatientResultsByPopulationSet
  ) {
    if (_.isNil(testCase)) {
      return testCase;
    }

    const updatedTestCase = _.cloneDeep(testCase);
    if (_.isNil(testCase?.groupPopulations)) {
      updatedTestCase.groupPopulations = [];
    }
    const patientBased = measure.patientBasis ?? false;

    let allGroupsPass = true;
    // Only perform calculations for provided groups (Can be used to limit results)
    for (const measureGroup of measureGroups) {
      const groupId = measureGroup.id;
      let tcGroupPopulation = updatedTestCase.groupPopulations.find(
        (gp) => gp?.groupId === groupId
      );
      if (_.isNil(tcGroupPopulation)) {
        tcGroupPopulation = this.mapMeasureGroup(measure, measureGroup);
        updatedTestCase.groupPopulations.push(tcGroupPopulation);
      }

      const results = populationGroupResults[groupId];
      let populationMap = new Map<String, number>();
      let groupsMap = new Map<String, Map<String, number>>();

      if (_.isNil(testCase?.groupPopulations)) {
        updatedTestCase.groupPopulations = [];
      }

      Object.entries(CqmPopulationType).forEach((value, key) => {
        //value is one of IPP, DENOM, NUMER, etc...
        //Set's an entry = IPP & numeric value from results
        populationMap.set(value[1], eval(`results.${value[0]}`));
      });

      groupsMap.set("" + groupId, populationMap);

      testCase.groupPopulations.forEach((value) => {
        if (value.groupId === groupId) {
          value.populationValues.forEach((population) => {
            //Look up population
            population.actual = groupsMap.get(groupId).get(population.name);
          });
        }
      });

      allGroupsPass =
        allGroupsPass && this.isGroupPass(tcGroupPopulation, patientBased);
    }

    updatedTestCase.executionStatus = allGroupsPass
      ? ExecutionStatusType.PASS
      : ExecutionStatusType.FAIL;

    return updatedTestCase;
  }
}

export default function qdmCalculationService(): QdmCalculationService {
  return new QdmCalculationService();
}
