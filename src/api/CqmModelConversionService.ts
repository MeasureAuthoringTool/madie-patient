import { Measure } from "@madie/madie-models";
import { Measure as CqmMeasure, CQLLibrary, DataElement } from "cqm-models";
import { ServiceConfig } from "./ServiceContext";
import useServiceConfig from "./useServiceConfig";
import { useOktaTokens } from "@madie/madie-util";
import axios from "axios";
import { CalculationMethod } from "./models/CalculationMethod";
import { DataCriteria } from "./models/DataCriteria";
import _ from "lodash";
import { CqmModelFactory } from "./model-factory/CqmModelFactory";

export class CqmConversionService {
  constructor(private baseUrl: string, private getAccessToken: () => string) {}

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
    cqmMeasure.source_data_criteria = dataCriteria.map((dc) =>
      this.buildSourceDataCriteria(dc)
    );
    const elms = await this.fetchElmForCql(measure.cql);
    cqmMeasure.cql_libraries = elms.map((elm) =>
      this.buildCQLLibrary(elm, measure.cqlLibraryName)
    );

    // TODO: need UI checkbox to determine yes/no
    cqmMeasure.calculate_sdes = false;
    // TODO: build population_sets- MAT-5779
    cqmMeasure.population_sets = null;
    return cqmMeasure;
  }

  private buildCQLLibrary(elm: string, measureLibraryName: string): CQLLibrary {
    const elmJson = JSON.parse(elm);
    const cqlLibrary = new CQLLibrary();
    cqlLibrary.library_name = elmJson.library?.identifier.id;
    cqlLibrary.library_version = elmJson.library?.identifier.version;
    cqlLibrary.is_main_library = measureLibraryName === cqlLibrary.library_name;
    cqlLibrary.elm = elmJson;
    // true for all non-composite measures
    cqlLibrary.is_top_level = true;
    // TODO: prepare elm_annotations- MAT-5787
    cqlLibrary.elm_annotations = null;
    // TODO: prepare statement_dependencies- MAT-5786
    cqlLibrary.statement_dependencies = null;
    return cqlLibrary;
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
