import axios from "axios";
import useServiceConfig from "./useServiceConfig";
import { ServiceConfig } from "./ServiceContext";
import { useOktaTokens } from "@madie/madie-util";
import { CqlDefinitionCallstack } from "../components/editTestCase/groupCoverage/QiCoreGroupCoverage";

export class CqlParsingService {
  constructor(private baseUrl: string, private getAccessToken: () => string) {}

  async getDefinitionCallstacks(cql: string): Promise<CqlDefinitionCallstack> {
    try {
      const response = await axios.put<string>(
        `${this.baseUrl}/cql/callstacks`,
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
}

const useCqlParsingService = (): CqlParsingService => {
  const serviceConfig: ServiceConfig = useServiceConfig();
  const { getAccessToken } = useOktaTokens();
  return new CqlParsingService(
    serviceConfig?.elmTranslationService.baseUrl,
    getAccessToken
  );
};

export default useCqlParsingService;
