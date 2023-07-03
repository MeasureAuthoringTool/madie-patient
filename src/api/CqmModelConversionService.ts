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
} from "cqm-models";
import { ServiceConfig } from "./ServiceContext";
import useServiceConfig from "./useServiceConfig";
import { useOktaTokens } from "@madie/madie-util";
import axios from "axios";
import { CalculationMethod } from "./models/CalculationMethod";
import { DataCriteria } from "./models/DataCriteria";
import _ from "lodash";
import { CqmModelFactory } from "./model-factory/CqmModelFactory";
import { parse } from "./ElmParser";
import { ElmDependencyFinder } from "./elmDependencyFinder/ElmDependencyFinder";
import { v4 as uuidv4 } from "uuid";

interface StatementReference {
  library_name: String;
  statement_name: String;
  hqmf_id?: String;
}

export class CqmConversionService {
  constructor(private baseUrl: string, private getAccessToken: () => string) {}

  elmDependencyFinder = new ElmDependencyFinder();

  async fetchElmForCql(cql: string): Promise<Array<string>> {
    try {
      const response = await axios.put(`${this.baseUrl}/cql/elm`, cql, {
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

  async fetchSourceDataCriteria(cql: string): Promise<Array<DataElement>> {
    try {
      const response = await axios.put(
        `${this.baseUrl}/cql/source-data-criteria`,
        cql,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
            "Content-Type": "text/plain",
          },
        }
      );
      return response.data.map((dc) => this.buildSourceDataCriteria(dc));
    } catch (error) {
      throw new Error(
        error.message || "An Error occurred while fetching source data criteria"
      );
    }
  }

  async convertToCqmMeasure(measure: Measure) {
    if (_.isNil(measure) || _.isNil(measure.cql)) {
      return null;
    }
    const cqmMeasure = new CqmMeasure();
    cqmMeasure.title = measure.measureName;
    cqmMeasure.description = measure.measureMetaData?.description;
    cqmMeasure.cms_id = measure.cmsId;
    cqmMeasure.main_cql_library = measure.cqlLibraryName;
    cqmMeasure.measure_scoring = measure.scoring;
    cqmMeasure.hqmf_set_id = measure.measureSetId;
    cqmMeasure.calculation_method = cqmMeasure.patientBasis
      ? CalculationMethod.PATIENT
      : CalculationMethod.EPISODE_OF_CARE;
    cqmMeasure.composite = false; // for now
    cqmMeasure.component = false; // for now
    cqmMeasure.id = measure.id;
    cqmMeasure.source_data_criteria = await this.fetchSourceDataCriteria(
      measure.cql
    );
    const elms = await this.fetchElmForCql(measure.cql);
    // Fetch statement dependencies
    const statementDependenciesMap =
      await this.elmDependencyFinder.findDependencies(
        elms,
        measure.cqlLibraryName
      );

    cqmMeasure.cql_libraries = elms.map((elm) =>
      this.buildCQLLibrary(
        elm,
        measure.cqlLibraryName,
        statementDependenciesMap
      )
    );

    // TODO: need UI checkbox to determine yes/no
    cqmMeasure.calculate_sdes = false;
    const populationSets: PopulationSet[] =
      this.creatingPopulationSets(measure);
    cqmMeasure.population_sets = populationSets;
    return cqmMeasure;
  }

  private creatingPopulationSets = (measure: Measure) => {
    const measureScoring = measure.scoring.replace(/ +/g, "");
    if (_.isEmpty(measure?.groups)) {
      return null;
    }
    const populationSets: PopulationSet[] = measure.groups.map((group, i) => ({
      id: group.id,
      title: "Population Criteria Section",
      population_set_id: `PopulationSet_${i + 1}`,
      populations: this.generateKeyValuePairPopulations(
        group.populations,
        measure.cqlLibraryName
      ),
      stratifications: this.generateStratifications(
        group.stratifications,
        measure.cqlLibraryName,
        i
      ),
      supplemental_data_elements: this.generateSupplementalDataElements(
        measure.supplementalData,
        measure.cqlLibraryName
      ),
      ...(measureScoring === "ContinuousVariable" || measureScoring === "Ratio"
        ? {
            observations: this.generateObservations(
              group.measureObservations,
              measure.cqlLibraryName,
              group.populations
            ),
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

  private generateKeyValuePairPopulations = (
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

  private generateObservations = (
    observations: MeasureObservation[],
    cqlLibraryName: string,
    populations: Population[]
  ) => {
    return observations.map((observation, i) => ({
      id: observation.id,
      hqmf_id: null,
      aggregation_type: observation.aggregateMethod,
      observation_function: {
        id: uuidv4(),
        library_name: cqlLibraryName,
        statement_name: observation.definition,
        hqmf_id: null,
      },
      observation_parameter: {
        id: uuidv4(),
        library_name: cqlLibraryName,
        statement_name: this.getObservationAssocationName(
          observation.criteriaReference,
          populations
        ),
        hqmf_id: null,
      },
    }));
  };

  private getObservationAssocationName = (
    criteriaReference: string,
    populations: Population[]
  ) => {
    populations.filter((population) => population.id === criteriaReference)[0]
      ?.name;
    return "Measure Population";
  };

  private generateSupplementalDataElements = (
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

  private generateStratifications = (
    stratifications: Stratification[],
    cqlLibraryName: string,
    groupIndex: number
  ) => {
    return stratifications.map((stratification, i) => ({
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
    const cqlLibrary = new CQLLibrary();
    cqlLibrary.library_name = elmJson.library?.identifier.id;
    cqlLibrary.library_version = elmJson.library?.identifier.version;
    cqlLibrary.is_main_library = measureLibraryName === cqlLibrary.library_name;
    cqlLibrary.elm = elmJson;
    // true for all non-composite measures
    cqlLibrary.is_top_level = true;

    cqlLibrary.elm_annotations = parse(cqlLibrary.elm);
    // TODO: prepare statement_dependencies- MAT-5786
    cqlLibrary.statement_dependencies = this.generateCqlStatementDependencies(
      statementDependenciesMap[elmJson.library?.identifier.id]
    );
    return cqlLibrary;
  }

  private generateCqlStatementDependencies(
    statementDependencies: any
  ): StatementDependency[] {
    return _.map(
      statementDependencies,
      (statementDep) =>
        new StatementDependency({
          statement_name: statementDep.name,
          statement_references: statementDep.refs as StatementReference[],
        })
    );
  }

  private buildSourceDataCriteria(
    dataCriteria: DataCriteria
  ): Array<DataElement> {
    let sourceDataCriteria = CqmModelFactory.instantiateModel(
      dataCriteria.type
    );
    sourceDataCriteria.desc = dataCriteria.oid;
    sourceDataCriteria.codeListId = dataCriteria.oid;
    sourceDataCriteria.description = dataCriteria.description;
    return sourceDataCriteria;
  }
}

export default function useCqmConversionService(): CqmConversionService {
  const serviceConfig: ServiceConfig = useServiceConfig();
  const { getAccessToken } = useOktaTokens();
  return new CqmConversionService(
    serviceConfig.elmTranslationService?.baseUrl,
    getAccessToken
  );
}
