import {
  Measure,
  Population,
  PopulationType,
  MeasureObservation,
  SupplementalData,
  Stratification,
} from "@madie/madie-models";
import {
  Measure as CqmMeasure,
  CQLLibrary,
  DataElement,
  StatementDependency,
  PopulationSet,
  MeasurePeriod,
  ValueSet,
  CodeSystem,
} from "cqm-models";
import { ServiceConfig } from "./ServiceContext";
import useServiceConfig from "./useServiceConfig";
import useMeasureServiceApi from "../api/useMeasureServiceApi";

import { useOktaTokens } from "@madie/madie-util";
import axios from "axios";
import { CalculationMethod } from "./models/CalculationMethod";
import { DataCriteria } from "./models/DataCriteria";
import _ from "lodash";
import { CqmModelFactory } from "./model-factory/CqmModelFactory";
import { ElmDependencyFinder } from "./elmDependencyFinder/ElmDependencyFinder";
import { v4 as uuidv4 } from "uuid";
import { TranslatedLibrary } from "./models/TranslatedLibrary";

export class CqmConversionService {
  constructor(private baseUrl: string, private getAccessToken: () => string) {}
  //disablign eslint check because React doensn't want me to use the prefix "use" except if I'm using it for a hook
  // eslint-disable-next-line
  measureService = useMeasureServiceApi();
  elmDependencyFinder = new ElmDependencyFinder();

  // get the translated artifacts for CQL including the included libraries.
  // returns the array of TranslatedLibrary{name, version, cql, elmJson, elmXml}
  async fetchTranslationForCql(cql: string): Promise<Array<TranslatedLibrary>> {
    try {
      const response = await axios.put(`${this.baseUrl}/qdm/cql/elm`, cql, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
          "Content-Type": "text/plain",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "An Error occurred while fetching elm");
    }
  }

