import { Measure, Population, PopulationType } from "@madie/madie-models";
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
    const dataCriteria = await this.fetchSourceDataCriteria(measure.cql);
    cqmMeasure.source_data_criteria = dataCriteria;
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

    //console.log("Actual Measure Groups", measure.groups);

    // TODO: need UI checkbox to determine yes/no
    cqmMeasure.calculate_sdes = false;
    // TODO: build population_sets- MAT-5779
    const populationSets: PopulationSet[] =
      this.creatingPopulationSets(measure);
    // console.log(populationriteria)
    cqmMeasure.population_sets = populationSets;
    //console.log(cqmMeasure);
    return cqmMeasure;
  }

  private creatingPopulationSets = (measure: Measure) => {
    const measureScoring = measure.scoring.replace(/ +/g, "");
    const populationSets: PopulationSet[] = measure.groups.map((group, i) => ({
      title: "Population Criteria Section",
      population_set_id: `PopulationSet_${i + 1}`,
      populations: this.generatingKeyValuePairsForPopulations(
        group.populations,
        measure.cqlLibraryName,
        measureScoring
      ),
      stratifications: group.stratifications,
      supplemental_data_elements: null,
      ...(measureScoring === "ContinuousVariable" || measureScoring === "Ratio"
        ? { observations: group.measureObservations }
        : {}),
    }));

    // console.log("generated Population Sets", populationSets);
    return populationSets;
  };

  private generatingKeyValuePairsForPopulations = (
    populations: Population[],
    cqlLibraryName: string,
    scoring: string
  ) => {
    return populations.reduce(
      (acc, population) => {
        const key = this.mapPopulationName(population.name);
        acc[key] = {
          library_name: cqlLibraryName,
          statement_name: population.definition,
          hqmf_id: null,
        };
        return acc;
      },
      { _type: `CQM::${scoring}PopulationMap` }
    ); //need to ask
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
    else return populationName;
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
