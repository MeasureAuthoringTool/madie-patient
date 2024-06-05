import axios from "axios";
import { CqlDefinitionCallstack } from "../../components/editTestCase/groupCoverage/QiCoreGroupCoverage";
import { CqlDefinitionExpression } from "../../util/GroupCoverageHelpers";
import { ServiceConfig } from "../ServiceContext";
import useServiceConfig from "../useServiceConfig";
import { useOktaTokens } from "@madie/madie-util";

export class QdmCqlParsingService {
  constructor(private baseUrl: string, private getAccessToken: () => string) {}

  async getDefinitionCallstacks(cql: string): Promise<CqlDefinitionCallstack> {
    try {
      const response = await axios.put<string>(
        `${this.baseUrl}/qdm/cql/callstacks`,
        cql,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
            "Content-Type": "text/plain",
          },
        }
      );
      return response.data as unknown as CqlDefinitionCallstack;
    } catch (err) {
      const message = `Unable to retrieve used definition references`;
      throw new Error(message);
    }
  }

  async getAllDefinitionsAndFunctions(
    cql: string
  ): Promise<CqlDefinitionExpression[]> {
    try {
      const response = await axios.put<string>(
        `${this.baseUrl}/qdm/cql/definitions`,
        cql,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
            "Content-Type": "text/plain",
          },
        }
      );
      return response.data as unknown as CqlDefinitionExpression[];
    } catch (err) {
      const message = `Unable to retrieve definition and function references`;
      throw new Error(message);
    }
  }
}

const useQdmCqlParsingService = (): QdmCqlParsingService => {
  const serviceConfig: ServiceConfig = useServiceConfig();
  const { getAccessToken } = useOktaTokens();
  return new QdmCqlParsingService(
    serviceConfig?.qdmElmTranslationService.baseUrl,
    getAccessToken
  );
};

export default useQdmCqlParsingService;
