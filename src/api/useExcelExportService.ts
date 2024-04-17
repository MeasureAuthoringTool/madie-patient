import axios, { AxiosResponse } from "axios";
import useServiceConfig from "./useServiceConfig";
import { ServiceConfig } from "./ServiceContext";
import { TestCaseExcelExportDto } from "@madie/madie-models";
import { useOktaTokens } from "@madie/madie-util";

export class ExcelExportService {
  constructor(private baseUrl: string, private getAccessToken: () => string) {}

  generateExcel(
    testCaseDtos: TestCaseExcelExportDto[]
  ): Promise<AxiosResponse> {
    //creaet a JSON that look slike {"testCaseDtos:testCaseDtos}
    const body = { testCaseExcelExportDtos: testCaseDtos };
    return axios.put(`${this.baseUrl}/api/excel`, body, {
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`,
        "Accept-Encoding": "application/vnd.ms-excel",
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      responseType: "blob",
    });
  }
}

export default function useExcelExportService(): ExcelExportService {
  const serviceConfig: ServiceConfig = useServiceConfig();
  const { getAccessToken } = useOktaTokens();
  const { baseUrl } = serviceConfig.excelExportService;

  return new ExcelExportService(baseUrl, getAccessToken);
}
