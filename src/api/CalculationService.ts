import { Calculator } from "fqm-execution";
import {
  CalculationOutput,
  DetailedPopulationGroupResult,
  EpisodeResults,
  ExecutionResult,
  PopulationGroupResult,
} from "fqm-execution/build/types/Calculator";
import {
  Group,
  Measure,
  Population,
  PopulationExpectedValue,
  PopulationType,
  TestCase,
} from "@madie/madie-models";
import { Bundle, ValueSet } from "fhir/r4";
import * as _ from "lodash";

import { PopulationType as FqmPopulationType } from "fqm-execution/build/types/Enums";
import { FHIR_POPULATION_CODES } from "../util/PopulationsMap";
import { isTestCasePopulationObservation } from "../util/Utils";

export interface StatementResultMap {
  [statementName: string]: number;
}

export interface GroupStatementResultMap {
  [groupId: string]: StatementResultMap;
}

export interface TestCaseGroupStatementResult {
  [testCaseId: string]: GroupStatementResultMap;
}

export interface TestCaseGroupEpisodeResult {
  [testCaseId: string]: GroupPopulationEpisodeResultMap;
}

export interface GroupPopulationEpisodeResultMap {
  [groupId: string]: PopulationEpisodeResult[];
}

export interface PopulationEpisodeResult {
  populationType: FqmPopulationType;
  define: string;
  value: number;
}