  async fetchRelevantDataElements(
    measure: Measure
  ): Promise<Array<DataElement>> {
    try {
      const response = await axios.put(
        `${this.baseUrl}/qdm/cql/relevant-elements`,
        measure,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      const results: Array<DataElement> = response.data.map((dc) =>
        this.buildSourceDataCriteria(dc)
      );

      return results;
    } catch (error) {
      throw new Error(
        error.message ||
          "An Error occurred while fetching relevant data elements"
      );
    }
  }

  async convertToCqmMeasure(measure: Measure): Promise<CqmMeasure> {
    if (_.isNil(measure) || _.isNil(measure.cql)) {
      return null;
    }
    //instead of converting the measure, let's get it from the measure-service

    const cqmMeasure: CqmMeasure = await this.measureService.getCqmMeasure(
      measure.id
    );

    return cqmMeasure;
  }

  private measurePeriodData(startDate: string, endDate: string): MeasurePeriod {
    return {
      low: {
        value: startDate,
      },
      high: {
        value: endDate,
      },
    };
  }

  private convertDateToCustomFormat(measurementPeriodDate: Date) {
    const dateObj = new Date(measurementPeriodDate);
    const year = dateObj.getUTCFullYear().toString();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const hours = String(dateObj.getUTCHours()).padStart(2, "0");
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
    return `${year}${month}${day}${hours}${minutes}`;
  }

  private buildCqmPopulationSets = (measure: Measure) => {
    if (_.isEmpty(measure?.groups)) {
      return null;
    }
    const measureScoring = measure.scoring.replace(/ +/g, "");
    const populationSets: PopulationSet[] = measure.groups.map((group, i) => ({
      id: group.id,
      title: "Population Criteria Section",
      population_set_id: group.id,
      populations: this.generateCqmPopulations(
        group.populations,
        measure.cqlLibraryName
      ),
      stratifications: this.generateCqmStratifications(
        group.stratifications,
        measure.cqlLibraryName,
        i
      ),
      supplemental_data_elements: this.generateCqmSupplementalDataElements(
        measure.supplementalData,
        measure.cqlLibraryName
      ),
      ...(measureScoring === "ContinuousVariable" || measureScoring === "Ratio"
        ? {
            observations: this.generateCqmObservations(measure),
          }
        : {}),
    }));

    return populationSets;
  };

  private mapPopulationName = (populationName: string) => {
    if (populationName === PopulationType.INITIAL_POPULATION) return "IPP";
    if (populationName === PopulationType.DENOMINATOR) return "DENOM";
    if (populationName === PopulationType.DENOMINATOR_EXCLUSION) return "DENEX";
    if (populationName === PopulationType.DENOMINATOR_EXCEPTION)
      return "DENEXCEP";
    if (populationName === PopulationType.NUMERATOR) return "NUMER";
    if (populationName === PopulationType.NUMERATOR_EXCLUSION) return "NUMEX";
    if (populationName === PopulationType.MEASURE_POPULATION) return "MSRPOPL";
    if (populationName === PopulationType.MEASURE_POPULATION_EXCLUSION)
      return "MSRPOPLEX";
    else return populationName;
  };

  private generateCqmPopulations = (
    populations: Population[],
    cqlLibraryName: string
  ) => {
    return populations.reduce((acc, population) => {
      const key = this.mapPopulationName(population.name);
      acc[key] = {
        id: population.id,
        library_name: cqlLibraryName,
        statement_name: population.definition,
        hqmf_id: null,
      };
      return acc;
    }, {});
  };

  // Combining all observations from multiple groups. Cqm-Execution likes it this way.
  private generateCqmObservations = (measure: Measure) => {
    const cqmObservations = [];
    measure.groups?.forEach((group) => {
      group.measureObservations?.forEach((observation, i) =>
        cqmObservations.push({
          id: observation.id,
          hqmf_id: null,
          aggregation_type: observation.aggregateMethod,
          observation_function: {
            id: uuidv4(),
            library_name: measure.cqlLibraryName,
            statement_name: observation.definition,
            hqmf_id: null,
          },
          observation_parameter: {
            id: uuidv4(),
            library_name: measure.cqlLibraryName,
            statement_name: this.getAssociatedPopulationDefinition(
              observation.criteriaReference,
              group.populations
            ),
            hqmf_id: null,
          },
        })
      );
    });
    return cqmObservations;
  };

  private getAssociatedPopulationDefinition = (
    criteriaReference: string,
    populations: Population[]
  ) => {
    return populations.filter(
      (population) => population.id === criteriaReference
    )[0]?.definition;
  };

  private generateCqmSupplementalDataElements = (
    supplementalDataElements: SupplementalData[],
    cqlLibraryName: string
  ) => {
    return supplementalDataElements.map((supplementalDataElement) => ({
      id: uuidv4(), //no id is present in the madie so generating a new id
      library_name: cqlLibraryName,
      statement_name: supplementalDataElement.definition,
      hqmf_id: null,
    }));
  };

  private generateCqmStratifications = (
    stratifications: Stratification[],
    cqlLibraryName: string,
    groupIndex: number
  ) => {
    return stratifications?.map((stratification, i) => ({
      id: uuidv4(),
      hqmf_id: null,
      stratification_id: `PopulationSet_${groupIndex + 1}_Stratification_${
        i + 1
      }`,
      title: `PopSet${groupIndex + 1} Stratification ${i + 1}`,
      statement: {
        id: stratification.id,
        library_name: cqlLibraryName,
        statement_name: stratification.cqlDefinition,
        hqmf_id: null,
      },
    }));
  };

  private buildCQLLibrary(
    elm: string,
    measureLibraryName: string,
    statementDependenciesMap: any
  ): CQLLibrary {
    const elmJson = JSON.parse(elm);
    elmJson.library?.valueSets?.def.forEach((valueSet: ValueSet) => {
      valueSet.id = valueSet.id.replace("urn:oid:", "");
    });
    elmJson.library?.codeSystems?.def.forEach((codeSystem: CodeSystem) => {
      codeSystem.id = codeSystem.id.replace("urn:oid:", "");
    });
    const cqlLibrary = new CQLLibrary();
    cqlLibrary.library_name = elmJson.library?.identifier.id;
    cqlLibrary.library_version = elmJson.library?.identifier.version;
    cqlLibrary.is_main_library = measureLibraryName === cqlLibrary.library_name;
    cqlLibrary.elm = elmJson;
    // true for all non-composite measures
    cqlLibrary.is_top_level = true;

    cqlLibrary.statement_dependencies = this.generateCqlStatementDependencies(
      statementDependenciesMap[elmJson.library?.identifier.id]
    );
    return cqlLibrary;
  }

  private generateCqlStatementDependencies(statementDependencies: any) {
    return Object.entries(statementDependencies).map(([k, v]) => {
      return new StatementDependency({
        statement_name: k,
        statement_references: v,
      });
    });
  }

  private buildSourceDataCriteria(
    dataCriteria: DataCriteria
  ): Array<DataElement> {
    let sourceDataCriteria = CqmModelFactory.instantiateModel(
      dataCriteria.type
    );
    if (dataCriteria.drc) {
      sourceDataCriteria.codeId = dataCriteria.codeId;
    }
    sourceDataCriteria.codeListId = dataCriteria.oid;
    sourceDataCriteria.desc = dataCriteria.oid;
    sourceDataCriteria.description = dataCriteria.description;
    return sourceDataCriteria;
  }
}

export default function useCqmConversionService(): CqmConversionService {
  const serviceConfig: ServiceConfig = useServiceConfig();
  const { getAccessToken } = useOktaTokens();
  return new CqmConversionService(
    serviceConfig.qdmElmTranslationService?.baseUrl,
    getAccessToken
  );
}
