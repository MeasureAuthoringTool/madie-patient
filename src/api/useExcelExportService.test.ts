import axios from "axios";
import useExcelExportService, {
  ExcelExportService,
} from "./useExcelExportService";

import { cqm_measure_basic_valueset } from "../mockdata/qdm/CMS108/cqm_measure_basic_valueset";

import * as _ from "lodash";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

jest.mock("axios");

describe("useExcelExport Tests", () => {
  let excelExportService: ExcelExportService;
  beforeEach(() => {
    const getAccessToken = jest.fn();
    excelExportService = new ExcelExportService("test.url", getAccessToken);
  });

  it("Should call Terminology Service URL to fetch value set expansions when manifest Expansion feature flag is true", async () => {
    axios.put = jest.fn().mockResolvedValue({ data: "test-data" });

    var result = await excelExportService.generateExcel([]);
    expect(result.data).toEqual("test-data");
  });
});
