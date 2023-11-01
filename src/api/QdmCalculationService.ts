import { Calculator } from "cqm-execution";
import { CqmMeasure, IndividualResult } from "cqm-models";
import {
  Group,
  Measure,
  MeasureScoring,
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
  DENEX = "denominatorExclusion",
  DENEXCEP = "denominatorException",
  NUMER = "numerator",
  NUMEX = "numeratorExclusion",
  MSRPOPL = "measurePopulation",
  MSRPOPLEX = "measurePopulationExclusion",
  OBSERV = "measureObservation",
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
      stratificationValues: measureGroup?.stratifications
        ?.filter((stratification) => stratification.cqlDefinition)
        ?.map((stratification, index) => ({
          name: `Strata-${index + 1} ${_.startCase(
            stratification.association
          )}`,
          expected: measure.patientBasis ? false : null,
          actual: measure.patientBasis ? false : null,
          id: stratification.id,
          criteriaReference: "",
          // create references to individual populations
          populationValues: getPopulationTypesForScoring(measureGroup)?.map(
            (population: PopulationExpectedValue) => ({
              name: population.name,
              expected: measure.patientBasis ? false : null,
              actual: measure.patientBasis ? false : null,
              id: population.id,
              criteriaReference: population.criteriaReference,
            })
          ),
        })),
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

      // Todo: check if this logic needs to change for stratifications for QDM
      groupPopulation?.stratificationValues?.every((stratVal) => {
        groupPass =
          groupPass &&
          this.isValuePass(stratVal.actual, stratVal.expected, patientBased);
        return groupPass;
      });
    }

    return groupPass;
  }

  mapPatientBasedObservations = (population, results) => {
    if (population.name === PopulationType.DENOMINATOR_OBSERVATION) {
      if (results.DENOM === 1 && results.DENEX === 0) {
        return results?.observation_values?.[0];
      }
      if ((results.DENOM === 1 && results.DENEX === 1) || results.DENOM === 0) {
        return "NA";
      }
    }

    if (population.name === PopulationType.NUMERATOR_OBSERVATION) {
      if (results.NUMER === 1 && results.NUMEX === 0) {
        //check if both observations are present
        return results?.observation_values?.length > 1
          ? results?.observation_values?.[1]
          : results?.observation_values?.[0];
      }
      if ((results.NUMER === 1 && results.NUMEX === 1) || results.NUMER === 0) {
        return "NA";
      }
    }
  };

  getEpisodeObservationResult(
    population: PopulationExpectedValue,
    episodeResults: any,
    targetIndex: number
  ): number | undefined {
    let counter = 0;
    // find the next episode for the current target population
    for (const episodeId in episodeResults) {
      let result = undefined;
      const episode = episodeResults[episodeId];
      if (
        population.name === PopulationType.DENOMINATOR_OBSERVATION &&
        episode.DENOM === 1 &&
        episode.DENEX === 0
      ) {
        result = episode?.observation_values?.[0];
      } else if (
        population.name === PopulationType.NUMERATOR_OBSERVATION &&
        episode.NUMER === 1 &&
        episode.NUMEX === 0
      ) {
        result =
          episode?.observation_values?.length > 1
            ? episode?.observation_values?.[1]
            : episode?.observation_values?.[0];
      } else if (
        (population.name === PopulationType.MEASURE_POPULATION_OBSERVATION ||
          population.name === PopulationType.MEASURE_OBSERVATION) &&
        episode.MSRPOPL === 1 &&
        episode.MSRPOPLEX === 0
      ) {
        result = episode?.observation_values?.[0];
      }

      if (result && counter === targetIndex) {
        return result;
      } else if (result) {
        counter++;
      }
    }

    return undefined;
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

      Object.entries(CqmPopulationType).forEach((value, key) => {
        //value is one of IPP, DENOM, NUMER, etc...
        //Sets an entry = IPP & numeric value from results
        populationMap.set(value[1], results[value[0]]);
      });
      groupsMap.set("" + groupId, populationMap);

      updatedTestCase.groupPopulations.forEach((groupPop, gpIndex) => {
        let obsCount = 0;
        let obsTracker = {};
        if (groupPop.groupId === groupId) {
          groupPop.populationValues.forEach((population) => {
            if (isTestCasePopulationObservation(population)) {
              if (patientBased) {
                if (groupPop.scoring === MeasureScoring.RATIO) {
                  population.actual = this.mapPatientBasedObservations(
                    population,
                    results
                  );
                } else {
                  population.actual = results?.observation_values?.[0];
                }
              } else if (obsCount < results?.observation_values?.length) {
                const obsResult = this.getEpisodeObservationResult(
                  population,
                  results.episode_results,
                  obsTracker[population.name] ?? 0
                );
                if (!_.isNil(obsResult)) {
                  population.actual = obsResult;
                  obsTracker[population.name] =
                    (obsTracker[population.name] ?? 0) + 1;
                }
              }
              obsCount++;
            } else {
              //Look up population
              const value = groupsMap.get(groupId).get(population.name);
              population.actual = measure.patientBasis ? !!value : value;
            }
          });
          // so we can reference them by the two sets of indeces
          groupPop.stratificationValues?.forEach((strat, stratIndex) => {
            const value =
              populationGroupResults[
                `PopulationSet_${gpIndex + 1}_Stratification_${stratIndex + 1}`
              ]?.STRAT;
            strat.actual = measure.patientBasis ? !!value : value;
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
