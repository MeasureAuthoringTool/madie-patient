import axios from "axios";
import useServiceConfig from "./useServiceConfig";
import { ServiceConfig } from "./ServiceContext";
import { getOidFromString, useOktaTokens } from "@madie/madie-util";
import { Bundle, Library, ValueSet } from "fhir/r4";
import { CqmMeasure, CQL } from "cqm-models";
import * as _ from "lodash";
import md5 from "blueimp-md5";

type ValueSetSearchParams = {
  oid: string;
  release?: string;
  version?: string;
};

type ValueSetsSearchCriteria = {
  profile: string;
  includeDraft: "yes" | "no";
  valueSetParams: ValueSetSearchParams[];
};

type CQLCodeWithCodeSystemOid = {
  cqlCode: CQL.CQLCode;
  codeSystemOid: string;
};

export class TerminologyServiceApi {
  constructor(private baseUrl: string, private getAccessToken: () => string) {}

  async getValueSetsExpansion(measureBundle: Bundle): Promise<ValueSet[]> {
    if (!measureBundle) {
      return null;
    }
    const searchCriteria = {
      includeDraft: "yes", // always yes for now
      valueSetParams: this.getValueSetsOIdsFromBundle(measureBundle),
    } as ValueSetsSearchCriteria;
    if (searchCriteria.valueSetParams.length == 0) {
      return [];
    }

    try {
      const response = await axios.put(
        `${this.baseUrl}/vsac/value-sets/searches`,
        searchCriteria,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      let message =
        "An error occurred, please try again. If the error persists, please contact the help desk. (003)";
      if (error.response && error.response.status === 404) {
        const data = error.response.data?.message;
        console.error(
          "ValueSet not found in vsac: ",
          this.getOidFromString(data)
        );
        message =
          "An error exists with the measure CQL, please review the CQL Editor tab.";
      }
      throw new Error(message);
    }
  }

  async getQdmValueSetsExpansion(cqmMeasure: CqmMeasure): Promise<ValueSet[]> {
    if (!cqmMeasure) {
      return null;
    }
    const searchCriteria = {
      includeDraft: "yes", // always yes for now
      valueSetParams: this.getValueSetsOIDsFromCqmMeasure(
        JSON.parse(JSON.stringify(cqmMeasure))
      ),
    } as ValueSetsSearchCriteria;

    if (_.isEmpty(searchCriteria.valueSetParams)) {
      return [];
    }

    try {
      const response = await axios.put(
        `${this.baseUrl}/vsac/qdm/value-sets/searches`,
        searchCriteria,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      let message =
        "An error occurred, please try again. If the error persists, please contact the help desk. (004)";
      if (error.response && error.response.status === 404) {
        const data = error.response.data?.message;
        console.error(
          "ValueSet not found in vsac: ",
          this.getOidFromString(data)
        );
        message =
          "An error exists with the measure CQL, please review the CQL Editor tab.";
      }
      throw new Error(message);
    }
  }

  getValueSetsOIDsFromCqmMeasure(
    cqmMeasure: CqmMeasure
  ): ValueSetSearchParams[] {
    const uniqueOids = new Set();
    cqmMeasure?.cql_libraries?.forEach((library) => {
      const valueSetDefs = library?.elm?.library?.valueSets?.def;
      if (!_.isEmpty(valueSetDefs)) {
        valueSetDefs.forEach((def) => {
          if (def?.id) {
            if (def.id.startsWith("urn:oid:")) {
              const oid = getOidFromString(def.id, "QDM");
              uniqueOids.add(oid);
            } else {
              uniqueOids.add(def?.id);
            }
          }
        });
      }
    });
    return _.map(Array.from(uniqueOids), (id: string) => ({
      ["oid"]: id,
    }));
  }

  /**
   * Extract the ValueSet OIDs used in Data requirements of library resources
   */
  getValueSetsOIdsFromBundle(measureBundle: Bundle): ValueSetSearchParams[] {
    if (measureBundle?.entry) {
      return measureBundle.entry
        .filter((entry) => entry.resource?.resourceType === "Library")
        .reduce((allVs, library) => {
          const libraryResource = library.resource as Library;
          // TODO: this should be taken from dataRequirements. Using relatedArtifacts temporarily
          // TODO: release and version not supported
          const libVs = libraryResource.relatedArtifact?.reduce(
            (libVs, artifact) => {
              if (
                artifact?.resource &&
                artifact.resource.includes("/ValueSet/")
              ) {
                const oid = this.getOidFromString(artifact.resource);
                if (oid) {
                  libVs.push({ oid: oid });
                }
              }
              return libVs;
            },
            [] as ValueSetSearchParams[]
          );
          if (libVs) {
            return allVs.concat(libVs);
          } else {
            return allVs;
          }
        }, [] as ValueSetSearchParams[]);
    }
    return [];
  }

  getOidFromString(oidString: string): string {
    const oidRegex = /[0-2](\.(0|[1-9][0-9]*))+/;
    const match = oidString?.match(oidRegex);
    if (match) {
      return match[0];
    }
    return null;
  }

  getValueSetsForDRCs(cqmMeasure: CqmMeasure): ValueSet[] {
    const drcValueSets = [];
    const cqlCodeWithCodeSystemOid: CQLCodeWithCodeSystemOid[] =
      this.getCqlCodesForDRCs(cqmMeasure);
    if (cqlCodeWithCodeSystemOid) {
      cqlCodeWithCodeSystemOid.forEach(({ cqlCode, codeSystemOid }) => {
        const drcOid = this.getDrcOid(cqmMeasure, cqlCode.code);
        const valueSet = {
          oid:
            drcOid ??
            `drc-${md5(cqlCode.system + cqlCode.code + cqlCode.version)}`,
          version: cqlCode.version,
          concepts: [
            {
              code: cqlCode.code,
              code_system_oid: codeSystemOid,
              code_system_name: cqlCode.system,
              code_system_version: cqlCode.version,
              display_name: cqlCode.display,
            },
          ],
          display_name: cqlCode.display,
        };
        drcValueSets.push(valueSet);
      });
    }
    return drcValueSets;
  }

  getCqlCodesForDRCs(cqmMeasure: CqmMeasure): CQLCodeWithCodeSystemOid[] {
    const cqlCodeWithCodeSystemOid: CQLCodeWithCodeSystemOid[] = [];
    cqmMeasure?.cql_libraries?.forEach((library) => {
      const codeDefs = library?.elm?.library?.codes?.def;
      const codeSystemDefs = library?.elm?.library?.codeSystems?.def;
      if (!_.isEmpty(codeDefs)) {
        codeDefs.forEach((def) => {
          // find associated CodeSystem for this code, so that we can get codeSystem oid
          const codeSystem = codeSystemDefs.find(
            (cs) => cs.name === def.codeSystem.name
          );
          const cqlCode = new CQL.Code(
            def?.id, //code
            def.codeSystem.name, //system
            "N/A", //version,
            def.display //display
          );
          cqlCodeWithCodeSystemOid.push({
            cqlCode: cqlCode,
            codeSystemOid: codeSystem.id,
          });
        });
      }
    });
    return cqlCodeWithCodeSystemOid;
  }

  getDrcOid(cqmMeasure: CqmMeasure, code: string): string {
    const find = cqmMeasure?.source_data_criteria?.find(
      (source) => source.codeId === code
    );
    return find?.desc;
  }
}

export default function useTerminologyServiceApi(): TerminologyServiceApi {
  const serviceConfig: ServiceConfig = useServiceConfig();
  const { getAccessToken } = useOktaTokens();
  return new TerminologyServiceApi(
    serviceConfig.terminologyService?.baseUrl,
    getAccessToken
  );
}
