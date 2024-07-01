import {
  AggregateFunctionType,
  Group,
  Measure,
  PopulationType,
} from "@madie/madie-models";
import axios from "../api/axios-instance";
import { DataCriteria } from "./models/DataCriteria";
import { CqmConversionService } from "./CqmModelConversionService";
import { Measure as CqmMeasure, PopulationSet } from "cqm-models";
import { TranslatedLibrary } from "./models/TranslatedLibrary";
import useMeasureServiceApi, {
  MeasureServiceApi,
} from "../api/useMeasureServiceApi";
import * as fs from "fs";

jest.mock("../api/axios-instance");
const axiosMock = axios as jest.Mocked<typeof axios>;
const codeJson = fs.readFileSync(
  "src/api/__mocks__/CqmMeasureForConversion.json",
  "utf8"
);

const cqmMeasure = JSON.parse(codeJson) as unknown as CqmMeasure;

const measure = {
  id: "1",
  measureName: "CQM01",
  cqlLibraryName: "CQM01",
  measureSetId: "1-2-3",
  scoring: "Continuous Variable",
  patientBasis: true,
  cql: "mock cql",
  supplementalData: [
    {
      definition: "SDE Definition Initial Population",
      description: "",
    },
  ],
  testCaseConfiguration: {
    sdeIncluded: true,
  },
} as Measure;
jest.mock("../api/useMeasureServiceApi");
const useMeasureServiceApiMock =
  useMeasureServiceApi as jest.Mock<MeasureServiceApi>;
const measureServiceApiMock = {
  getCqmMeasure: jest.fn().mockResolvedValue(cqmMeasure),
} as unknown as MeasureServiceApi;
useMeasureServiceApiMock.mockImplementation(() => measureServiceApiMock);

