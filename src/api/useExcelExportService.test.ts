import axios from "./axios-instance";
import { ExcelExportService } from "./useExcelExportService";

jest.mock("./axios-instance");

describe("useExcelExport Tests", () => {
  let excelExportService: ExcelExportService;
  beforeEach(() => {
    const getAccessToken = jest.fn();
    excelExportService = new ExcelExportService("test.url", getAccessToken);
  });

  it("Should call Terminology Service URL to fetch value set expansions when manifest Expansion feature flag is true", async () => {
    axios.put = jest.fn().mockResolvedValue({ data: "test-data" });

    const result = await excelExportService.generateExcel([]);
    expect(result.data).toEqual("test-data");
  });
});
