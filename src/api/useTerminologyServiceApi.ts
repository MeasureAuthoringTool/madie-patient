import axios from "axios";
import useServiceConfig from "./useServiceConfig";
import { ServiceConfig } from "./ServiceContext";
import { useOktaTokens, getOidFromString } from "@madie/madie-util";
import { Bundle, ValueSet, Library } from "fhir/r4";
import { CqmMeasure } from "cqm-models";
import * as _ from "lodash";

type ValueSetSearchParams = {
  oid: string;
  release?: string;
  version?: string;
};

type ValueSetsSearchCriteria = {
  profile: string;
  tgt: string;
  includeDraft: boolean;
  valueSetParams: ValueSetSearchParams[];
};

export class TerminologyServiceApi {
  constructor(private baseUrl: string, private getAccessToken: () => string) {}

  async getValueSetsExpansion(measureBundle: Bundle): Promise<ValueSet[]> {
    if (!measureBundle) {
      return null;
    }
    const searchCriteria = {
      includeDraft: true, // always true for now
      tgt: this.getTicketGrantingTicket(),
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
        "An error occurred, please try again. If the error persists, please contact the help desk.";
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
      includeDraft: true, // always true for now
      tgt: this.getTicketGrantingTicket(),
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
        "An error occurred, please try again. If the error persists, please contact the help desk.";
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
    if (cqmMeasure?.cql_libraries) {
      return cqmMeasure.cql_libraries
        .filter((lib) => "valueSets" in lib?.elm?.library)
        .map((cqlLibrary) => {
          if (_.isEmpty(cqlLibrary.elm.library.valueSets)) {
            return [];
          }
          return cqlLibrary.elm.library.valueSets.def.map((valueSetDef) => {
            if (valueSetDef?.id) {
              if (valueSetDef.id.startsWith("urn:oid:")) {
                const oid = getOidFromString(valueSetDef.id, "QDM");
                return { ["oid"]: oid };
              }
              return { ["oid"]: valueSetDef?.id };
            }
          });
        })[0];
    }
    return [];
  }

  /**
   * Extract the ValueSet OIDs used in Data requirements of library resources
   */
  getValueSetsOIdsFromBundle(measureBundle: Bundle): ValueSetSearchParams[] {
    if (measureBundle?.entry) {
      const valueSetOIDs = measureBundle.entry
        .filter((entry) => entry.resource?.resourceType === "Library")
        .reduce((allVs, library) => {
          const libraryResource = library.resource as Library;
          // TODO: this should be taken from dataRequirements. Using relatedArtifacts temporarily
          // TODO: release and version not supported
          const libVs = libraryResource.relatedArtifact?.reduce(
            (libVs, artifact) => {
              if (artifact?.url && artifact.url.includes("/ValueSet/")) {
                const oid = this.getOidFromString(artifact?.url);
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
      return valueSetOIDs;
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

  getTicketGrantingTicket(): string {
    const tgtItem = localStorage.getItem("TGT");
    if (!tgtItem) {
      return null;
    }
    return JSON.parse(tgtItem).TGT;
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