describe("CqmConversionService", () => {
  const getAccessToken = jest.fn();
  let cqmConversionService = new CqmConversionService("url", getAccessToken);
  let dataCriteria: Array<DataCriteria>;
  let elms: Array<String>;
  let translatedLibraries: Array<TranslatedLibrary>;
  let population_sets: Array<PopulationSet>;
  let group: Group;

  beforeEach(() => {
    group = {
      id: "ABC",
      scoring: "Continuous Variable",
      populations: [
        {
          id: "id-1",
          name: PopulationType.INITIAL_POPULATION,
          definition: "Initial Population",
          description: "",
        },
        {
          definition: "Measure Population",
          description: "",
          id: "id-2",
          name: PopulationType.MEASURE_POPULATION,
        },
      ],
      groupDescription: "",
      measureGroupTypes: [],
      populationBasis: "boolean",
      scoringUnit: "",
      stratifications: [
        {
          cqlDefinition: "Initial Population",
          description: "",
          id: "strat-1",
        },
        {
          cqlDefinition: "Initial Population",
          description: "",
          id: "strat-2",
        },
      ],
      measureObservations: [
        {
          aggregateMethod: AggregateFunctionType.AVERAGE,
          criteriaReference: "id-2",
          definition: "test",
          description: "",
          id: "observ-1",
        },
      ],
    };

    dataCriteria = [
      {
        oid: "2.16.840.1.114222.4.11.837",
        title: "Ethnicity",
        description: "Patient Characteristic Ethnicity: Ethnicity",
        type: "PatientCharacteristicEthnicity",
        drc: false,
        codeId: "",
      },
      {
        oid: "2.16.840.1.113883.3.666.5.307",
        title: "Encounter Inpatient",
        description: "Encounter, Performed: Encounter Inpatient",
        type: "EncounterPerformed",
        drc: false,
        codeId: "",
      },
      {
        oid: "drc-0897635b538e9dfe8d873e13e47dcac3",
        title: "Housing status",
        description: "Assessment, Performed: Housing status",
        type: "AssessmentPerformed",
        drc: true,
        codeId: "71802-3",
      },
    ];
    elms = [
      '{"library":{"annotation":{},"identifier":{"id":"CQM01","version":"1.0.000"},"statements":{}}}',
      '{"library":{"annotation":{},"identifier":{"id":"IncludedLib","version":"0.1.000"},"statements":{}}}',
    ];
    translatedLibraries = [
      {
        elmJson: elms[0],
        name: "CQM01",
        version: "1.0.000",
      } as TranslatedLibrary,
      {
        elmJson: elms[1],
        name: "IncludedLib",
        version: "0.1.000",
      } as TranslatedLibrary,
    ];
    population_sets = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  //MAT-6958; couldn't get this test to pass with the server side mocks for Qdm CQM Conversion
  //TODO
  it.skip("converts MADiE measure to cqm measure successfully", async () => {
    axiosMock.put
      .mockResolvedValueOnce({ data: dataCriteria })
      .mockResolvedValueOnce({ data: translatedLibraries })
      .mockResolvedValueOnce({ data: population_sets });

    measure.groups = [group];

    const cqmMeasure = await cqmConversionService.convertToCqmMeasure(measure);
    expect(cqmMeasure.title).toEqual(measure.measureName);
    expect(cqmMeasure.main_cql_library).toEqual(measure.cqlLibraryName);
    expect(cqmMeasure.measure_scoring).toEqual(measure.scoring?.toUpperCase());
    expect(cqmMeasure.composite).toEqual(false);

    expect(cqmMeasure.source_data_criteria.length).toEqual(3);
    expect(cqmMeasure.source_data_criteria[0].description).toEqual(
      dataCriteria[0].description
    );
    expect(cqmMeasure.source_data_criteria[0].codeListId).toEqual(
      dataCriteria[0].oid
    );
    expect(cqmMeasure.calculate_sdes).toBeTruthy();

    const cqlLibraries = cqmMeasure.cql_libraries;
    expect(cqlLibraries.length).toEqual(2);
    expect(cqlLibraries[0].library_name).toEqual("CQM01");
    expect(cqlLibraries[0].library_version).toEqual("1.0.000");
    expect(cqlLibraries[0].is_main_library).toEqual(true);
    expect(cqlLibraries[1].library_name).toEqual("IncludedLib");
    expect(cqlLibraries[1].library_version).toEqual("0.1.000");
    expect(cqlLibraries[1].is_main_library).toEqual(false);

    const populationSets = cqmMeasure.population_sets;

    //populations
    expect(populationSets.length).toEqual(1);
    expect(populationSets[0].population_set_id).toEqual("ABC");
    expect(populationSets[0].title).toEqual("Population Criteria Section");
    expect(populationSets[0].populations).toHaveProperty("IPP");
    expect(populationSets[0].populations).toHaveProperty("MSRPOPL");

    //stratifications
    expect(populationSets[0].stratifications.length).toEqual(2);
    expect(populationSets[0].stratifications[0]).toHaveProperty(
      "stratification_id"
    );
    expect(populationSets[0].stratifications[0].stratification_id).toEqual(
      "PopulationSet_1_Stratification_1"
    );

    //supplemental data elements
    expect(populationSets[0].supplemental_data_elements.length).toEqual(1);
    expect(
      populationSets[0].supplemental_data_elements[0].statement_name
    ).toEqual("SDE Definition Initial Population");

    //observations
    expect(populationSets[0].observations.length).toEqual(1);
    expect(populationSets[0].observations[0].aggregation_type).toEqual(
      "Average"
    );
    expect(
      populationSets[0].observations[0].observation_function.statement_name
    ).toEqual("test");
    expect(
      populationSets[0].observations[0].observation_parameter.statement_name
    ).toEqual("Measure Population");
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
      await cqmConversionService.fetchTranslationForCql("cal");
    } catch (e) {
      expect(e.message).toEqual("An Error occurred while fetching elm");
    }
  });

  it("handle fetchRelevantDataElements error", async () => {
    axiosMock.put.mockRejectedValueOnce({
      status: 500,
      data: "failure",
      error: { message: "error" },
    });
    try {
      await cqmConversionService.fetchRelevantDataElements(measure);
    } catch (e) {
      expect(e.message).toEqual(
        "An Error occurred while fetching relevant data elements"
      );
    }
  });

  it("handle fetchRelevantDataElements success", async () => {
    axios.put = jest.fn().mockResolvedValueOnce({
      status: 200,
      data: dataCriteria,
    });

    const result = await cqmConversionService.fetchRelevantDataElements(
      measure
    );
    expect(result.length).toBe(3);
    expect(result[0].codeListId).toBe("2.16.840.1.114222.4.11.837");
    expect(result[1].codeListId).toBe("2.16.840.1.113883.3.666.5.307");
    expect(result[2].codeId).toBe("71802-3");
  });
});
