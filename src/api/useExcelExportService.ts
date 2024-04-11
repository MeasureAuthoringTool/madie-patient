import React from "react";
import axios from "axios";
import useServiceConfig from "./useServiceConfig";
import { ServiceConfig } from "./ServiceContext";
import { TestCaseExcelExportDto } from "@madie/madie-models";
import { useOktaTokens } from "@madie/madie-util";

export class ExcelExportService {
  constructor(private baseUrl: string, private getAccessToken: () => string) {}

  async generateExcel(testCaseDtos: TestCaseExcelExportDto[]): Promise<Blob> {
    //creaet a JSON that look slike {"testCaseDtos:testCaseDtos}
    const body = { testCaseExcelExportDtos: testCaseDtos };

    const response = await axios.put(`${this.baseUrl}/excel`, body, {
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`,
        //Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.kcPmFlSUdC9LvuMufomQepInu3GwbBKKct49e2dxyrI`,
        "Accept-Encoding": "application/vnd.ms-excel",
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      responseType: "blob",
    });

    return response.data;
  }
}

export default function useExcelExportService(): ExcelExportService {
  const serviceConfig: ServiceConfig = useServiceConfig();
  const { getAccessToken } = useOktaTokens();
  const { baseUrl } = serviceConfig.excelExportService;

  return new ExcelExportService(baseUrl, getAccessToken);
}
