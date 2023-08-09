import cqmMeasure from "../mockdata/qdm/CMS108/cqm_measure.json";
import patientJson from "../mockdata/qdm/testCasePatient.json";
import { QdmCalculationService } from "./QdmCalculationService";

describe("QDM CalculationService Tests", () => {
  let qdmCalculationService: QdmCalculationService;

  beforeEach(() => {
    qdmCalculationService = new QdmCalculationService();
  });

  it("basic test case execution with mock data", async () => {
    localStorage.setItem("madieDebug", "true");
    const qdmCalculationResults =
      await qdmCalculationService.calculateQdmTestCases(
        cqmMeasure,
        patientJson
      );
    expect(qdmCalculationResults).toBeTruthy();
    expect(Object.keys(qdmCalculationResults).length).toBe(1);
    expect(qdmCalculationResults["648c6a89f48905000012a680"]).toBeTruthy();
    expect(
      Object.keys(qdmCalculationResults["648c6a89f48905000012a680"]).length
    ).toBe(1);
    expect(
      qdmCalculationResults["648c6a89f48905000012a680"]["PopulationSet_1"]
    ).toBeTruthy();
  });
});
