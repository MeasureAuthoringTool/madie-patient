import { ServiceConfig } from "./ServiceContext";
import useServiceConfig from "./useServiceConfig";
import { useOktaTokens } from "@madie/madie-util";
import axios from "./axios-instance";
import { ResourceIdentifier } from "./models/ResourceIdentifier";
import { StructureDefinitionDto } from "./models/StructureDefinitionDto";

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

  async getResources(): Promise<ResourceIdentifier[]> {
    try {
      const response = await axios.get<any>(
        `${this.baseUrl}/qicore/resources`,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Get Resources Error", error?.response);
      throw new Error(
        "An error occurred, please try again. If the error persists, please contact the help desk."
      );
    }
  }

  async getResourceTree(resourceId): Promise<StructureDefinitionDto> {
    try {
      const response = await axios.get<any>(
        `${this.baseUrl}/qicore/resources/structure-definitions/${resourceId}`,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `An error occurred while loading definition for resourceId [${resourceId}]: `,
        error
      );
    }
    return null;
  }

  async getFhirValueSetExpansion(valueSetId: string): Promise<any> {
    try {
      const response = await axios.get<any>(
        `https://tx.fhir.org/r4/ValueSet/${valueSetId}/$expand`,
        {
          headers: {
            Accept: "application/fhir+json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `An error occurred while loading definition for resourceName [${valueSetId}]: `,
        error
      );
    }
    return null;
  }

  getBasePath(resource: any): string {
    // const elements = [...resource?.definition?.snapshot?.element];
    // return elements?.[0].path;
    return resource?.definition?.snapshot?.element?.[0]?.path;
  }

  getTopLevelElements(resource: any) {
    const elements = [...resource?.definition?.snapshot?.element];
    const basePath = this.getBasePath(resource);
    return elements?.filter((e) => e.path.split(".")?.length === 2);
  }

  getRequiredElements(resource: any) {
    const elements = [...resource?.definition?.snapshot?.element];
    const basePath = this.getBasePath(resource);
    return elements?.filter(
      (e) => e.min > 0 && e.path.split(".")?.length === 2
    );
  }

  stripResourcePath(resourcePath, elementPath) {
    return elementPath.substring(`${resourcePath}.`.length);
  }
}

export default function useFhirDefinitionsServiceApi(): FhirDefinitionsServiceApi {
  const serviceConfig: ServiceConfig = useServiceConfig();
  const { getAccessToken } = useOktaTokens();
  const { baseUrl } = serviceConfig.fhirService;

  return new FhirDefinitionsServiceApi(baseUrl, getAccessToken);
}
