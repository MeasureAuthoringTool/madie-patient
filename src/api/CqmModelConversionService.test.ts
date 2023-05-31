import { Measure } from "@madie/madie-models";
import axios from "axios";
import { DataCriteria } from "./models/DataCriteria";
import { CqmConversionService } from "./CqmModelConversionService";

jest.mock("axios");
const axiosMock = axios as jest.Mocked<typeof axios>;

const measure = {
  id: "1",
  measureName: "CQM01",
  cqlLibraryName: "CQM01",
  measureSetId: "1-2-3",
  scoring: "Cohort",
  patientBasis: true,
  cql: "mock cql",
} as Measure;
describe("CqmConversionService", () => {
  const getAccessToken = jest.fn();
  let cqmConversionService = new CqmConversionService("url", getAccessToken);
  let dataCriteria: Array<DataCriteria>;
  let elms: Array<String>;
  beforeEach(() => {
    dataCriteria = [
      {
        oid: "2.16.840.1.114222.4.11.837",
        title: "Ethnicity",
        description: "Patient Characteristic Ethnicity: Ethnicity",
        type: "PatientCharacteristicEthnicity",
        drc: false,
      },
      {
        oid: "2.16.840.1.113883.3.666.5.307",
        title: "Encounter Inpatient",
        description: "Encounter, Performed: Encounter Inpatient",
        type: "EncounterPerformed",
        drc: false,
      },
      {
        oid: "drc-0897635b538e9dfe8d873e13e47dcac3",
        title: "Clinical Examples",
        description: "Procedure, Performed: Clinical Examples",
        type: "ProcedurePerformed",
        drc: true,
      },
    ];
    elms = [
      '{"library":{"annotation":{},"identifier":{"id":"CQM01","version":"1.0.000"},"statements":{}}}',
      '{"library":{"annotation":{},"identifier":{"id":"IncludedLib","version":"0.1.000"},"statements":{}}}',
    ];
  });

  it("converts MADiE measure to cqm measure successfully", async () => {
    axiosMock.put
      .mockResolvedValueOnce({ data: dataCriteria })
      .mockResolvedValueOnce({ data: elms });

    const cqmMeasure = await cqmConversionService.convertToCqmMeasure(measure);
    expect(cqmMeasure.title).toEqual(measure.measureName);
    expect(cqmMeasure.main_cql_library).toEqual(measure.cqlLibraryName);
    expect(cqmMeasure.measure_scoring).toEqual(measure.scoring);
    expect(cqmMeasure.composite).toEqual(false);

    expect(cqmMeasure.source_data_criteria.length).toEqual(3);
    expect(cqmMeasure.source_data_criteria[0].description).toEqual(
      dataCriteria[0].description
    );
    expect(cqmMeasure.source_data_criteria[0].codeListId).toEqual(
      dataCriteria[0].oid
    );

    const cqlLibraries = cqmMeasure.cql_libraries;
    expect(cqlLibraries.length).toEqual(2);
    expect(cqlLibraries[0].library_name).toEqual("CQM01");
    expect(cqlLibraries[0].library_version).toEqual("1.0.000");
    expect(cqlLibraries[0].is_main_library).toEqual(true);
    expect(cqlLibraries[1].library_name).toEqual("IncludedLib");
    expect(cqlLibraries[1].library_version).toEqual("0.1.000");
    expect(cqlLibraries[1].is_main_library).toEqual(false);
  });

  it("converts to cqm measure when MADiE measure is null/undefined", async () => {
    expect(await cqmConversionService.convertToCqmMeasure(null)).toBeNull();
    expect(
      await cqmConversionService.convertToCqmMeasure(undefined)
    ).toBeNull();
  });

  it("converts to cqm measure when MADiE measure has no cql", async () => {
    const madieMeasure = { ...measure, cql: undefined };
    expect(
      await cqmConversionService.convertToCqmMeasure(madieMeasure)
    ).toBeNull();
  });

  it("handle fetchElmForCql error", async () => {
    axiosMock.put.mockRejectedValueOnce({
      status: 500,
      data: "failure",
      error: { message: "error" },
    });
    try {
      await cqmConversionService.fetchElmForCql("cal");
    } catch (e) {
      expect(e.message).toEqual("An Error occurred while fetching elm");
    }
  });

  it("handle fetchSourceDataCriteria error", async () => {
    axiosMock.put.mockRejectedValueOnce({
      status: 500,
      data: "failure",
      error: { message: "error" },
    });
    try {
      await cqmConversionService.fetchSourceDataCriteria("cal");
    } catch (e) {
      expect(e.message).toEqual(
        "An Error occurred while fetching source data criteria"
      );
    }
  });
});