// TODO consider converting into a context.
// OR a re-usable hook.
export class CalculationService {
  async calculateTestCases(
    measure: Measure,
    testCases: TestCase[],
    measureBundle: Bundle,
    valueSets: ValueSet[]
  ): Promise<CalculationOutput<any>> {
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

    // set onto window for any environment debug purposes
    (window as any).executionResults = calculationOutput?.results;
    return calculationOutput;
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

  processEpisodeResults(
    executionResults: ExecutionResult<DetailedPopulationGroupResult>[]
  ): TestCaseGroupEpisodeResult {
    const testCaseResultMap: TestCaseGroupEpisodeResult = {};
    if (executionResults) {
      for (const tc of executionResults) {
        const testCaseId: string = tc?.patientId;
        const groupResults: DetailedPopulationGroupResult[] =
          tc?.detailedResults || [];
        testCaseResultMap[testCaseId] =
          this.processEpisodeResultsForGroups(groupResults);
      }
    }
    return testCaseResultMap;
  }

  processEpisodeResultsForGroups(
    groupResults: DetailedPopulationGroupResult[]
  ): GroupPopulationEpisodeResultMap {
    const outputGroupResultsMap: GroupPopulationEpisodeResultMap = {};
    for (const groupResult of groupResults) {
      const groupId = groupResult?.groupId;
      let groupPopResults: PopulationEpisodeResult[] = [];
      if (groupResult.episodeResults) {
        for (const episodeResult of groupResult.episodeResults) {
          groupPopResults = this.mergeResults(episodeResult, groupPopResults);
        }
      }
      outputGroupResultsMap[groupId] = groupPopResults;
    }
    return outputGroupResultsMap;
  }

  mergeResults(
    episodeResult: EpisodeResults,
    groupPopResults: PopulationEpisodeResult[]
  ): PopulationEpisodeResult[] {
    // TODO: if/when fqm-execution returns IDs for populations, replace
    // position/index based logic with ID lookup
    if (!groupPopResults || groupPopResults.length === 0) {
      groupPopResults =
        episodeResult?.populationResults?.map((pr) => ({
          populationType: pr.populationType,
          define: pr.criteriaExpression,
          value: pr?.result ? 1 : 0,
        })) || [];
    } else {
      episodeResult?.populationResults?.forEach((pr, i) => {
        groupPopResults[i].value += pr.result ? 1 : 0;
      });
    }
    return groupPopResults;
  }

  processRawResults(
    executionResults: ExecutionResult<DetailedPopulationGroupResult>[]
  ): TestCaseGroupStatementResult {
    const testCaseResultMap: TestCaseGroupStatementResult = {};
    if (executionResults) {
      for (const tc of executionResults) {
        const testCaseId: string = tc?.patientId;
        const groupResults: DetailedPopulationGroupResult[] =
          tc?.detailedResults || [];
        testCaseResultMap[testCaseId] = this.buildGroupResultsMap(groupResults);
      }
    }

    return testCaseResultMap;
  }
  //aaaaa

  buildGroupResultsMap(groupResults: DetailedPopulationGroupResult[]) {
    const outputGroupResultsMap: GroupStatementResultMap = {};
    for (const groupResult of groupResults) {
      const groupId = groupResult?.groupId;
      const statementResults = groupResult?.statementResults || [];
      const defineResultMap: StatementResultMap = {};
      for (const statementResult of statementResults) {
        if (statementResult && statementResult.statementName) {
          if (typeof statementResult.raw === "boolean") {
            defineResultMap[statementResult.statementName] =
              statementResult?.raw ? 1 : 0;
          } else if (Array.isArray(statementResult?.raw)) {
            defineResultMap[statementResult.statementName] =
              statementResult?.raw?.length || 0;
          } else {
            defineResultMap[statementResult.statementName] = 0;
          }
        }
      }
      outputGroupResultsMap[groupId] = defineResultMap;
    }
    return outputGroupResultsMap;
  }

  getPassingPercentageForTestCases(testCases: TestCase[]) {
    const totalTestCases = testCases?.length;
    const passedTests = testCases?.filter(
      (testCase) => testCase.executionStatus === "pass"
    ).length;

    return {
      passPercentage: Math.floor((passedTests / totalTestCases) * 100),
      passFailRatio: passedTests + "/" + totalTestCases,
    };
  }

  getCoveragePercentageForGroup(
    groupId: string,
    groupResults: DetailedPopulationGroupResult[]
  ) {
    if (groupId && !_.isEmpty(groupResults)) {
      const selectedGroups = groupResults?.filter(
        (groupResult) => groupResult.groupId === groupId
      );
      const allClauses = {};
      let passedClauses = 0;
      for (const groupResult of selectedGroups) {
        for (const clauseResult of groupResult.clauseResults) {
          if (!this.isClauseIgnored(clauseResult)) {
            const key = `${clauseResult.libraryName}_${clauseResult.localId}`;
            if (!allClauses[key]) {
              allClauses[key] = false;
            }
            allClauses[key] = allClauses[key] || this.isCovered(clauseResult);
          }
        }
      }
      // Count total number of clauses that evaluated to true
      for (const localId in allClauses)
        if (allClauses[localId]) {
          passedClauses += 1;
        }
      if (!_.isEmpty(allClauses)) {
        return Math.floor(
          (passedClauses * 100) / Object.keys(allClauses).length
        );
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  isCovered(clause) {
    return clause?.final === "TRUE";
  }

  // value sets should not be considered while calculating coverage
  // clauses with NA, should not be considered
  isClauseIgnored(clause) {
    if (clause.raw && clause.raw.name && clause.raw.name === "ValueSet")
      return true;
    return clause.final === "NA";
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

  findEpisodeObservationResult(
    episodeResults: EpisodeResults[],
    index: number,
    criteriaExpression: string,
    populationType: PopulationType | string
  ) {
    // TODO: when multiple IPs are supported by fqm-execution this logic may need to be refactored
    let observationCount = 0;
    for (const episodeResult of episodeResults) {
      // Get all observation populations that match our criteria expression (observation function)
      const observationPopulations = episodeResult.populationResults.filter(
        (popResult) =>
          popResult.populationType === FqmPopulationType.OBSERV &&
          popResult.criteriaExpression === criteriaExpression
      );
      /**
       * For Ratio single IP, if both observations use the same function, both results will be in the
       * first observation population's observation results.
       * Numerator observation only appears if Numer is true and Numex is false
       * For single IP, Numer is dependent on Denom and Denex.
       * Only count this episode if it has passing, matching observation
       * fqm-execution puts results into the first observation that matches criteria expression (which might be a bug?)
       */
      const observationPopulation = observationPopulations?.[0];
      if (observationPopulation && observationPopulation.result) {
        if (
          populationType === PopulationType.DENOMINATOR_OBSERVATION ||
          populationType === "denominatorObservation" ||
          populationType === "measurePopulationObservation"
        ) {
          if (index === observationCount) {
            return observationPopulation?.observations?.[0];
          }
          observationCount++;
        } else if (
          populationType === PopulationType.NUMERATOR_OBSERVATION ||
          populationType === "numeratorObservation"
        ) {
          const isNumer = !!episodeResult.populationResults.find(
            (pop) =>
              pop.populationType === FqmPopulationType.NUMER && pop.result
          );
          const isNumerEx = !!episodeResult.populationResults.find(
            (pop) =>
              pop.populationType === FqmPopulationType.NUMEX && pop.result
          );
          if (observationPopulations.length === 1) {
            // only one observation that matches, so return that result
            if (index === observationCount) {
              return observationPopulation?.observations?.[0];
            }
            observationCount++;
          } else if (
            isNumer &&
            !isNumerEx &&
            observationPopulation?.observations?.length > 1
          ) {
            // This logic is for Ratio, single IP, where NUMER is dependent on DENOM
            return observationPopulation?.observations?.[1];
          }
        }
      }
    }
    return null;
  }

  processTestCaseResults(
    testCase: TestCase,
    measureGroups: Group[],
    populationGroupResults: DetailedPopulationGroupResult[],
    testAllGroups = true
  ) {
    if (_.isNil(testCase) || _.isNil(testCase?.groupPopulations)) {
      return testCase;
    }

    const updatedTestCase = _.cloneDeep(testCase);
    const groupResultsMap = this.buildGroupResultsMap(populationGroupResults);
    const episodeResults: GroupPopulationEpisodeResultMap =
      this.processEpisodeResultsForGroups(populationGroupResults);

    for (const tcGroupPopulation of updatedTestCase?.groupPopulations) {
      const groupId = tcGroupPopulation.groupId;
      const measureGroup = measureGroups?.find((group) => group.id === groupId);
      const populationGroupResult: DetailedPopulationGroupResult =
        populationGroupResults?.find(
          (popGroupResult) => popGroupResult.groupId === groupId
        );
      const groupEpisodeResult: PopulationEpisodeResult[] =
        episodeResults[groupId];
      let groupPass = true;

      const tcPopTypeCount = {};
      const patientBased =
        "boolean" === _.lowerCase(tcGroupPopulation.populationBasis);

      tcGroupPopulation?.populationValues.forEach((tcPopVal, idx) => {
        // Set the actual population value for measure observations
        if (isTestCasePopulationObservation(tcPopVal)) {
          if (patientBased) {
            const obsResult = this.findPatientActualResult(
              populationGroupResult,
              PopulationType.MEASURE_OBSERVATION,
              tcPopTypeCount[PopulationType.MEASURE_OBSERVATION]
            );
            tcPopVal.actual = obsResult?.observations?.[0] ?? 0;

            if (tcPopTypeCount[PopulationType.MEASURE_OBSERVATION]) {
              tcPopTypeCount[PopulationType.MEASURE_OBSERVATION] =
                tcPopTypeCount[PopulationType.MEASURE_OBSERVATION] + 1;
            } else {
              tcPopTypeCount[PopulationType.MEASURE_OBSERVATION] = 1;
            }
          } else {
            const criteriaExpression = measureGroup?.measureObservations?.find(
              (mobs) => mobs.criteriaReference === tcPopVal.criteriaReference
            )?.definition;
            // Observation results are on each episode (resource) that matched
            // For CV there should be only one observation per episode
            // For Ratio there could be 0-2 (max of one denom and one numer)

            // Denom observ and CV observ will always be first observation on episode
            // If denom observ exists, numer observ is second. If no denom observ, numer is first (and only)
            let currentTCObserv = tcPopTypeCount[tcPopVal.name] ?? 0;
            tcPopVal.actual = this.findEpisodeObservationResult(
              populationGroupResult.episodeResults,
              currentTCObserv,
              criteriaExpression,
              tcPopVal.name
            );

            if (tcPopTypeCount[tcPopVal.name]) {
              tcPopTypeCount[tcPopVal.name] = tcPopTypeCount[tcPopVal.name] + 1;
            } else {
              tcPopTypeCount[tcPopVal.name] = 1;
            }
          }
        } else {
          // find result
          const measureGroupPopulation: Population =
            this.findMeasureGroupPopulation(measureGroup, tcPopVal);
          if (patientBased) {
            tcPopVal.actual = this.findPatientActualResult(
              populationGroupResult,
              tcPopVal.name as PopulationType,
              tcPopTypeCount[tcPopVal.name]
            )?.result;
          } else {
            tcPopVal.actual = this.findEpisodeActualValue(
              groupEpisodeResult,
              tcPopVal,
              measureGroupPopulation?.definition
            );
          }
          groupPass =
            groupPass &&
            this.isValuePass(tcPopVal.actual, tcPopVal.expected, patientBased);
          if (tcPopTypeCount[tcPopVal.name]) {
            tcPopTypeCount[tcPopVal.name] = tcPopTypeCount[tcPopVal.name] + 1;
          } else {
            tcPopTypeCount[tcPopVal.name] = 1;
          }
        }
      });

      tcGroupPopulation?.stratificationValues?.map((stratValue) => {
        const strataDefinition = measureGroup.stratifications.find(
          (stratification) => stratification.id === stratValue.id
        )?.cqlDefinition;
        const actualResult = patientBased
          ? groupResultsMap[groupId]?.[strataDefinition] > 0
          : groupResultsMap[groupId]?.[strataDefinition];

        return {
          ...stratValue,
          actual: actualResult,
        };
      });

      if (!testAllGroups) {
        // TODO: remove when supporting multiple groups on list page
        break;
      }
    }

    return updatedTestCase;
  }

  findMeasureGroupPopulation(
    measureGroup: Group,
    populationValue: PopulationExpectedValue
  ): Population {
    return measureGroup?.populations?.find(
      (population) =>
        (!_.isNil(populationValue.id) &&
          population.id === populationValue.id) ||
        (_.isNil(populationValue.id) &&
          populationValue.name === population.name)
    );
  }

  /**
   * Find the patient-based actual result first by population type, then by index
   * @param populationGroupResult
   * @param popTypeCount
   */
  findPatientActualResult(
    populationGroupResult: PopulationGroupResult,
    tcPopulationType: PopulationType,
    popTypeCount: number
  ) {
    let resultPopTypeCount = 0;
    const tcPopTypeCount = popTypeCount ?? 0;
    return populationGroupResult?.populationResults?.find((popResult) => {
      const resultPopCode: PopulationType =
        FHIR_POPULATION_CODES[popResult.populationType];
      if (resultPopCode === tcPopulationType) {
        if (resultPopTypeCount === tcPopTypeCount) {
          return true;
        }
        resultPopTypeCount++;
      }
    });
  }

  findEpisodeActualValue(
    populationEpisodeResults: PopulationEpisodeResult[],
    populationValue: PopulationExpectedValue,
    populationDefinition: string
  ): number {
    const groupEpisodeResult = populationEpisodeResults?.find(
      (popEpResult) =>
        FHIR_POPULATION_CODES[popEpResult.populationType] ===
          populationValue.name && populationDefinition === popEpResult.define
    );
    return _.isNil(groupEpisodeResult) ? 0 : groupEpisodeResult.value;
  }
}

export default function calculationService(): CalculationService {
  return new CalculationService();
}
