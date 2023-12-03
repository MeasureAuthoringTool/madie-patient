import axios from "axios";
import useServiceConfig from "./useServiceConfig";
import { ServiceConfig } from "./ServiceContext";
import { useOktaTokens } from "@madie/madie-util";
import { CqlDefinitionExpression } from "../util/GroupCoverageHelpers";

export class CqlParsingService {
  constructor(private baseUrl: string, private getAccessToken: () => string) {}

  async getAllDefinitionsAndFunctions(
    cql: string
  ): Promise<CqlDefinitionExpression[]> {
    try {
      const response = await axios.put<string>(
        `${this.baseUrl}/cql/definitions`,
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

const useCqlParsingService = () => {
  const serviceConfig: ServiceConfig = useServiceConfig();
  const { getAccessToken } = useOktaTokens();
  return new CqlParsingService(
    serviceConfig?.elmTranslationService.baseUrl,
    getAccessToken
  );
};

export default useCqlParsingService;
