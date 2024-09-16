import { ServiceConfig } from "./ServiceContext";
import useServiceConfig from "./useServiceConfig";
import { useOktaTokens } from "@madie/madie-util";
import axios from "./axios-instance";

export class FhirDefinitionsServiceApi {
  constructor(private baseUrl: string, private getAccessToken: () => string) {}

  isComponentDataType(datatype) {
    switch (datatype) {
      case "boolean":
      case "date":
      case "dateTime":
      case "http://hl7.org/fhirpath/System.DateTime":
      case "decimal":
      case "id":
      case "instant":
      case "integer":
      case "integer64":
      case "positiveInt":
      case "time":
      case "unsignedInt":
      case "uri":
      case "url":
      case "uuid":
      case "string":
      case "http://hl7.org/fhirpath/System.String":
      case "code":
      case "Extension":
      case "Reference":
        return true;
      default:
        return false;
    }
  }

  async getResources() {
    try {
      const response = await axios.get<any>(`${this.baseUrl}/resources`, {
        headers: {},
      });
      return response.data;
    } catch (error) {
      console.error("Get Resources Error", error?.response);
      throw new Error(
        "An error occurred, please try again. If the error persists, please contact the help desk."
      );
    }
  }

  async getResourceTree(resourceName) {
    try {
      const response = await axios.get<any>(
        `${this.baseUrl}/structure-definitions/${resourceName}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `An error occurred while loading definition for resourceName [${resourceName}]: `,
        error
      );
    }
    return null;
  }

  getBasePath(resource: any): string {
    const elements = [...resource?.definition?.snapshot?.element];
    return elements?.[0].path;
  }

  getTopLevelElements(resource: any) {
    const elements = [...resource?.definition?.snapshot?.element];
    const basePath = this.getBasePath(resource);
    const nextElements = elements?.filter(
      (e) => e.path.split(".")?.length === 2
    );
    console.log("getRequiredElements.nextElements: ", nextElements);
    return nextElements;
  }

  getRequiredElements(resource: any) {
    const elements = [...resource?.definition?.snapshot?.element];
    const basePath = this.getBasePath(resource);
    const nextElements = elements?.filter(
      (e) => e.min > 0 && e.path.split(".")?.length === 2
    );
    console.log("getRequiredElements.nextElements: ", nextElements);
    return nextElements;
  }

  stripResourcePath(resourcePath, elementPath) {
    return elementPath.substring(`${resourcePath}.`.length);
  }
}

export default function useFhirDefinitionsServiceApi(): FhirDefinitionsServiceApi {
  const serviceConfig: ServiceConfig = useServiceConfig();
  const { getAccessToken } = useOktaTokens();
  const { baseUrl } = serviceConfig.fhirDefinitionsService;

  return new FhirDefinitionsServiceApi(baseUrl, getAccessToken);
}
