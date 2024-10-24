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
      doPretty: true,
      includeClauseResults: true,
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

  // episodeResults.observation_values holds results for all observations associated to that episode from all groups.
  // It is assumed that the observation values are stored sequentially, so based on groupIndex, we are getting observations results for that particular group
  // Example: Episode-xyz has observation_values [3,56,8], For this particular episode, group-1's actual value is 3, group-2's actual value is 56 and so on...
  // Observation_Values are ignored if MSRPOPL == 1 & MSRPOPLEX == 1, since the execution results might contain the value, even though it is not a valid scenario.
  getEpisodeObservationResult(
    population: PopulationExpectedValue,
    episodeResults: any,
    targetIndex: number,
    gpIndex: number
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
        result =
          episode?.observation_values?.length > 1
            ? episode?.observation_values?.[gpIndex]
            : episode?.observation_values?.[0];
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

      Object.entries(CqmPopulationType).forEach((value, key) => {
        //value is one of IPP, DENOM, NUMER, etc...
        //Sets an entry = IPP & numeric value from results
        populationMap.set(value[1], results[value[0]]);
      });

      updatedTestCase.groupPopulations.forEach((tcGroupPop, gpIndex) => {
        let obsCount = 0;
        let obsTracker = {};
        if (tcGroupPop.groupId === groupId) {
          tcGroupPop.populationValues.forEach((population) => {
            if (isTestCasePopulationObservation(population)) {
              if (patientBased) {
                if (tcGroupPop.scoring === MeasureScoring.RATIO) {
                  population.actual = this.mapPatientBasedObservations(
                    population,
                    results
                  );
                } else {
                  population.actual = results?.observation_values?.[gpIndex];
                }
              } else if (obsCount < results?.observation_values?.length) {
                const obsResult = this.getEpisodeObservationResult(
                  population,
                  results.episode_results,
                  obsTracker[population.name] ?? 0,
                  gpIndex
                );
                if (!_.isNil(obsResult)) {
                  population.actual = obsResult;
                  obsTracker[population.name] =
                    (obsTracker[population.name] ?? 0) + 1;
                }
              }
              obsCount++;
            } else {
              // Look up calculation result value for a particular population
              const value = populationMap.get(population.name);
              population.actual = measure.patientBasis ? !!value : value;
            }
          });
          // so we can reference them by the two sets of indeces
          tcGroupPop.stratificationValues?.forEach((strat, stratIndex) => {
            let stratId = `PopulationSet_${gpIndex + 1}_Stratification_${
              stratIndex + 1
            }`;
            const value = populationGroupResults[stratId]?.STRAT;
            strat.actual = measure.patientBasis ? !!value : value;
            let stratPopulationMap = new Map<String, number>();
            Object.entries(CqmPopulationType).forEach((value, key) => {
              stratPopulationMap.set(
                value[1],
                populationGroupResults[stratId]?.[value[0]]
              );
            });
            // groupsMap.set(groupId, populationMap);
            this.setTestCaseGroupResultsForStratificationPopulations(
              patientBased,
              tcGroupPop,
              gpIndex,
              stratPopulationMap,
              strat,
              populationGroupResults,
              stratId
            );
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

  // Each stratification has a set a population values,
  // this method will set execution results i.e actual values for stratification populations
  // Adding Actual values to group population also uses the similar logic.
  setTestCaseGroupResultsForStratificationPopulations(
    patientBased,
    tcGroupPop,
    gpIndex,
    stratPopulationMap,
    strat,
    populationGroupResults,
    stratId
  ) {
    let obsCount = 0;
    let obsTracker = {};
    strat.populationValues?.forEach((population) => {
      if (isTestCasePopulationObservation(population)) {
        if (patientBased) {
          if (tcGroupPop.scoring === MeasureScoring.RATIO) {
            population.actual = this.mapPatientBasedObservations(
              population,
              populationGroupResults[stratId]
            );
          } else {
            population.actual =
              populationGroupResults[stratId]?.observation_values?.[0];
          }
        } else if (
          obsCount < populationGroupResults[stratId]?.observation_values?.length
        ) {
          const obsResult = this.getEpisodeObservationResult(
            population,
            populationGroupResults[stratId].episode_results,
            obsTracker[population.name] ?? 0,
            gpIndex
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
        const value = stratPopulationMap.get(population.name);
        population.actual = patientBased ? !!value : value;
      }
    });
  }
}

export default function qdmCalculationService(): QdmCalculationService {
  return new QdmCalculationService();
}
