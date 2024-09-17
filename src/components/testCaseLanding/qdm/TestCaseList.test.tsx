import * as React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ApiContextProvider, ServiceConfig } from "../../../api/ServiceContext";
import {
  getCoverageValueFromHtml,
  IMPORT_ERROR,
  removeHtmlCoverageHeader,
} from "./TestCaseList";
import calculationService, {
  CalculationService,
} from "../../../api/CalculationService";
import {
  GroupPopulation,
  Measure,
  MeasureErrorType,
  MeasureScoring,
  Model,
  PopulationExpectedValue,
  PopulationType,
  TestCase,
  AggregateFunctionType,
} from "@madie/madie-models";
import useTestCaseServiceApi, {
  TestCaseServiceApi,
} from "../../../api/useTestCaseServiceApi";
import useExcelExportService, {
  ExcelExportService,
} from "../../../api/useExcelExportService";
import { AxiosError } from "axios";
import useMeasureServiceApi, {
  MeasureServiceApi,
} from "../../../api/useMeasureServiceApi";
import userEvent from "@testing-library/user-event";
import { buildMeasureBundle } from "../../../util/CalculationTestHelpers";
import { QdmExecutionContextProvider } from "../../routes/qdm/QdmExecutionContext";
// @ts-ignore
import {
  checkUserCanEdit,
  useFeatureFlags,
  measureStore,
} from "@madie/madie-util";
import qdmCalculationService, {
  QdmCalculationService,
} from "../../../api/QdmCalculationService";
import { measureCql } from "../../editTestCase/groupCoverage/_mocks_/QdmCovergaeMeasureCql";
import { qdmCallStack } from "../../editTestCase/groupCoverage/_mocks_/QdmCallStack";
import useQdmCqlParsingService, {
  QdmCqlParsingService,
} from "../../../api/cqlElmTranslationService/useQdmCqlParsingService";
import TestCaseLandingWrapper from "../common/TestCaseLandingWrapper";
import TestCaseLanding from "../qdm/TestCaseLanding";

const serviceConfig: ServiceConfig = {
  qdmElmTranslationService: { baseUrl: "translator.url" },
  fhirElmTranslationService: { baseUrl: "translator.url" },
  excelExportService: {
    baseUrl: "excelexport.com",
  },
  testCaseService: {
    baseUrl: "base.url",
  },
  measureService: {
    baseUrl: "base.url",
  },
  terminologyService: {
    baseUrl: "http.com",
  },
};
const MEASURE_CREATEDBY = "testuser";
// Mock data for Measure retrieved from MeasureService

const mockMeasure = {
  id: "1",
  measureName: "measureName",
  createdBy: MEASURE_CREATEDBY,
  cqlLibraryName: "testLibrary",
  cmsId: "1234",
  measureSetId: "1234",

  scoring: MeasureScoring.PROPORTION,
  groups: [
    {
      id: "1",
      scoring: MeasureScoring.PROPORTION,
      populationBasis: "boolean",
      populations: [
        {
          id: "id-1",
          name: PopulationType.INITIAL_POPULATION,
          definition: "ipp",
        },
        {
          id: "id-2",
          name: PopulationType.DENOMINATOR,
          definition: "denom",
        },
        {
          id: "id-3",
          name: PopulationType.NUMERATOR,
          definition: "num",
        },
      ],
    },
  ],
  model: Model.QDM_5_6,
  acls: [{ userId: "othertestuser@example.com", roles: ["SHARED_WITH"] }],
  cql: measureCql,
} as unknown as Measure;
jest.mock("@madie/madie-util", () => ({
  useDocumentTitle: jest.fn(),
  checkUserCanEdit: jest.fn().mockImplementation(() => true),
  measureStore: {
    updateMeasure: jest.fn((measure) => measure),
    updateTestCases: jest.fn().mockImplementation(() => {}),
    state: jest.fn().mockImplementation(() => mockMeasure),
    initialState: null,
    subscribe: (set) => {
      set(mockMeasure);
      return { unsubscribe: () => null };
    },
    unsubscribe: () => null,
  },
  useFeatureFlags: jest.fn().mockImplementation(() => ({
    applyDefaults: false,
  })),
  useOktaTokens: () => ({
    getAccessToken: () => "test.jwt",
    getUserName: () => MEASURE_CREATEDBY,
  }),
  routeHandlerStore: {
    subscribe: () => {
      return { unsubscribe: () => null };
    },
    updateRouteHandlerState: () => null,
    state: { canTravel: false, pendingPath: "" },
    initialState: { canTravel: false, pendingPath: "" },
  },
}));
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
jest.mock("../../../api/cqlElmTranslationService/useQdmCqlParsingService");
const useCqlParsingServiceMock =
  useQdmCqlParsingService as jest.Mock<QdmCqlParsingService>;

const useCqlParsingServiceMockResolved = {
  getAllDefinitionsAndFunctions: jest.fn().mockResolvedValue(qdmCallStack),
  getDefinitionCallstacks: jest.fn().mockResolvedValue(qdmCallStack),
} as unknown as QdmCqlParsingService;

const mockOnImportTestCases = jest.fn();

jest.mock(
  "../common/import/TestCaseImportFromBonnieDialogQDM",
  () =>
    ({ openDialog, handleClose, onImport }) => {
      return openDialog ? (
        <div data-testid="test-case-import-dialog">
          <button
            data-testid="test-case-import-cancel-btn"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            onClick={() => mockOnImportTestCases(onImport)}
            // onClick={() => onImport(importingTestCases)}
            data-testid="test-case-import-import-btn"
            type="button"
          >
            Import
          </button>
        </div>
      ) : (
        <></>
      );
    }
);

// output from calculationService
const executionResults = {
  results: [
    {
      patientId: "1",
      detailedResults: [
        {
          groupId: "1",
          populationResults: [
            {
              populationType: "initial-population",
              result: true,
            },
            {
              populationType: "denominator",
              result: false,
            },
            {
              populationType: "numerator",
              result: true,
            },
          ],
        },
      ],
    },
    {
      patientId: "2",
      detailedResults: [
        {
          groupId: "2",
          populationResults: [
            {
              populationType: "initial-population",
              result: false,
            },
            {
              populationType: "denominator",
              result: false,
            },
            {
              populationType: "numerator",
              result: false,
            },
          ],
        },
      ],
    },
  ],
  groupClauseCoverageHTML: {
    1: `<div><h2> a345sda45 Clause Coverage: 75.0%</h2></div>`,
    2: `<div><h2> a345sda45 Clause Coverage: 100%</h2></div>`,
  },
};

const qdmExecutionResults = {
  // patient with id "1"
  "1": {
    // group / population set with id "1"
    "1": {
      IPP: true,
      clause_results: {
        testLibrary: {
          28: {
            raw: [],
            statement_name: "SDE Ethnicity",
            library_name: "testLibrary",
            localId: "28",
            final: "TRUE",
          },
          36: {
            raw: [
              {
                dataElementCodes: [
                  {
                    code: "4525004",
                    system: "2.16.840.1.113883.6.96",
                    version: null,
                    display: "Emergency department patient visit (procedure)",
                  },
                ],
                _id: "6595aa5d1860570000fa6503",
                participant: [],
                relatedTo: [],
                qdmTitle: "Encounter, Performed",
                hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
                qdmCategory: "encounter",
                qdmStatus: "performed",
                qdmVersion: "5.6",
                _type: "QDM::EncounterPerformed",
                description: "Encounter, Performed: Emergency Department Visit",
                codeListId: "2.16.840.1.113883.3.117.1.7.1.292",
                id: "6595aa5d1860570000fa6502",
                relevantPeriod: {
                  low: "2022-01-01T08:00:00.000+00:00",
                  high: "2022-01-08T00:00:00.000+00:00",
                  lowClosed: true,
                  highClosed: true,
                },
                facilityLocations: [],
                diagnoses: [],
              },
            ],
            statement_name: "Initial Population",
            library_name: "QDMDelete",
            localId: "36",
            final: "TRUE",
          },
        },
      },
      DENOM: false,
      NUMER: true,
      episodeResults: {},
      statement_results: {
        MATGlobalCommonFunctionsQDM: {
          EarliestOf: {
            library_name: "MATGlobalCommonFunctionsQDM",
            statement_name: "EarliestOf",
            relevance: "NA",
            final: "NA",
          },
          Earliest: {
            library_name: "MATGlobalCommonFunctionsQDM",
            statement_name: "Earliest",
            relevance: "NA",
            final: "NA",
          },
          HasStart: {
            library_name: "MATGlobalCommonFunctionsQDM",
            statement_name: "HasStart",
            relevance: "NA",
            final: "NA",
          },
          NormalizeInterval: {
            library_name: "MATGlobalCommonFunctionsQDM",
            statement_name: "NormalizeInterval",
            relevance: "NA",
            final: "NA",
          },
        },
        TestQDM: {
          Patient: {
            library_name: "TestQDM",
            statement_name: "Patient",
            relevance: "NA",
            final: "NA",
          },
          "Inpatient Encounters": {
            raw: [],
            library_name: "TestQDM",
            statement_name: "Inpatient Encounters",
            relevance: "TRUE",
            final: "FALSE",
          },
          "Initial Population": {
            raw: [],
            library_name: "TestQDM",
            statement_name: "Initial Population",
            relevance: "TRUE",
            final: "FALSE",
          },
          Denominator: {
            raw: [],
            library_name: "TestQDM",
            statement_name: "Denominator",
            relevance: "FALSE",
            final: "UNHIT",
          },
          Numerator: {
            raw: [],
            library_name: "TestQDM",
            statement_name: "Numerator",
            relevance: "FALSE",
            final: "UNHIT",
          },
          "SDE Ethnicity": {
            raw: [
              {
                dataElementCodes: [
                  {
                    code: "2186-5",
                    system: "2.16.840.1.113883.6.238",
                    version: "1.2",
                    display: "Not Hispanic or Latino",
                  },
                ],
                _id: "65733afc0c92e100000f9121",
                qdmTitle: "Patient Characteristic Ethnicity",
                hqmfOid: "2.16.840.1.113883.10.20.28.4.56",
                qdmCategory: "patient_characteristic",
                qdmStatus: "ethnicity",
                qdmVersion: "5.6",
                _type: "QDM::PatientCharacteristicEthnicity",
                id: "65733afc0c92e100000f9121",
              },
            ],
            library_name: "TestQDM",
            statement_name: "SDE Ethnicity",
            relevance: "NA",
            final: "NA",
          },
          "SDE Payer": {
            raw: [],
            library_name: "TestQDM",
            statement_name: "SDE Payer",
            relevance: "NA",
            final: "NA",
          },
          "SDE Race": {
            raw: [
              {
                dataElementCodes: [
                  {
                    code: "2028-9",
                    system: "2.16.840.1.113883.6.238",
                    version: "1.2",
                    display: "Asian",
                  },
                ],
                _id: "65733af90c92e100000f911d",
                qdmTitle: "Patient Characteristic Race",
                hqmfOid: "2.16.840.1.113883.10.20.28.4.59",
                qdmCategory: "patient_characteristic",
                qdmStatus: "race",
                qdmVersion: "5.6",
                _type: "QDM::PatientCharacteristicRace",
                id: "65733af90c92e100000f911d",
              },
            ],
            library_name: "TestQDM",
            statement_name: "SDE Race",
            relevance: "NA",
            final: "NA",
          },
          "SDE Sex": {
            raw: [
              {
                dataElementCodes: [
                  {
                    code: "M",
                    system: "2.16.840.1.113883.5.1",
                    version: "2022-11",
                    display: "Male",
                  },
                ],
                _id: "65733afb0c92e100000f911f",
                qdmTitle: "Patient Characteristic Sex",
                hqmfOid: "2.16.840.1.113883.10.20.28.4.55",
                qdmCategory: "patient_characteristic",
                qdmStatus: "gender",
                qdmVersion: "5.6",
                _type: "QDM::PatientCharacteristicSex",
                id: "65733afb0c92e100000f911f",
              },
            ],
            library_name: "TestQDM",
            statement_name: "SDE Sex",
            relevance: "NA",
            final: "NA",
          },
          FirstPhysicalExamWithEncounterId: {
            library_name: "TestQDM",
            statement_name: "FirstPhysicalExamWithEncounterId",
            relevance: "NA",
            final: "NA",
          },
          FirstPhysicalExamWithEncounterIdUsingLabTiming: {
            library_name: "TestQDM",
            statement_name: "FirstPhysicalExamWithEncounterIdUsingLabTiming",
            relevance: "NA",
            final: "NA",
          },
          FirstLabTestWithEncounterId: {
            library_name: "TestQDM",
            statement_name: "FirstLabTestWithEncounterId",
            relevance: "NA",
            final: "NA",
          },
          "SDE Results": {
            raw: {
              FirstHeartRate: [],
              FirstSystolicBloodPressure: [],
              FirstRespiratoryRate: [],
              FirstBodyTemperature: [],
              FirstOxygenSaturation: [],
              FirstBodyWeight: [],
              FirstHematocritLab: [],
              FirstWhiteBloodCellCount: [],
              FirstPotassiumLab: [],
              FirstSodiumLab: [],
              FirstBicarbonateLab: [],
              FirstCreatinineLab: [],
              FirstGlucoseLab: [],
            },
            library_name: "TestQDM",
            statement_name: "SDE Results",
            relevance: "NA",
            final: "NA",
          },
          LengthOfStay: {
            library_name: "TestQDM",
            statement_name: "LengthOfStay",
            relevance: "NA",
            final: "NA",
          },
        },
      },
    },
  },
  "2": {
    "1": {
      IPP: false,
      DENOM: false,
      NUMER: false,
      episodeResults: {},
      statement_results: {
        MATGlobalCommonFunctionsQDM: {
          EarliestOf: {
            library_name: "MATGlobalCommonFunctionsQDM",
            statement_name: "EarliestOf",
            relevance: "NA",
            final: "NA",
          },
          Earliest: {
            library_name: "MATGlobalCommonFunctionsQDM",
            statement_name: "Earliest",
            relevance: "NA",
            final: "NA",
          },
          HasStart: {
            library_name: "MATGlobalCommonFunctionsQDM",
            statement_name: "HasStart",
            relevance: "NA",
            final: "NA",
          },
          NormalizeInterval: {
            library_name: "MATGlobalCommonFunctionsQDM",
            statement_name: "NormalizeInterval",
            relevance: "NA",
            final: "NA",
          },
        },
        TestQDM: {
          Patient: {
            library_name: "TestQDM",
            statement_name: "Patient",
            relevance: "NA",
            final: "NA",
          },
          "Inpatient Encounters": {
            raw: [
              {
                dataElementCodes: [
                  {
                    code: "183452005",
                    system: "2.16.840.1.113883.6.96",
                    version: null,
                    display: "Emergency hospital admission (procedure)",
                  },
                ],
                _id: "65734f6e00291d000035fc5a",
                participant: [],
                relatedTo: [],
                qdmTitle: "Encounter, Performed",
                hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
                qdmCategory: "encounter",
                qdmStatus: "performed",
                qdmVersion: "5.6",
                _type: "QDM::EncounterPerformed",
                description: "Encounter, Performed: Encounter Inpatient",
                codeListId: "2.16.840.1.113883.3.666.5.307",
                id: "65734f6e00291d000035fc59",
                relevantPeriod: {
                  low: "2026-12-01T00:00:00.000+00:00",
                  high: "2026-01-08T05:00:00.000+00:00",
                  lowClosed: true,
                  highClosed: true,
                },
                facilityLocations: [],
                diagnoses: [],
              },
            ],
            library_name: "TestQDM",
            statement_name: "Inpatient Encounters",
            relevance: "TRUE",
            final: "TRUE",
          },
          "Initial Population": {
            raw: [
              {
                dataElementCodes: [
                  {
                    code: "183452005",
                    system: "2.16.840.1.113883.6.96",
                    version: null,
                    display: "Emergency hospital admission (procedure)",
                  },
                ],
                _id: "65734f6e00291d000035fc5a",
                participant: [],
                relatedTo: [],
                qdmTitle: "Encounter, Performed",
                hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
                qdmCategory: "encounter",
                qdmStatus: "performed",
                qdmVersion: "5.6",
                _type: "QDM::EncounterPerformed",
                description: "Encounter, Performed: Encounter Inpatient",
                codeListId: "2.16.840.1.113883.3.666.5.307",
                id: "65734f6e00291d000035fc59",
                relevantPeriod: {
                  low: "2026-12-01T00:00:00.000+00:00",
                  high: "2026-01-08T05:00:00.000+00:00",
                  lowClosed: true,
                  highClosed: true,
                },
                facilityLocations: [],
                diagnoses: [],
              },
            ],
            library_name: "TestQDM",
            statement_name: "Initial Population",
            relevance: "TRUE",
            final: "TRUE",
          },
          Denominator: {
            raw: [],
            library_name: "TestQDM",
            statement_name: "Denominator",
            relevance: "TRUE",
            final: "FALSE",
          },
          Numerator: {
            raw: [
              {
                dataElementCodes: [
                  {
                    code: "183452005",
                    system: "2.16.840.1.113883.6.96",
                    version: null,
                    display: "Emergency hospital admission (procedure)",
                  },
                ],
                _id: "65734f6e00291d000035fc5a",
                participant: [],
                relatedTo: [],
                qdmTitle: "Encounter, Performed",
                hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
                qdmCategory: "encounter",
                qdmStatus: "performed",
                qdmVersion: "5.6",
                _type: "QDM::EncounterPerformed",
                description: "Encounter, Performed: Encounter Inpatient",
                codeListId: "2.16.840.1.113883.3.666.5.307",
                id: "65734f6e00291d000035fc59",
                relevantPeriod: {
                  low: "2026-12-01T00:00:00.000+00:00",
                  high: "2026-01-08T05:00:00.000+00:00",
                  lowClosed: true,
                  highClosed: true,
                },
                facilityLocations: [],
                diagnoses: [],
              },
            ],
            library_name: "TestQDM",
            statement_name: "Numerator",
            relevance: "FALSE",
            final: "UNHIT",
          },
          "SDE Ethnicity": {
            raw: [
              {
                dataElementCodes: [
                  {
                    code: "2135-2",
                    system: "2.16.840.1.113883.6.238",
                    version: "1.2",
                    display: "Hispanic or Latino",
                  },
                ],
                _id: "6571f6fb514f8e0000a4c093",
                qdmTitle: "Patient Characteristic Ethnicity",
                hqmfOid: "2.16.840.1.113883.10.20.28.4.56",
                qdmCategory: "patient_characteristic",
                qdmStatus: "ethnicity",
                qdmVersion: "5.6",
                _type: "QDM::PatientCharacteristicEthnicity",
                id: "6571f6fb514f8e0000a4c093",
              },
            ],
            library_name: "TestQDM",
            statement_name: "SDE Ethnicity",
            relevance: "NA",
            final: "NA",
          },
          "SDE Payer": {
            raw: [],
            library_name: "TestQDM",
            statement_name: "SDE Payer",
            relevance: "NA",
            final: "NA",
          },
          "SDE Race": {
            raw: [],
            library_name: "TestQDM",
            statement_name: "SDE Race",
            relevance: "NA",
            final: "NA",
          },
          "SDE Sex": {
            raw: [
              {
                dataElementCodes: [
                  {
                    code: "F",
                    system: "2.16.840.1.113883.5.1",
                    version: "2022-11",
                    display: "Female",
                  },
                ],
                _id: "6571f6fc514f8e0000a4c095",
                qdmTitle: "Patient Characteristic Sex",
                hqmfOid: "2.16.840.1.113883.10.20.28.4.55",
                qdmCategory: "patient_characteristic",
                qdmStatus: "gender",
                qdmVersion: "5.6",
                _type: "QDM::PatientCharacteristicSex",
                id: "6571f6fc514f8e0000a4c095",
              },
            ],
            library_name: "TestQDM",
            statement_name: "SDE Sex",
            relevance: "NA",
            final: "NA",
          },
          FirstPhysicalExamWithEncounterId: {
            library_name: "TestQDM",
            statement_name: "FirstPhysicalExamWithEncounterId",
            relevance: "NA",
            final: "NA",
          },
          FirstPhysicalExamWithEncounterIdUsingLabTiming: {
            library_name: "TestQDM",
            statement_name: "FirstPhysicalExamWithEncounterIdUsingLabTiming",
            relevance: "NA",
            final: "NA",
          },
          FirstLabTestWithEncounterId: {
            library_name: "TestQDM",
            statement_name: "FirstLabTestWithEncounterId",
            relevance: "NA",
            final: "NA",
          },
          "SDE Results": {
            raw: {
              FirstHeartRate: [
                {
                  EncounterId: "65734f6e00291d000035fc59",
                  FirstResult: null,
                  Timing: null,
                },
              ],
              FirstSystolicBloodPressure: [
                {
                  EncounterId: "65734f6e00291d000035fc59",
                  FirstResult: null,
                  Timing: null,
                },
              ],
              FirstRespiratoryRate: [
                {
                  EncounterId: "65734f6e00291d000035fc59",
                  FirstResult: null,
                  Timing: null,
                },
              ],
              FirstBodyTemperature: [
                {
                  EncounterId: "65734f6e00291d000035fc59",
                  FirstResult: null,
                  Timing: null,
                },
              ],
              FirstOxygenSaturation: [
                {
                  EncounterId: "65734f6e00291d000035fc59",
                  FirstResult: null,
                  Timing: null,
                },
              ],
              FirstBodyWeight: [
                {
                  EncounterId: "65734f6e00291d000035fc59",
                  FirstResult: null,
                  Timing: null,
                },
              ],
              FirstHematocritLab: [
                {
                  EncounterId: "65734f6e00291d000035fc59",
                  FirstResult: null,
                  Timing: null,
                },
              ],
              FirstWhiteBloodCellCount: [
                {
                  EncounterId: "65734f6e00291d000035fc59",
                  FirstResult: null,
                  Timing: null,
                },
              ],
              FirstPotassiumLab: [
                {
                  EncounterId: "65734f6e00291d000035fc59",
                  FirstResult: null,
                  Timing: null,
                },
              ],
              FirstSodiumLab: [
                {
                  EncounterId: "65734f6e00291d000035fc59",
                  FirstResult: null,
                  Timing: null,
                },
              ],
              FirstBicarbonateLab: [
                {
                  EncounterId: "65734f6e00291d000035fc59",
                  FirstResult: null,
                  Timing: null,
                },
              ],
              FirstCreatinineLab: [
                {
                  EncounterId: "65734f6e00291d000035fc59",
                  FirstResult: null,
                  Timing: null,
                },
              ],
              FirstGlucoseLab: [
                {
                  EncounterId: "65734f6e00291d000035fc59",
                  FirstResult: null,
                  Timing: null,
                },
              ],
            },
            library_name: "TestQDM",
            statement_name: "SDE Results",
            relevance: "NA",
            final: "NA",
          },
          LengthOfStay: {
            library_name: "TestQDM",
            statement_name: "LengthOfStay",
            relevance: "NA",
            final: "NA",
          },
        },
      },
    },
  },
};

// mock data for list of testCases retrieved from testCaseService
const testCases = [
  {
    id: "1",
    description: "Test IPP",
    title: "WhenAllGood",
    series: "IPP-Pass",
    lastModifiedAt: "2024-09-10T08:49:14.382Z",
    validResource: true,
    json: "{}",
    groupPopulations: [
      {
        groupId: "1",
        scoring: MeasureScoring.PROPORTION,
        populationValues: [
          {
            name: "initialPopulation",
            expected: true,
          },
          {
            name: "denominator",
            expected: false,
          },
          {
            name: "numerator",
            expected: true,
          },
        ] as PopulationExpectedValue[],
      },
    ] as GroupPopulation[],
  },
  {
    id: "2",
    description: "Test IPP Fail when something is wrong",
    title: "WhenSomethingIsWrong",
    series: "IPP-Fail",
    lastModifiedAt: "2024-09-10T08:49:15.382Z",
    validResource: true,
    json: "{}",
    groupPopulations: [
      {
        groupId: "1",
        scoring: MeasureScoring.PROPORTION,
        populationValues: [
          {
            name: "initialPopulation",
            expected: false,
          },
          {
            name: "denominator",
            expected: false,
          },
          {
            name: "numerator",
            expected: true,
          },
        ] as PopulationExpectedValue[],
      },
    ] as GroupPopulation[],
  },
  {
    id: "3",
    description: "Invalid test case",
    title: "WhenJsonIsInvalid",
    series: "IPP-Fail",
    lastModifiedAt: "2024-09-10T08:49:16.382Z",
    validResource: false,
    json: "{}",
    groupPopulations: [
      {
        groupId: "1",
        scoring: MeasureScoring.PROPORTION,
        populationValues: [
          {
            name: "initialPopulation",
            expected: false,
          },
          {
            name: "denominator",
            expected: false,
          },
          {
            name: "numerator",
            expected: true,
          },
        ] as PopulationExpectedValue[],
      },
    ] as GroupPopulation[],
  },
] as TestCase[];

const failingTestCaseResults = [
  {
    id: "1",
    description: "Test IPP",
    title: "WhenAllGood",
    series: "IPP-Pass",
    lastModifiedAt: "2024-09-10T08:49:14.382Z",
    validResource: true,
    executionStatus: "pass",
    groupPopulations: [
      {
        groupId: "1",
        scoring: MeasureScoring.PROPORTION,
        populationValues: [
          {
            name: "initialPopulation",
            expected: true,
            actual: true,
          },
          {
            name: "denominator",
            expected: false,
            actual: false,
          },
          {
            name: "numerator",
            expected: true,
            actual: true,
          },
        ] as PopulationExpectedValue[],
      },
      {
        groupId: "2",
        scoring: MeasureScoring.COHORT,
        populationBasis: "boolean",
        populationValues: [
          {
            id: "id-1",
            name: PopulationType.INITIAL_POPULATION,
            expected: true,
            actual: true,
          },
        ] as PopulationExpectedValue[],
      },
    ] as GroupPopulation[],
  },
  {
    id: "2",
    description: "Test IPP Fail when something is wrong",
    title: "WhenSomethingIsWrong",
    series: "IPP-Fail",
    lastModifiedAt: "2024-09-10T08:49:15.382Z",
    validResource: true,
    executionStatus: "fail",
    groupPopulations: [
      {
        groupId: "1",
        scoring: MeasureScoring.PROPORTION,
        populationValues: [
          {
            name: "initialPopulation",
            expected: false,
            actual: false,
          },
          {
            name: "denominator",
            expected: false,
            actual: false,
          },
          {
            name: "numerator",
            expected: true,
            actual: false,
          },
        ] as PopulationExpectedValue[],
      },
      {
        groupId: "2",
        scoring: MeasureScoring.COHORT,
        populationBasis: "boolean",
        populationValues: [
          {
            id: "id-1",
            name: PopulationType.INITIAL_POPULATION,
            expected: true,
            actual: true,
          },
        ] as PopulationExpectedValue[],
      },
    ] as GroupPopulation[],
  },
  {
    id: "3",
    description: "Invalid test case",
    title: "WhenJsonIsInvalid",
    series: "IPP_Fail",
    lastModifiedAt: "2024-09-10T08:49:16.382Z",
    validResource: false,
    groupPopulations: [
      {
        groupId: "1",
        scoring: MeasureScoring.PROPORTION,
        populationValues: [
          {
            name: "initialPopulation",
            expected: false,
          },
          {
            name: "denominator",
            expected: false,
          },
          {
            name: "numerator",
            expected: true,
          },
        ] as PopulationExpectedValue[],
      },
      {
        groupId: "2",
        scoring: MeasureScoring.COHORT,
        populationBasis: "boolean",
        populationValues: [
          {
            id: "id-1",
            name: PopulationType.INITIAL_POPULATION,
            expected: true,
            actual: true,
          },
        ] as PopulationExpectedValue[],
      },
    ] as GroupPopulation[],
  },
] as TestCase[];

const bonnieQdmTestCases = [
  {
    expectedValues: [
      {
        population_index: 0,
        IPP: 1,
        DENOM: 1,
        DENEX: 1,
        NUMER: 0,
        NUMEX: 0,
        DENOM_OBSERV: [],
        NUMER_OBSERV: [],
      },
    ],
    familyName: "DENEXPass",
    givenNames: ["FirstAvgDrink3PerDayB4MPSecondDuringMP"],
    notes:
      "Female, 60 years and 6 months, qualifying encounter. Two drinks assessment both indicating 3 drinks per day. First started before MP and second during MP.",
    provider_ids: [],
    qdmPatient: {
      birthDatetime: "1951-06-07T08:00:00.000+00:00",
      dataElements: [
        {
          authorDatetime: null,
          codeListId: "2.16.840.1.113883.3.464.1003.106.12.1018",
          components: null,
          dataElementCodes: [
            {
              code: "74013-4",
              system: "2.16.840.1.113883.6.1",
              version: null,
              display: null,
            },
          ],
          description:
            "Assessment, Performed: Average Number of Drinks per Drinking Day",
          hqmfOid: "2.16.840.1.113883.10.20.28.4.117",
          id: "5ca37846b848466e402993ac",
          interpretation: null,
          method: null,
          negationRationale: null,
          qdmCategory: "assessment",
          qdmStatus: "performed",
          qdmTitle: "Assessment, Performed",
          qdmVersion: "5.6",
          reason: null,
          relatedTo: null,
          relevantDatetime: null,
          relevantPeriod: {
            low: "2011-12-31T23:50:00.000Z",
            high: "2012-01-01T00:15:00.000Z",
            lowClosed: true,
            highClosed: true,
          },
          result: {
            value: 3,
            unit: "{drinks}/d",
          },
          _type: "QDM::AssessmentPerformed",
        },
        {
          codeListId: "2.16.840.1.113762.1.4.1",
          dataElementCodes: [
            {
              code: "F",
              system: "2.16.840.1.113883.5.1",
              version: null,
              display: "Female",
            },
          ],
          description: "Patient Characteristic Sex: ONCAdministrativeSex",
          hqmfOid: "2.16.840.1.113883.10.20.28.4.55",
          id: "65425f2eb869be15aad3fd6c",
          qdmCategory: "patient_characteristic",
          qdmStatus: "gender",
          qdmTitle: "Patient Characteristic Sex",
          qdmVersion: "5.6",
          _type: "QDM::PatientCharacteristicSex",
        },
        {
          birthDatetime: "1951-06-07T08:00:00.000+00:00",
          codeListId: null,
          dataElementCodes: [],
          description: null,
          hqmfOid: "2.16.840.1.113883.10.20.28.4.54",
          id: "6542619439ef6200001d0b3e",
          qdmCategory: "patient_characteristic",
          qdmStatus: "birthdate",
          qdmTitle: "Patient Characteristic Birthdate",
          qdmVersion: "5.6",
          _type: "QDM::PatientCharacteristicBirthdate",
        },
        {
          codeListId: "2.16.840.1.114222.4.11.836",
          dataElementCodes: [
            {
              code: "2106-3",
              system: "2.16.840.1.113883.6.238",
              version: null,
              display: "White",
            },
          ],
          description: "Patient Characteristic Race: Race",
          hqmfOid: "2.16.840.1.113883.10.20.28.4.59",
          id: "65425f2eb869be15aad3fd79",
          qdmCategory: "patient_characteristic",
          qdmStatus: "race",
          qdmTitle: "Patient Characteristic Race",
          qdmVersion: "5.6",
          _type: "QDM::PatientCharacteristicRace",
        },
        {
          codeListId: "2.16.840.1.114222.4.11.837",
          dataElementCodes: [
            {
              code: "2186-5",
              system: "2.16.840.1.113883.6.238",
              version: null,
              display: "Not Hispanic or Latino",
            },
          ],
          description: "Patient Characteristic Ethnicity: Ethnicity",
          hqmfOid: "2.16.840.1.113883.10.20.28.4.56",
          id: "65425f2eb869be15aad3fd94",
          qdmCategory: "patient_characteristic",
          qdmStatus: "ethnicity",
          qdmTitle: "Patient Characteristic Ethnicity",
          qdmVersion: "5.6",
          _type: "QDM::PatientCharacteristicEthnicity",
        },
      ],
      extendedData: {
        type: null,
        is_shared: null,
        origin_data: null,
        test_id: null,
        medical_record_number:
          "ed7fd70767e203de5a4468033e956bad5ebbee5806026b11b93baf30c68bfc18",
        medical_record_assigner: "Bonnie",
        description: null,
        description_category: null,
        insurance_providers: "[]",
      },
      qdmVersion: "5.6",
    },
  },
  {
    expectedValues: [
      {
        population_index: 0,
        IPP: 1,
        DENOM: 0,
        DENEX: 0,
        NUMER: 0,
        NUMEX: 0,
        DENOM_OBSERV: [],
        NUMER_OBSERV: [],
      },
    ],
    familyName: "DENEXFail",
    givenNames: ["FirstAvgDrink4PerDayB8MPSecondDuringMP"],
    notes:
      "Female, 60 years and 6 months, qualifying encounter. Two drinks assessment both indicating 3 drinks per day. First started before MP and second during MP.",
    provider_ids: [],
    qdmPatient: {
      birthDatetime: "1951-06-07T08:00:00.000+00:00",
      dataElements: [
        {
          codeListId: "2.16.840.1.113762.1.4.1",
          dataElementCodes: [
            {
              code: "F",
              system: "2.16.840.1.113883.5.1",
              version: null,
              display: "Female",
            },
          ],
          description: "Patient Characteristic Sex: ONCAdministrativeSex",
          hqmfOid: "2.16.840.1.113883.10.20.28.4.55",
          id: "65425f2eb869be15aad3fd6c",
          qdmCategory: "patient_characteristic",
          qdmStatus: "gender",
          qdmTitle: "Patient Characteristic Sex",
          qdmVersion: "5.6",
          _type: "QDM::PatientCharacteristicSex",
        },
        {
          birthDatetime: "1951-06-07T08:00:00.000+00:00",
          codeListId: null,
          dataElementCodes: [],
          description: null,
          hqmfOid: "2.16.840.1.113883.10.20.28.4.54",
          id: "6542619439ef6200001d0b3e",
          qdmCategory: "patient_characteristic",
          qdmStatus: "birthdate",
          qdmTitle: "Patient Characteristic Birthdate",
          qdmVersion: "5.6",
          _type: "QDM::PatientCharacteristicBirthdate",
        },
        {
          codeListId: "2.16.840.1.114222.4.11.836",
          dataElementCodes: [
            {
              code: "2106-3",
              system: "2.16.840.1.113883.6.238",
              version: null,
              display: "White",
            },
          ],
          description: "Patient Characteristic Race: Race",
          hqmfOid: "2.16.840.1.113883.10.20.28.4.59",
          id: "65425f2eb869be15aad3fd79",
          qdmCategory: "patient_characteristic",
          qdmStatus: "race",
          qdmTitle: "Patient Characteristic Race",
          qdmVersion: "5.6",
          _type: "QDM::PatientCharacteristicRace",
        },
        {
          codeListId: "2.16.840.1.114222.4.11.837",
          dataElementCodes: [
            {
              code: "2186-5",
              system: "2.16.840.1.113883.6.238",
              version: null,
              display: "Not Hispanic or Latino",
            },
          ],
          description: "Patient Characteristic Ethnicity: Ethnicity",
          hqmfOid: "2.16.840.1.113883.10.20.28.4.56",
          id: "65425f2eb869be15aad3fd94",
          qdmCategory: "patient_characteristic",
          qdmStatus: "ethnicity",
          qdmTitle: "Patient Characteristic Ethnicity",
          qdmVersion: "5.6",
          _type: "QDM::PatientCharacteristicEthnicity",
        },
      ],
      extendedData: {
        type: null,
        is_shared: null,
        origin_data: null,
        test_id: null,
        medical_record_number:
          "ed7fd70767e203de5a4468033e956bad5ebbee5806026b11b93baf30c68bfc18",
        medical_record_assigner: "Bonnie",
        description: null,
        description_category: null,
        insurance_providers: "[]",
      },
      qdmVersion: "5.6",
    },
  },
];

// mocking calculationService
jest.mock("../../../api/CalculationService");
const calculationServiceMock =
  calculationService as jest.Mock<CalculationService>;

jest.mock("../../../api/QdmCalculationService");
const qdmCalculationServiceMock =
  qdmCalculationService as jest.Mock<QdmCalculationService>;

const mockProcessTestCaseResults = jest.fn().mockImplementation((testCase) => {
  return failingTestCaseResults.find((tc) => tc.id === testCase.id);
});
const mockGetPassingPercentageForTestCases = jest
  .fn()
  .mockReturnValue({ passPercentage: 50, passFailRatio: "1/2" });

const calculationServiceMockResolved = {
  calculateTestCases: jest.fn().mockResolvedValue(executionResults),
  processTestCaseResults: mockProcessTestCaseResults,
  fakeFunction: jest.fn(),
  getPassingPercentageForTestCases: mockGetPassingPercentageForTestCases,
} as unknown as CalculationService;

const qdmCalculationServiceMockResolved = {
  calculateQdmTestCases: jest.fn().mockResolvedValue(qdmExecutionResults),
  processTestCaseResults: mockProcessTestCaseResults,
  qdmFakeFunction: jest.fn(),
  getPassingPercentageForTestCases: mockGetPassingPercentageForTestCases,
} as unknown as QdmCalculationService;

// mocking testCaseService
jest.mock("../../../api/useTestCaseServiceApi");
const useTestCaseServiceMock =
  useTestCaseServiceApi as jest.Mock<TestCaseServiceApi>;

const useTestCaseServiceMockResolved = {
  getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
  getTestCaseSeriesForMeasure: jest
    .fn()
    .mockResolvedValue(["Series 1", "Series 2"]),
  createTestCases: jest.fn().mockResolvedValue([]),
  importTestCasesQDM: jest.fn().mockResolvedValue([]),
  exportQRDA: jest.fn().mockResolvedValue([]),
} as unknown as TestCaseServiceApi;

// mocking measureService
jest.mock("../../../api/useMeasureServiceApi");
const useMeasureServiceMock =
  useMeasureServiceApi as jest.Mock<MeasureServiceApi>;

const useMeasureServiceMockResolved = {
  fetchMeasure: jest.fn().mockResolvedValue(mockMeasure),
  fetchMeasureBundle: jest
    .fn()
    .mockResolvedValue(buildMeasureBundle(mockMeasure)),
} as unknown as MeasureServiceApi;

// mocking excelExportService
jest.mock("../../../api/useExcelExportService");
const useExcelExportServiceMock =
  useExcelExportService as jest.Mock<ExcelExportService>;

const useExcelExportServiceMockResolved = {
  generateExcel: jest.fn().mockResolvedValue("test excel"),
} as unknown as ExcelExportService;

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

const cqmMeasure = {
  cql_libraries: [
    {
      library_name: "MATGlobalCommonFunctionsQDM",
      elm: {
        library: {
          localId: "0",
          usings: { def: [] },
          valuesets: { def: [] },
          annotations: [],
          statements: {
            def: [
              {
                library_name: "MATGlobalCommonFunctionsQDM",
                name: "EarliestOf",
                relevance: "NA",
                final: "NA",
              },
              {
                library_name: "MATGlobalCommonFunctionsQDM",
                name: "Earliest",
                relevance: "NA",
                final: "NA",
              },
              {
                library_name: "MATGlobalCommonFunctionsQDM",
                name: "HasStart",
                relevance: "NA",
                final: "NA",
              },
              {
                library_name: "MATGlobalCommonFunctionsQDM",
                name: "NormalizeInterval",
                relevance: "NA",
                final: "NA",
              },
              {
                localId: "123",
                name: "truebool",
              },
              {
                localId: "1234",
                name: "MATGlobalCommonFunctionsQDM",
              },
              {
                localID: "12345",
                name: "ear",
              },
            ],
          },
        },
      },
    },
    {
      library_name: "TestQDM",
      elm: {
        library: {
          localId: "0",
          usings: { def: [] },
          valuesets: { def: [] },
          annotations: [],
          statements: {
            def: [
              {
                library_name: "TestQDM",
                name: "Patient",
                relevance: "NA",
                final: "NA",
              },
              {
                library_name: "TestQDM",
                name: "Inpatient Encounters",
                relevance: "NA",
                final: "NA",
              },
              {
                library_name: "TestQDM",
                name: "Initial Population",
                relevance: "NA",
                final: "NA",
              },
              {
                ibrary_name: "TestQDM",
                name: "Denominator",
                relevance: "NA",
                final: "NA",
              },
              {
                library_name: "TestQDM",
                name: "Numerator",
                relevance: "NA",
                final: "NA",
              },
              {
                library_name: "TestQDM",
                name: "SDE Ethnicity",
                relevance: "NA",
                final: "NA",
              },
              {
                library_name: "TestQDM",
                name: "SDE Payer",
                relevance: "NA",
                final: "NA",
              },
              {
                library_name: "TestQDM",
                name: "SDE Race",
                relevance: "NA",
                final: "NA",
              },
              {
                library_name: "TestQDM",
                name: "SDE Sex",
                relevance: "NA",
                final: "NA",
              },
              {
                library_name: "TestQDM",
                name: "FirstPhysicalExamWithEncounterId",
                relevance: "NA",
                final: "NA",
              },
              {
                library_name: "TestQDM",
                name: "FirstPhysicalExamWithEncounterIdUsingLabTiming",
                relevance: "NA",
                final: "NA",
              },
              {
                library_name: "TestQDM",
                name: "FirstLabTestWithEncounterId",
                relevance: "NA",
                final: "NA",
              },
              {
                library_name: "TestQDM",
                name: "SDE Results",
                relevance: "NA",
                final: "NA",
              },
              {
                library_name: "TestQDM",
                name: "LengthOfStay",
                relevance: "NA",
                final: "NA",
              },
            ],
          },
        },
      },
    },
  ],
};
const setMeasure = jest.fn();
const setCqmMeasure = jest.fn();
const setError = jest.fn();
const setWarnings = jest.fn();
const setImportErrors = jest.fn();

window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");

describe("TestCaseList component", () => {
  beforeEach(() => {
    calculationServiceMock.mockImplementation(() => {
      return calculationServiceMockResolved;
    });
    qdmCalculationServiceMock.mockImplementation(() => {
      return qdmCalculationServiceMockResolved;
    });
    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockResolved;
    });
    useMeasureServiceMock.mockImplementation(() => {
      return useMeasureServiceMockResolved;
    });
    useCqlParsingServiceMock.mockImplementation(() => {
      return useCqlParsingServiceMockResolved;
    });
    mockOnImportTestCases.mockImplementation((realOnImport) => {
      realOnImport([]);
    });
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      applyDefaults: false,
    }));
    setError.mockClear();

    testCases[0].validResource = true;
    testCases[1].validResource = true;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderTestCaseListComponent(
    mockError = setError,
    errors: string[] = [],
    contextFailure = false
  ) {
    return render(
      <MemoryRouter
        initialEntries={[
          `/measures/${mockMeasure.id}/edit/test-cases/list-page`,
        ]}
      >
        <ApiContextProvider value={serviceConfig}>
          <QdmExecutionContextProvider
            value={{
              measureState: [mockMeasure, setMeasure],
              cqmMeasureState: [cqmMeasure, setCqmMeasure],
              executionContextReady: true,
              executing: false,
              setExecuting: jest.fn(),
              contextFailure: contextFailure,
              setExecutionContextReady: jest.fn(),
            }}
          >
            <Routes>
              <Route path="/measures/:measureId/edit/test-cases/list-page">
                <Route
                  index
                  element={
                    <TestCaseLandingWrapper
                      qdm={true}
                      children={
                        <TestCaseLanding
                          errors={errors}
                          setErrors={mockError}
                          setWarnings={setWarnings}
                          setImportErrors={setImportErrors}
                        />
                      }
                    />
                  }
                />
                <Route
                  path=":criteriaId"
                  element={
                    <TestCaseLandingWrapper
                      qdm={true}
                      children={
                        <TestCaseLanding
                          errors={errors}
                          setErrors={mockError}
                          setWarnings={setWarnings}
                          setImportErrors={setImportErrors}
                        />
                      }
                    />
                  }
                />
              </Route>
              <Route path="/measures/:measureId/edit/test-cases/:id">
                <Route index element={<div data-testid="edit-page" />} />
                <Route
                  path=":id"
                  index
                  element={<div data-testid="edit-page" />}
                />
              </Route>
            </Routes>
          </QdmExecutionContextProvider>
        </ApiContextProvider>
      </MemoryRouter>
    );
  }

  it("should disable Run QDM test case button, if execution context failed", async () => {
    renderTestCaseListComponent(setError, [], true);
    await waitFor(() => {
      const executeButton = screen.getByTestId("execute-test-cases-button");
      expect(executeButton).toHaveProperty("disabled", true);
    });
  });

  it("should render list of test cases", async () => {
    renderTestCaseListComponent();
    await waitFor(() => {
      const table = screen.getByTestId("test-case-tbl");

      const tableHeaders = table.querySelectorAll("thead th");

      expect(tableHeaders[0]).toHaveTextContent("Status");
      expect(tableHeaders[1]).toHaveTextContent("Group");
      expect(tableHeaders[2]).toHaveTextContent("Title");
      expect(tableHeaders[3]).toHaveTextContent("Description");
      expect(tableHeaders[4]).toHaveTextContent("Last Saved");
      expect(tableHeaders[5]).toHaveTextContent("Action");

      const tableRows = table.querySelectorAll("tbody tr");

      expect(tableRows[2]).toHaveTextContent(testCases[0].title);
      expect(tableRows[2]).toHaveTextContent(testCases[0].series);
      expect(
        screen.getByTestId(`select-action-${testCases[0].id}`)
      ).toBeInTheDocument();

      expect(tableRows[1]).toHaveTextContent(testCases[1].title);
      expect(tableRows[1]).toHaveTextContent(testCases[1].series);
      expect(
        screen.getByTestId(`select-action-${testCases[1].id}`)
      ).toBeInTheDocument();
    });
  }, 15000);

  it("should not display error message when fetch test cases fails", async () => {
    const error = {
      message: "Unable to retrieve test cases, please try later.",
    };

    const useTestCaseServiceMockRejected = {
      getTestCasesByMeasureId: jest.fn().mockRejectedValue(error),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockRejected;
    });

    renderTestCaseListComponent();
    expect(screen.queryByTestId("display-tests-error")).not.toBeInTheDocument();
  });

  it("should render delete dialogue on Test Case list page when delete button is clicked", async () => {
    const { getByTestId } = renderTestCaseListComponent();
    await waitFor(() => {
      const selectButton = getByTestId(`select-action-${testCases[0].id}`);
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
    });
    const deleteButton = getByTestId(`delete-test-case-btn-${testCases[0].id}`);
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
    expect(
      screen.getByTestId("delete-dialog-continue-button")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("delete-dialog-cancel-button")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("delete-dialog-cancel-button"));
    await waitFor(() => {
      const submitButton = screen.queryByText("Yes, Delete");
      expect(submitButton).not.toBeInTheDocument();
      expect(measureStore.updateTestCases as jest.Mock).toHaveBeenCalledTimes(
        2
      );
    });
  });

  it("should handle delete error on Test Case list page when delete button is clicked", async () => {
    useTestCaseServiceMock.mockImplementation(() => {
      return {
        ...useTestCaseServiceMockResolved,
        deleteTestCaseByTestCaseId: jest
          .fn()
          .mockRejectedValue(new Error("BAD THINGS")),
      } as unknown as TestCaseServiceApi;
    });

    renderTestCaseListComponent();
    const selectButton = await screen.findByRole("button", {
      name: `select-action-${testCases[0].title}`,
    });
    userEvent.click(selectButton);
    const deleteButton = screen.getByTestId(
      `delete-test-case-btn-${testCases[0].id}`
    );
    userEvent.click(deleteButton);

    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
    const confirmDeleteBtn = screen.getByRole("button", {
      name: "Yes, Delete",
    });
    expect(
      screen.getByTestId("delete-dialog-cancel-button")
    ).toBeInTheDocument();

    userEvent.click(confirmDeleteBtn);
    expect(await screen.findByTestId("test-case-list-error")).toHaveTextContent(
      `Unable to Delete test Case with ID ${testCases[0].id}. Please try again. If the issue continues, please contact helpdesk.`
    );
  });

  it("Should delete all existing test cases", async () => {
    const deleteTestCasesApiMock = jest
      .fn()
      .mockResolvedValue("All Test cases are deleted successfully");
    useTestCaseServiceMock.mockImplementationOnce(() => {
      return {
        ...useTestCaseServiceMockResolved,
        deleteTestCases: deleteTestCasesApiMock,
      } as unknown as TestCaseServiceApi;
    });
    renderTestCaseListComponent();

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows.length).toBe(3);

    const deleteAllButton = screen.getByRole("button", { name: "Delete All" });
    userEvent.click(deleteAllButton);
    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();

    const continueButton = screen.getByRole("button", { name: "Yes, Delete" });
    userEvent.click(continueButton);

    const toastMessage = await screen.findByTestId("test-case-list-success");
    expect(toastMessage).toHaveTextContent("Test cases successfully deleted");
    expect(screen.queryByTestId("delete-dialog-body")).toBeNull();
    expect(deleteTestCasesApiMock).toHaveBeenCalled();
    expect(measureStore.updateTestCases as jest.Mock).toHaveBeenCalledTimes(3);
  });

  it("Should hide delete all dialogue when cancel is clicked", async () => {
    const deleteTestCasesApiMock = jest
      .fn()
      .mockResolvedValue("All Test cases are deleted successfully");
    useTestCaseServiceMock.mockImplementation(() => {
      return {
        ...useTestCaseServiceMockResolved,
        deleteTestCases: deleteTestCasesApiMock,
      } as unknown as TestCaseServiceApi;
    });
    renderTestCaseListComponent();

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows.length).toBe(3);

    const deleteAllButton = screen.getByRole("button", { name: "Delete All" });
    userEvent.click(deleteAllButton);
    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
    expect(screen.getByText("Yes, Delete")).toBeInTheDocument();

    expect(screen.getByText("Delete All Test Cases")).toBeInTheDocument();
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    userEvent.click(cancelButton);

    await waitFor(() =>
      expect(
        screen.queryByText("Delete All Test Cases")
      ).not.toBeInTheDocument()
    );
    expect(deleteTestCasesApiMock).not.toHaveBeenCalled();
  });
  //
  it("Should throw error message for delete all existing test cases", async () => {
    useTestCaseServiceMock.mockReset().mockImplementation(() => {
      return {
        ...useTestCaseServiceMockResolved,
        deleteTestCases: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: "Unable to delete test cases.",
            },
          },
        }),
      } as unknown as TestCaseServiceApi;
    });
    renderTestCaseListComponent();
    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows.length).toBe(3);

    const deleteAllButton = screen.getByRole("button", { name: "Delete All" });
    userEvent.click(deleteAllButton);
    expect(await screen.findByTestId("delete-dialog")).toBeInTheDocument();

    const continueButton = screen.getByRole("button", { name: "Yes, Delete" });
    userEvent.click(continueButton);

    expect(screen.queryByTestId("delete-dialog-body")).toBeNull();

    expect(await screen.findByTestId("test-case-list-error")).toHaveTextContent(
      "Unable to Delete All test Cases. Please try again. If the issue continues, please contact helpdesk."
    );
  });

  it("Should disable delete all button", async () => {
    mockMeasure.testCases = [];
    renderTestCaseListComponent();

    expect(
      await screen.findByRole("button", {
        name: "Delete All",
      })
    ).toBeDisabled();
  });

  it("should clone a test case when the clone button is clicked", async () => {
    const createTestCaseApiMock = jest.fn().mockResolvedValue({});
    const getTestCasesByMeasureIdMock = jest.fn().mockResolvedValue(testCases);
    useTestCaseServiceMock.mockImplementation(() => {
      return {
        ...useTestCaseServiceMockResolved,
        getTestCasesByMeasureId: getTestCasesByMeasureIdMock,
        createTestCase: createTestCaseApiMock,
      } as unknown as TestCaseServiceApi;
    });
    renderTestCaseListComponent();
    await waitFor(() => {
      expect(getTestCasesByMeasureIdMock).toHaveBeenCalled();
      const selectButton = screen.getByTestId(
        `select-action-${testCases[0].id}`
      );
      expect(selectButton).toBeInTheDocument();
      userEvent.click(selectButton);
    });
    const cloneButton = screen.getByTestId(
      `clone-test-case-btn-${testCases[0].id}`
    );
    userEvent.click(cloneButton);

    await waitFor(() => {
      expect(createTestCaseApiMock).toHaveBeenCalled();
      expect(getTestCasesByMeasureIdMock).toHaveBeenCalled();
      expect(
        screen.getByText("Test case cloned successfully")
      ).toBeInTheDocument();
    });
  });

  it("should display an error toast when the clone button is clicked", async () => {
    const createTestCaseApiMock = jest
      .fn()
      .mockRejectedValueOnce(new Error("RANDOM ERROR"));
    const getTestCasesByMeasureIdMock = jest.fn().mockResolvedValue(testCases);
    useTestCaseServiceMock.mockImplementation(() => {
      return {
        ...useTestCaseServiceMockResolved,
        getTestCasesByMeasureId: getTestCasesByMeasureIdMock,
        createTestCase: createTestCaseApiMock,
      } as unknown as TestCaseServiceApi;
    });
    renderTestCaseListComponent();
    await waitFor(() => {
      expect(getTestCasesByMeasureIdMock).toHaveBeenCalled();
      const selectButton = screen.getByTestId(
        `select-action-${testCases[0].id}`
      );
      expect(selectButton).toBeInTheDocument();
      userEvent.click(selectButton);
    });
    const cloneButton = screen.getByTestId(
      `clone-test-case-btn-${testCases[0].id}`
    );
    userEvent.click(cloneButton);

    await waitFor(() => {
      expect(createTestCaseApiMock).toHaveBeenCalled();
      expect(getTestCasesByMeasureIdMock).toHaveBeenCalled();
      expect(
        screen.getByText(
          "An error occurred while cloning the test case: RANDOM ERROR"
        )
      ).toBeInTheDocument();
    });
  });

  it("should navigate to the Test Case details page on edit button click", async () => {
    renderTestCaseListComponent();

    await waitFor(() => {
      const selectButton = screen.getByTestId(
        `select-action-${testCases[0].id}`
      );
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
    });
    const editButton = screen.getByTestId(
      `view-edit-test-case-${testCases[0].id}`
    );
    fireEvent.click(editButton);
    const editPage = await screen.findByTestId("edit-page");
    expect(editPage).toBeInTheDocument();
  });

  it("should navigate to the Test Case details page on edit button click for shared user", async () => {
    renderTestCaseListComponent();
    await waitFor(() => {
      const selectButton = screen.getByTestId(
        `select-action-${testCases[0].id}`
      );
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
    });
    const editButton = screen.getByTestId(
      `view-edit-test-case-${testCases[0].id}`
    );
    fireEvent.click(editButton);
    const editPage = await screen.findByTestId("edit-page");
    expect(editPage).toBeInTheDocument();
  });

  it("should navigate to the Test Case details page on view button click for non-owner", async () => {
    mockMeasure.createdBy = "AnotherUser";
    renderTestCaseListComponent();

    await waitFor(() => {
      const selectButton = screen.getByTestId(
        `select-action-${testCases[0].id}`
      );
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
    });
    const viewButton = screen.getByTestId(
      `view-edit-test-case-${testCases[0].id}`
    );
    fireEvent.click(viewButton);
    const editPage = await screen.findByTestId("edit-page");
    expect(editPage).toBeInTheDocument();
  });

  it("should execute test cases", async () => {
    mockMeasure.createdBy = MEASURE_CREATEDBY;
    renderTestCaseListComponent();

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows[2]).toHaveTextContent("N/A");
      expect(tableRows[1]).toHaveTextContent("N/A");
      expect(tableRows[0]).toHaveTextContent("Invalid");
    });

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });

    userEvent.click(executeAllTestCasesButton);
    await waitFor(() => {
      expect(tableRows[2]).toHaveTextContent("Pass");
      expect(tableRows[1]).toHaveTextContent("Fail");
      expect(tableRows[0]).toHaveTextContent("Invalid");
    });

    userEvent.click(screen.getByTestId("coverage-tab"));
    userEvent.click(screen.getByTestId("passing-tab"));
    expect(screen.getByTestId("test-case-tbl")).toBeInTheDocument();
  });

  it("accordions for cql parts", async () => {
    mockMeasure.createdBy = MEASURE_CREATEDBY;
    renderTestCaseListComponent();

    userEvent.click(await screen.findByTestId("coverage-tab"));
    const coverageTabList = await screen.findByTestId("coverage-tab-list");
    expect(coverageTabList).toBeInTheDocument();
    const allAccordions = await screen.findAllByTestId("accordion");
    expect(allAccordions[0]).toBeInTheDocument();
    const firstAccordion = screen.queryByText("Initial Population");
    expect(firstAccordion).toBeInTheDocument();
    const definitionsAccordion = screen.queryByText("Definitions");
    expect(definitionsAccordion).toBeInTheDocument();
    const unUsedDefinitionAccordion = screen.queryByText("Unused");
    expect(unUsedDefinitionAccordion).toBeInTheDocument();
    const functionsAccordion = screen.queryByText("Functions");
    expect(functionsAccordion).toBeInTheDocument();

    const definitionSection = await screen.findByTestId(
      "Definitions-definition"
    );

    expect(definitionSection).toBeInTheDocument();
    const definitionAccordionButton = await screen.findByRole("button", {
      name: "Definitions",
    });
    userEvent.click(definitionAccordionButton);

    const definitionsMessage = within(definitionSection).getByText(
      "No results available"
    );
    expect(definitionsMessage).toBeInTheDocument();

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });

    userEvent.click(executeAllTestCasesButton);

    const unusedSectionButton = await screen.findByRole("button", {
      name: "Unused",
    });
    userEvent.click(unusedSectionButton);

    const unusedSection = screen.getByTestId("Unused-definition");
    const unusedMessage = within(unusedSection).getByText(
      "No results available"
    );
    expect(unusedMessage).toBeInTheDocument();
  });
  it("should display export qrda button with feature flag set to true", async () => {
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({}));
    renderTestCaseListComponent();
    await waitFor(() => {
      const qrdaExportButton = screen.getByTestId(
        "show-export-test-cases-button"
      );
      expect(qrdaExportButton).toBeInTheDocument();
    });
  });
  it("should trigger tooltip when disabled", async () => {
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({}));
    renderTestCaseListComponent();
    await waitFor(() => {
      const qrdaExportButton = screen.getByTestId(
        "show-export-test-cases-button"
      );
      expect(qrdaExportButton).toBeDisabled();
    });
    const toolTip = screen.queryByTestId(
      "show-export-test-case-button-tooltip"
    );
    await waitFor(() => {
      expect(toolTip).toHaveClass("hidden");
    });
    const focusTrap = screen.getByTestId("export-button-focus-trap");
    //focus
    fireEvent.focus(focusTrap);
    await waitFor(() => {
      expect(toolTip).not.toHaveClass("hidden");
    });
    //blur
    act(() => {
      fireEvent.blur(focusTrap);
    });
    await waitFor(() => {
      expect(toolTip).toHaveClass("hidden");
    });
    //enter
    act(() => {
      fireEvent.mouseEnter(focusTrap);
    });
    await waitFor(() => {
      expect(toolTip).not.toHaveClass("hidden");
    });
    //leave
    act(() => {
      fireEvent.mouseLeave(focusTrap);
    });
    await waitFor(() => {
      expect(toolTip).toHaveClass("hidden");
    });
    act(() => {
      fireEvent.mouseEnter(focusTrap);
    });
    await waitFor(() => {
      expect(toolTip).not.toHaveClass("hidden");
    });
    act(() => {
      fireEvent.keyDown(focusTrap, {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        charCode: 27,
      });
    });
    await waitFor(() => {
      expect(toolTip).toHaveClass("hidden");
    });
  });

  it("should not display export qrda button", async () => {
    renderTestCaseListComponent();
    await waitFor(() => {
      const qrdaExportButton = screen.queryByTestId(
        "show-export-test-cases-button"
      );
      expect(qrdaExportButton).not.toBeInTheDocument();
    });
  });
  it("should display success message when QRDA Export button clicked", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({}));
    const useTestCaseServiceMockResolve = {
      getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
      exportQRDA: jest.fn().mockResolvedValue("test qrda"),
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockResolve;
    });
    mockMeasure.cqlErrors = false;
    mockMeasure.errors = [];
    renderTestCaseListComponent();
    await screen.findByTestId("test-case-tbl");

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });
    await waitFor(() => {
      expect(executeAllTestCasesButton).toBeEnabled();
    });
    userEvent.click(executeAllTestCasesButton);
    await waitFor(() => {
      expect(
        qdmCalculationServiceMockResolved.calculateQdmTestCases
      ).toHaveBeenCalled();
    });

    const qrdaExportButton = screen.getByTestId(
      "show-export-test-cases-button"
    );
    await waitFor(() => {
      expect(qrdaExportButton).toBeEnabled();
    });
    userEvent.click(qrdaExportButton);

    //popover opens
    const popoverButton = screen.getByTestId("export-qrda-1");
    expect(popoverButton).toBeVisible();
    act(() => {
      fireEvent.keyDown(popoverButton, {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        charCode: 27,
      });
    });

    expect(screen.queryByTestId("export-qrda-1")).not.toBeVisible();
  });

  it("should display success message when QRDA Export button clicked", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({}));
    const useTestCaseServiceMockResolve = {
      getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
      exportQRDA: jest.fn().mockResolvedValue("test qrda"),
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockResolve;
    });
    mockMeasure.cqlErrors = false;
    mockMeasure.errors = [];
    renderTestCaseListComponent();
    await screen.findByTestId("test-case-tbl");

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });
    await waitFor(() => {
      expect(executeAllTestCasesButton).toBeEnabled();
    });
    userEvent.click(executeAllTestCasesButton);
    await waitFor(() => {
      expect(
        qdmCalculationServiceMockResolved.calculateQdmTestCases
      ).toHaveBeenCalled();
    });

    const qrdaExportButton = screen.getByTestId(
      "show-export-test-cases-button"
    );
    await waitFor(() => {
      expect(qrdaExportButton).toBeEnabled();
    });
    userEvent.click(qrdaExportButton);
    //popover opens
    const popoverButton = screen.getByTestId("export-qrda-1");
    userEvent.click(popoverButton);
    await waitFor(() => {
      expect(
        screen.getByText("QRDA exported successfully")
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.keyDown(screen.getByText("QRDA exported successfully"), {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        charCode: 27,
      });
    });

    expect(
      screen.queryByText("QRDA exported successfully")
    ).not.toBeInTheDocument();
  });

  it("should display error message when QRDA Export failed", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({}));
    const useTestCaseServiceMockReject = {
      getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
      exportQRDA: jest
        .fn()
        .mockRejectedValue(new Error("Unable to Export QRDA.")),
    } as unknown as TestCaseServiceApi;
    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockReject;
    });

    renderTestCaseListComponent();
    await screen.findByTestId("test-case-tbl");
    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });
    await waitFor(() => {
      expect(executeAllTestCasesButton).toBeEnabled();
    });
    userEvent.click(executeAllTestCasesButton);
    await waitFor(() => {
      expect(
        qdmCalculationServiceMockResolved.calculateQdmTestCases
      ).toHaveBeenCalled();
    });

    const qrdaExportButton = screen.getByTestId(
      "show-export-test-cases-button"
    );
    await waitFor(() => {
      expect(qrdaExportButton).toBeEnabled();
    });
    userEvent.click(qrdaExportButton);

    await waitFor(() => {
      const qrdaExportButton = screen.getByTestId(
        "show-export-test-cases-button"
      );
      expect(qrdaExportButton).toBeEnabled();
      userEvent.click(qrdaExportButton);
      const popoverButton = screen.getByTestId("export-qrda-1"); // fail
      userEvent.click(popoverButton);
    });
    expect(await screen.findByTestId("test-case-list-error")).toHaveTextContent(
      "Unable to Export QRDA. Please try again. If the issue continues, please contact helpdesk."
    );
  });

  it("should display Excel Export button", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({}));
    const useTestCaseServiceMockResolve = {
      getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockResolve;
    });
    mockMeasure.cqlErrors = false;
    mockMeasure.errors = [];
    renderTestCaseListComponent();
    await screen.findByTestId("test-case-tbl");

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });
    await waitFor(() => {
      expect(executeAllTestCasesButton).toBeEnabled();
    });
    userEvent.click(executeAllTestCasesButton);
    await waitFor(() => {
      expect(
        qdmCalculationServiceMockResolved.calculateQdmTestCases
      ).toHaveBeenCalled();
    });

    const excelExportButton = screen.getByTestId(
      "show-export-test-cases-button"
    );
    await waitFor(() => {
      expect(excelExportButton).toBeEnabled();
    });
    userEvent.click(excelExportButton);

    //popover opens
    const popoverButton = screen.getByTestId("export-excel-1");
    expect(popoverButton).toBeVisible();
    act(() => {
      fireEvent.keyDown(popoverButton, {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        charCode: 27,
      });
    });

    expect(screen.queryByTestId("export-excel-1")).not.toBeVisible();
  });

  it("should display success message when Excel Export button clicked", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({}));
    const useTestCaseServiceMockResolve = {
      getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockResolve;
    });

    const useExcelExportServiceMockResolved = {
      generateExcel: jest.fn().mockResolvedValue("test excel"),
    } as unknown as ExcelExportService;

    useExcelExportServiceMock.mockImplementation(() => {
      return useExcelExportServiceMockResolved;
    });

    mockMeasure.cqlErrors = false;
    mockMeasure.errors = [];
    renderTestCaseListComponent();
    await screen.findByTestId("test-case-tbl");

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });
    await waitFor(() => {
      expect(executeAllTestCasesButton).toBeEnabled();
    });
    userEvent.click(executeAllTestCasesButton);
    await waitFor(() => {
      expect(
        qdmCalculationServiceMockResolved.calculateQdmTestCases
      ).toHaveBeenCalled();
    });

    const excelExportButton = screen.getByTestId(
      "show-export-test-cases-button"
    );
    await waitFor(() => {
      expect(excelExportButton).toBeEnabled();
    });
    userEvent.click(excelExportButton);
    //popover opens
    const popoverButton = screen.getByTestId("export-excel-1");
    userEvent.click(popoverButton);
    await waitFor(() => {
      expect(
        screen.getByText("Excel exported successfully")
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.keyDown(screen.getByText("Excel exported successfully"), {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        charCode: 27,
      });
    });

    expect(
      screen.queryByText("Excel exported successfully")
    ).not.toBeInTheDocument();
  });

  it("should display failed message when Excel Export failed", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({}));
    const useTestCaseServiceMockResolve = {
      getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockResolve;
    });

    const useExcelExportServiceMockRejected = {
      generateExcel: jest
        .fn()
        .mockRejectedValue(new AxiosError("Excel export failed")),
    } as unknown as ExcelExportService;

    useExcelExportServiceMock.mockImplementation(() => {
      return useExcelExportServiceMockRejected;
    });

    const errorMessage =
      "Excel export failed. Please try again. If the issue continues, please contact helpdesk.";

    mockMeasure.cqlErrors = false;
    mockMeasure.errors = [];
    renderTestCaseListComponent();
    await screen.findByTestId("test-case-tbl");

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });
    await waitFor(() => {
      expect(executeAllTestCasesButton).toBeEnabled();
    });
    userEvent.click(executeAllTestCasesButton);
    await waitFor(() => {
      expect(
        qdmCalculationServiceMockResolved.calculateQdmTestCases
      ).toHaveBeenCalled();
    });

    const excelExportButton = screen.getByTestId(
      "show-export-test-cases-button"
    );
    await waitFor(() => {
      expect(excelExportButton).toBeEnabled();
    });
    userEvent.click(excelExportButton);
    //popover opens
    const popoverButton = screen.getByTestId("export-excel-1");
    userEvent.click(popoverButton);
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.keyDown(screen.getByText(errorMessage), {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        charCode: 27,
      });
    });

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });

  it("should display failed message when getDefinitionCallstacks failed", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({}));
    const useTestCaseServiceMockResolve = {
      getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockResolve;
    });

    const useCqlParsingServiceMockRejected = {
      getAllDefinitionsAndFunctions: jest.fn().mockResolvedValue(qdmCallStack),
      getDefinitionCallstacks: jest
        .fn()
        .mockRejectedValue("qdmCallStack failed"),
    } as unknown as QdmCqlParsingService;

    useCqlParsingServiceMock.mockImplementation(() => {
      return useCqlParsingServiceMockRejected;
    });

    const errorMessage =
      "Error while Parsing CQL for callStack, Please try again. If the issue continues, please contact helpdesk.";

    mockMeasure.cqlErrors = false;
    mockMeasure.errors = [];
    renderTestCaseListComponent();
    await screen.findByTestId("test-case-tbl");

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });
    await waitFor(() => {
      expect(executeAllTestCasesButton).toBeEnabled();
    });
    userEvent.click(executeAllTestCasesButton);
    await waitFor(() => {
      expect(
        qdmCalculationServiceMockResolved.calculateQdmTestCases
      ).toHaveBeenCalled();
    });

    const excelExportButton = screen.getByTestId(
      "show-export-test-cases-button"
    );
    await waitFor(() => {
      expect(excelExportButton).toBeEnabled();
    });
    userEvent.click(excelExportButton);
    //popover opens
    const popoverButton = screen.getByTestId("export-excel-1");
    userEvent.click(popoverButton);
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.keyDown(screen.getByText(errorMessage), {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        charCode: 27,
      });
    });

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });

  it("Should display errors on test cases with special characters", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({}));
    const failedExports = [...testCases];
    testCases[0].title = "~title";
    testCases[1].series = "+series";

    const useTestCaseServiceMockReject = {
      getTestCasesByMeasureId: jest.fn().mockResolvedValue(failedExports),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
      exportQRDA: jest
        .fn()
        .mockRejectedValue(new Error("Unable to Export QRDA.")),
    } as unknown as TestCaseServiceApi;
    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockReject;
    });
    const setErrorMock2 = jest.fn();
    renderTestCaseListComponent(setErrorMock2);
    await screen.findByTestId("test-case-tbl");
    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });
    await waitFor(() => {
      expect(executeAllTestCasesButton).toBeEnabled();
    });
    userEvent.click(executeAllTestCasesButton);
    await waitFor(() => {
      expect(
        qdmCalculationServiceMockResolved.calculateQdmTestCases
      ).toHaveBeenCalled();
    });

    const qrdaExportButton = screen.getByTestId(
      "show-export-test-cases-button"
    );
    await waitFor(() => {
      expect(qrdaExportButton).toBeEnabled();
    });

    userEvent.click(qrdaExportButton);

    await waitFor(() => {
      const qrdaExportButton = screen.getByTestId(
        "show-export-test-cases-button"
      );
      expect(qrdaExportButton).toBeEnabled();
      userEvent.click(qrdaExportButton);
      const popoverButton = screen.getByTestId("export-qrda-1");
      userEvent.click(popoverButton);
    });
    await waitFor(() => expect(setErrorMock2).toHaveBeenCalled());
  });

  it("Run Test Cases button should be disabled if no valid test cases", async () => {
    mockMeasure.createdBy = MEASURE_CREATEDBY;
    testCases[0].validResource = false;
    testCases[1].validResource = false;
    renderTestCaseListComponent();

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows[0]).toHaveTextContent("Invalid");
      expect(tableRows[1]).toHaveTextContent("Invalid");
      expect(tableRows[2]).toHaveTextContent("Invalid");
    });

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });

    expect(executeAllTestCasesButton).toBeDisabled();
  });

  it("should not render execute button for user who is not the owner of the measure", () => {
    mockMeasure.createdBy = "AnotherUser";
    renderTestCaseListComponent();
    const executeAllTestCasesButton = screen.queryByText(
      "execute-test-cases-button"
    );
    expect(executeAllTestCasesButton).not.toBeInTheDocument();
  });

  it("should not display error message when test cases calculation fails", async () => {
    mockMeasure.createdBy = MEASURE_CREATEDBY;
    const error = {
      message: "Unable to calculate test case.",
    };

    const qdmCalculationServiceMockRejected = {
      calculateTestCases: jest.fn().mockRejectedValue(error),
    } as unknown as QdmCalculationService;

    qdmCalculationServiceMock.mockImplementation(() => {
      return qdmCalculationServiceMockRejected;
    });

    const { getByTestId } = renderTestCaseListComponent();

    await waitFor(async () => {
      const executeAllTestCasesButton = getByTestId(
        "execute-test-cases-button"
      );
      userEvent.click(executeAllTestCasesButton);

      const errorMessage = screen.queryByTestId("display-tests-error");
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  it("should render list of test cases and truncate title and series", async () => {
    const testCases = [
      {
        id: "9010",
        description: "Test IPP",
        title:
          "1bcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxy",
        series:
          "2bcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxy",
        lastModifiedAt: "2024-09-10T10:57:14.382Z",
      },
    ];

    const useTestCaseServiceMockResolved = {
      getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockResolved;
    });

    renderTestCaseListComponent();

    const table = await screen.findByTestId("test-case-tbl");
    const tableHeaders = table.querySelectorAll("thead th");

    expect(tableHeaders[0]).toHaveTextContent("Status");
    expect(tableHeaders[1]).toHaveTextContent("Group");
    expect(tableHeaders[2]).toHaveTextContent("Title");
    expect(tableHeaders[3]).toHaveTextContent("Description");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[0]).toHaveTextContent(testCases[0].title.substring(0, 59));
    expect(tableRows[0]).toHaveTextContent(
      testCases[0].series.substring(0, 59)
    );

    const seriesButton = await screen.findByTestId(
      `test-case-series-${testCases[0].id}-button`
    );
    expect(seriesButton).toBeInTheDocument();
    fireEvent.mouseOver(seriesButton);
    expect(
      await screen.findByRole("button", {
        name: testCases[0].series,
        hidden: true,
      })
    ).toBeVisible();

    const titleButton = screen.getByTestId(
      `test-case-title-${testCases[0].id}-button`
    );
    expect(titleButton).toBeInTheDocument();
    fireEvent.mouseOver(titleButton);
    expect(
      await screen.findByRole(
        "button",
        {
          name: testCases[0].title,
          hidden: true,
        },
        { timeout: 3000 }
      )
    ).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText(testCases[0].title)).toBeInTheDocument()
    );
  });

  it("should render New Test Case button and navigate to the Create New Test Case page when button clicked", async () => {
    const { getByTestId } = renderTestCaseListComponent();
    const passingTab = await screen.findByTestId("passing-tab");
    expect(passingTab).toBeInTheDocument();
    const testCaseList = await screen.findByTestId("test-case-tbl");
    expect(testCaseList).toBeInTheDocument();

    await waitFor(() => {
      const createNewButton = getByTestId("create-new-test-case-button");
      fireEvent.click(createNewButton);

      expect(getByTestId("create-test-case-dialog")).toBeInTheDocument();
    });

    const coverageTab = await screen.findByTestId("coverage-tab");
    expect(coverageTab).toBeInTheDocument();
  });

  it("should not render New Test Case button for user who is not the owner of the measure", () => {
    mockMeasure.createdBy = "AnotherUser";
    renderTestCaseListComponent();
    const createNewTestCaseButton = screen.queryByText(
      "create-new-test-case-button"
    );
    expect(createNewTestCaseButton).not.toBeInTheDocument();
  });

  it("disables execute button when trying to execute test cases when Measure CQL errors exist", async () => {
    mockMeasure.createdBy = MEASURE_CREATEDBY;
    mockMeasure.cqlErrors = true;
    renderTestCaseListComponent();
    await screen.findByTestId("test-case-tbl");
    expect(screen.getByRole("button", { name: "Run Test(s)" })).toBeDisabled();
  });

  // TODO: fix test. broken in MAT-5945.
  it("defaults pop criteria nav link to first pop criteria on load", async () => {
    mockMeasure.cqlErrors = false;
    renderTestCaseListComponent();
    mockMeasure.groups = [
      ...mockMeasure.groups,
      {
        id: "2",
        scoring: MeasureScoring.COHORT,
        populationBasis: "boolean",
        populations: [
          {
            id: "id-1",
            name: PopulationType.INITIAL_POPULATION,
            definition: "ipp",
          },
        ],
        measureGroupTypes: [],
      },
    ];

    // wait for pop criteria to load
    await waitFor(() => {
      const criteria1NavTab = screen.getByText("Population Criteria 1");
      expect(criteria1NavTab.getAttribute("aria-selected")).toBe("true");
    });

    // wait for test cases to load
    await waitFor(() => {
      expect(screen.getAllByText("N/A").length).toEqual(2);
    });

    // wait for execution context to be ready
    const executeButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });
    await waitFor(() => {
      expect(executeButton).not.toBeDisabled();
    });

    userEvent.click(executeButton);
    await waitFor(() => expect(screen.getByText("100%")).toBeInTheDocument());

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows[2]).toHaveTextContent("Pass");
      expect(tableRows[1]).toHaveTextContent("Fail");
      expect(tableRows[0]).toHaveTextContent("Invalid");
    });
  });

  // to do: Fix this test. broken in MAT-5945.
  it.skip("updates all results when pop criteria tab is changed", async () => {
    mockMeasure.cqlErrors = false;
    mockMeasure.groups = [
      ...mockMeasure.groups,
      {
        id: "2",
        scoring: MeasureScoring.COHORT,
        populationBasis: "boolean",
        populations: [
          {
            id: "id-1",
            name: PopulationType.INITIAL_POPULATION,
            definition: "ipp",
          },
        ],
        measureGroupTypes: [],
      },
    ];
    renderTestCaseListComponent();

    // wait for pop criteria to load
    await waitFor(() => {
      expect(screen.getByText("Population Criteria 1")).toBeInTheDocument();
      expect(screen.getAllByText("N/A").length).toEqual(2);
    });

    // wait for execution context to be ready
    const executeButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });

    await waitFor(() => expect(executeButton).not.toBeDisabled());

    userEvent.click(executeButton);
    await waitFor(() => expect(screen.getByText("50%")).toBeInTheDocument());

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows[0]).toHaveTextContent("Pass");
      expect(tableRows[1]).toHaveTextContent("Fail");
      expect(tableRows[2]).toHaveTextContent("Invalid");
    });

    mockProcessTestCaseResults.mockClear().mockImplementation((testCase) => {
      return {
        ...failingTestCaseResults.find((tc) => tc.id === testCase.id),
        executionStatus: "pass",
      };
    });

    mockGetPassingPercentageForTestCases
      .mockClear()
      .mockReturnValue({ passPercentage: 66, passFailRatio: "2/3" });

    const popCriteria2 = screen.getByText("Population Criteria 2");
    expect(popCriteria2).toBeInTheDocument();
    userEvent.click(popCriteria2);
    // what broke here.
    const table2 = await screen.findByTestId("test-case-tbl");
    const tableRows2 = table2.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows2[0]).toHaveTextContent("Pass");
      expect(tableRows2[1]).toHaveTextContent("Pass");
      expect(tableRows2[2]).toHaveTextContent("Invalid");
    });

    expect(screen.getByText("Passing (2/3)")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByTestId("sr-div")).toBeInTheDocument();
  });

  it("should hide the button for import test cases when feature is disabled", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);

    renderTestCaseListComponent();
    const importBtn = screen.queryByRole("button", {
      name: /Import from Bonnie/i,
    });
    expect(importBtn).not.toBeInTheDocument();
  });

  // here down broke
  it("should have a disabled button for import test cases when feature is enabled but user cannot edit", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => false);

    renderTestCaseListComponent();
    const importBtn = await screen.findByRole("button", {
      name: /Import from Bonnie/i,
    });
    expect(importBtn).toBeInTheDocument();
    expect(importBtn).toBeDisabled();
  });

  it("should have a enabled button for import test cases when feature is enabled and user can edit", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);

    renderTestCaseListComponent();
    const importBtn = await screen.findByRole("button", {
      name: /Import from Bonnie/i,
    });
    expect(importBtn).toBeInTheDocument();
    await waitFor(() => expect(importBtn).not.toBeDisabled());
  });

  it("should display import dialog when import button is clicked", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);

    let nextState;
    setImportErrors.mockImplementation((callback) => {
      nextState = callback([IMPORT_ERROR]);
    });

    renderTestCaseListComponent();
    const showImportBtn = await screen.findByRole("button", {
      name: /Import from Bonnie/i,
    });
    expect(showImportBtn).toBeInTheDocument();
    await waitFor(() => expect(showImportBtn).not.toBeDisabled());
    userEvent.click(showImportBtn);
    const importDialog = await screen.findByTestId("test-case-import-dialog");
    expect(importDialog).toBeInTheDocument();
    const importBtn = within(importDialog).getByRole("button", {
      name: "Import",
    });
    expect(importBtn).toBeInTheDocument();
    userEvent.click(importBtn);
    const removedImportDialog = screen.queryByTestId("test-case-import-dialog");
    expect(removedImportDialog).not.toBeInTheDocument();
    expect(nextState).toEqual([]);
  });

  it("should display import error when importTestCasesQDM call fails", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);

    const useTestCaseServiceMockRejected = {
      getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
      importTestCasesQDM: jest
        .fn()
        .mockRejectedValueOnce(new Error("BAD THINGS")),
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockRejected;
    });

    renderTestCaseListComponent();
    const showImportBtn = await screen.findByRole("button", {
      name: /Import from Bonnie/i,
    });
    await waitFor(() => expect(showImportBtn).not.toBeDisabled());
    userEvent.click(showImportBtn);
    const importDialog = await screen.findByTestId("test-case-import-dialog");
    expect(importDialog).toBeInTheDocument();
    const importBtn = within(importDialog).getByRole("button", {
      name: "Import",
    });
    userEvent.click(importBtn);
    const removedImportDialog = screen.queryByTestId("test-case-import-dialog");
    expect(removedImportDialog).not.toBeInTheDocument();
    expect(await screen.findByTestId("test-case-list-error")).toHaveTextContent(
      IMPORT_ERROR
    );
  });

  it("should display warning messages when importTestCasesQDM call succeeds with warnings", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);

    const useTestCaseServiceMockRejected = {
      getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
      importTestCasesQDM: jest.fn().mockResolvedValue({
        data: [
          {
            message:
              "The measure populations do not match the populations in the import file. The Test Case has been imported, but no expected values have been set.",
            patientId: "testid1",
            successful: true,
          },
          {
            message:
              "The measure populations do not match the populations in the import file. The Test Case has been imported, but no expected values have been set.",
            patientId: "testid2",
            successful: true,
          },
        ],
      }),
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockRejected;
    });

    renderTestCaseListComponent();
    const showImportBtn = await screen.findByRole("button", {
      name: /Import from Bonnie/i,
    });
    await waitFor(() => expect(showImportBtn).not.toBeDisabled());
    userEvent.click(showImportBtn);
    const importDialog = await screen.findByTestId("test-case-import-dialog");
    expect(importDialog).toBeInTheDocument();

    await waitFor(async () => {
      const importBtn = within(importDialog).getByRole("button", {
        name: "Import",
      });
      expect(importBtn).toBeEnabled();
      userEvent.click(importBtn);
      expect(setWarnings).toHaveBeenCalled();
    });
  });

  it("should display success message when importTestCasesQDM call succeeds without", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);

    const useTestCaseServiceMockRejected = {
      getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
      importTestCasesQDM: jest.fn().mockResolvedValue({
        data: [
          { patientId: "testid1", successful: true },
          { patientId: "testid2", successful: true },
        ],
      }),
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockRejected;
    });

    mockOnImportTestCases.mockImplementation((realOnImport) =>
      realOnImport([
        {
          patientId: "patient1ID",
          json: JSON.stringify(bonnieQdmTestCases[0]),
        },
        {
          patientId: "patient2ID",
          json: JSON.stringify(bonnieQdmTestCases[0]),
        },
        {
          patientId: "patient3ID",
          json: JSON.stringify({
            expectedValues: [
              {
                population_index: 0,
                IPP: 1,
                DENOM: 1,
                DENEX: 1,
                NUMER: 0,
                NUMEX: 0,
                DENOM_OBSERV: [],
                NUMER_OBSERV: [],
              },
            ],
            familyName: "DENEXPass",
            givenNames: ["FirstAvgDrink3PerDayB4MPSecondDuringMP"],
            notes:
              "Female, 60 years and 6 months, qualifying encounter. Two drinks assessment both indicating 3 drinks per day. First started before MP and second during MP.",
            provider_ids: [],
          }),
        },
        {
          patientId: "patient4ID",
          json: null,
        },
      ])
    );

    renderTestCaseListComponent();
    const showImportBtn = await screen.findByRole("button", {
      name: /Import from Bonnie/i,
    });
    await waitFor(() => expect(showImportBtn).not.toBeDisabled());
    userEvent.click(showImportBtn);
    const importDialog = await screen.findByTestId("test-case-import-dialog");
    expect(importDialog).toBeInTheDocument();

    await waitFor(async () => {
      const importBtn = within(importDialog).getByRole("button", {
        name: "Import",
      });
      expect(importBtn).toBeEnabled();
      userEvent.click(importBtn);
      expect(screen.getByText("(2) Test cases imported successfully"));
    });
    expect(
      useTestCaseServiceMockRejected.importTestCasesQDM
    ).toHaveBeenCalled();
    const importMockArgs = (
      useTestCaseServiceMockRejected.importTestCasesQDM as jest.Mock
    ).mock.calls[0];
    const testCasesArg = importMockArgs[1];
    expect(testCasesArg[0].patientId).toEqual("patient1ID");
    expect(testCasesArg[0].json).toBeTruthy();
    expect(JSON.parse(testCasesArg[0].json)?.qdmPatient?._id).toBeTruthy();
    expect(testCasesArg[1].patientId).toEqual("patient2ID");
    expect(testCasesArg[1].json).toBeTruthy();
    expect(JSON.parse(testCasesArg[1].json)?.qdmPatient?._id).toBeTruthy();
    expect(testCasesArg[2].patientId).toEqual("patient3ID");
    expect(testCasesArg[2].json).toBeTruthy();
    expect(JSON.parse(testCasesArg[2].json)?.qdmPatient).toBeFalsy();
    expect(testCasesArg[3].patientId).toEqual("patient4ID");
    expect(testCasesArg[3].json).toBeFalsy();
  });

  it("should close import dialog when cancel button is clicked", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);

    let nextState;
    setImportErrors.mockImplementation((callback) => {
      nextState = callback([]);
    });
    renderTestCaseListComponent(setError, [IMPORT_ERROR]);
    const showImportBtn = await screen.findByRole("button", {
      name: /Import from Bonnie/i,
    });
    expect(showImportBtn).toBeInTheDocument();
    await waitFor(() => expect(showImportBtn).not.toBeDisabled());
    userEvent.click(showImportBtn);
    const importDialog = await screen.findByTestId("test-case-import-dialog");
    expect(importDialog).toBeInTheDocument();
    const cancelBtn = within(importDialog).getByRole("button", {
      name: "Cancel",
    });
    expect(cancelBtn).toBeInTheDocument();
    userEvent.click(cancelBtn);

    await waitFor(() => {
      expect(
        screen.queryByTestId("test-case-import-dialog")
      ).not.toBeInTheDocument();
    });
    expect(setImportErrors).toHaveBeenCalled();
    expect(nextState).toEqual([]);
  });

  it("should disable execute button if CQL Return type mismatch error exists on measure", async () => {
    mockMeasure.createdBy = MEASURE_CREATEDBY;
    mockMeasure.errors = [
      MeasureErrorType.MISMATCH_CQL_POPULATION_RETURN_TYPES,
    ];
    renderTestCaseListComponent();

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows[2]).toHaveTextContent("N/A");
      expect(tableRows[1]).toHaveTextContent("N/A");
      expect(tableRows[0]).toHaveTextContent("Invalid");
    });

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });

    await waitFor(() => expect(executeAllTestCasesButton).toBeDisabled());
  });

  it("Execution button should be disabled for stratifiation", async () => {
    mockMeasure.cqlErrors = false;
    mockMeasure.groups = [
      {
        id: "2",
        scoring: MeasureScoring.COHORT,
        populationBasis: "boolean",
        populations: [
          {
            id: "id-1",
            name: PopulationType.INITIAL_POPULATION,
            definition: "ipp",
          },
        ],
        measureGroupTypes: [],
        stratifications: [
          {
            id: "strata1",
            cqlDefinition: "strat1Def",
            association: PopulationType.INITIAL_POPULATION,
          },
        ],
      },
    ];
    renderTestCaseListComponent();

    // wait for pop criteria to load
    await waitFor(() => {
      const popCriteria1 = screen.getByText("Population Criteria 1");
      expect(popCriteria1).toBeInTheDocument();

      const executeButton = screen.getByRole("button", {
        name: "Run Test(s)",
      });
      expect(executeButton).toBeDisabled();
    });
  });

  it("Execution button should be disabled for observation", async () => {
    mockMeasure.cqlErrors = false;
    mockMeasure.groups = [
      {
        id: "2",
        scoring: MeasureScoring.COHORT,
        populationBasis: "boolean",
        populations: [
          {
            id: "id-1",
            name: PopulationType.INITIAL_POPULATION,
            definition: "ipp",
          },
        ],
        measureGroupTypes: [],
        measureObservations: [
          {
            id: "7e20f14a-3659-4a87-9692-5ec35391e8f6",
            definition: "boolFunc",
            criteriaReference: "79349c30-791c-41c7-9463-81872a0dbed1",
            aggregateMethod: AggregateFunctionType.AVERAGE,
          },
        ],
      },
    ];
    renderTestCaseListComponent();

    // wait for pop criteria to load
    await waitFor(() => {
      const popCriteria1 = screen.getByText("Population Criteria 1");
      expect(popCriteria1).toBeInTheDocument();

      const executeButton = screen.getByRole("button", {
        name: "Run Test(s)",
      });
      expect(executeButton).toBeDisabled();
    });
  });

  it("should render shift test case dates dialogue on Test Case list page when shift test case dates button is clicked", async () => {
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      ShiftTestCasesDates: true,
    }));

    const { getByTestId } = renderTestCaseListComponent();
    await waitFor(() => {
      const selectButton = getByTestId(`select-action-${testCases[0].id}`);
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
    });

    const shiftDatesButton = getByTestId(`shift-dates-btn-${testCases[0].id}`);
    fireEvent.click(shiftDatesButton);

    expect(screen.getByTestId("shift-dates-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("shift-dates-save-button")).toBeInTheDocument();
    expect(screen.getByTestId("shift-dates-cancel-button")).toBeInTheDocument();
  });

  it("should shift test case dates successfully", async () => {
    testCases[0].title = "WhenAllGood";
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      ShiftTestCasesDates: true,
    }));
    const responseDto: TestCase = {
      id: "1234",
      json: "date2",
    } as TestCase;
    const shiftTestCaseDatesApiMock = jest
      .fn()
      .mockResolvedValueOnce({ data: responseDto });
    useTestCaseServiceMock.mockImplementationOnce(() => {
      return {
        getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
        shiftQdmTestCaseDates: shiftTestCaseDatesApiMock,
      } as unknown as TestCaseServiceApi;
    });
    const { getByTestId } = renderTestCaseListComponent();
    await waitFor(() => {
      const selectButton = getByTestId(`select-action-${testCases[0].id}`);
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
    });

    const shiftDatesButton = getByTestId(`shift-dates-btn-${testCases[0].id}`);
    fireEvent.click(shiftDatesButton);

    expect(screen.getByTestId("shift-dates-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("shift-dates-save-button")).toBeInTheDocument();
    expect(screen.getByTestId("shift-dates-cancel-button")).toBeInTheDocument();

    const shiftDatesInput = (await screen.findByTestId(
      "shift-dates-input"
    )) as HTMLInputElement;
    expect(shiftDatesInput).toBeInTheDocument();

    const saveBtn = await screen.findByTestId("shift-dates-save-button");
    expect(saveBtn).toBeInTheDocument();
    expect(saveBtn).not.toBeEnabled();

    userEvent.type(shiftDatesInput, "1");
    expect(shiftDatesInput.value).toBe("1");
    expect(saveBtn).toBeEnabled();

    userEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByTestId("test-case-list-success")).toHaveTextContent(
        "Test Case Shift Dates for IPP-Pass - WhenAllGood successful."
      );
      expect(measureStore.updateTestCases as jest.Mock).toHaveBeenCalledTimes(
        2
      );
    });
  });

  it("should handle shift test case dates failure", async () => {
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      ShiftTestCasesDates: true,
    }));
    const shiftTestCaseDatesApiMock = jest.fn().mockRejectedValueOnce(null);
    useTestCaseServiceMock.mockImplementationOnce(() => {
      return {
        getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
        shiftQdmTestCaseDates: shiftTestCaseDatesApiMock,
      } as unknown as TestCaseServiceApi;
    });
    const { getByTestId } = renderTestCaseListComponent();
    await waitFor(() => {
      const selectButton = getByTestId(`select-action-${testCases[0].id}`);
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
    });

    const shiftDatesButton = getByTestId(`shift-dates-btn-${testCases[0].id}`);
    fireEvent.click(shiftDatesButton);

    expect(screen.getByTestId("shift-dates-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("shift-dates-save-button")).toBeInTheDocument();
    expect(screen.getByTestId("shift-dates-cancel-button")).toBeInTheDocument();

    const shiftDatesInput = (await screen.findByTestId(
      "shift-dates-input"
    )) as HTMLInputElement;
    expect(shiftDatesInput).toBeInTheDocument();

    const saveBtn = await screen.findByTestId("shift-dates-save-button");
    expect(saveBtn).toBeInTheDocument();
    expect(saveBtn).not.toBeEnabled();

    userEvent.type(shiftDatesInput, "1");
    expect(shiftDatesInput.value).toBe("1");
    expect(saveBtn).toBeEnabled();

    userEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByTestId("test-case-list-error")).toHaveTextContent(
        "Unable to shift test Case dates with ID 1. Please try again. If the issue continues, please contact helpdesk."
      );
      expect(measureStore.updateTestCases as jest.Mock).toHaveBeenCalledTimes(
        2
      );
    });
  });
});

describe("retrieve coverage value from HTML coverage", () => {
  it("should retrieve the numeric coverage value for decimal percentages", () => {
    const coverageHtml: Record<string, string> = {
      a345sda45: `<div><h2> a345sda45 Clause Coverage: 50.0%</h2></div>`,
    };
    const coverageValue = getCoverageValueFromHtml(coverageHtml, "a345sda45");
    expect(coverageValue).toEqual(expect.any(Number));
    expect(coverageValue).toEqual(50);
  });

  it("should retrieve the numeric coverage value for whole numbers", () => {
    const coverageHtml: Record<string, string> = {
      a345sda45: `<div><h2> a345sda45 Clause Coverage: 100%</h2></div>`,
    };
    const coverageValue = getCoverageValueFromHtml(coverageHtml, "a345sda45");
    expect(coverageValue).toEqual(100);
  });

  it("should return 0 for NaN percentages", () => {
    const coverageHtml: Record<string, string> = {
      a345sda45: `<div><h2> a345sda45 Clause Coverage: NaN%</h2></div>`,
    };
    const coverageValue = getCoverageValueFromHtml(coverageHtml, "a345sda45");
    expect(coverageValue).toEqual(0);
  });

  it("should return 0 for missing percentages", () => {
    const coverageHtml: Record<string, string> = {
      a345sda45: `<div><h2> a345sda45 Clause Coverage: %</h2></div>`,
    };
    const coverageValue = getCoverageValueFromHtml(coverageHtml, "a345sda45");
    expect(coverageValue).toEqual(0);
  });
});

describe("removeHtmlCoverageHeader", () => {
  it("should remove header with numeric percentage", () => {
    const coverage: Record<string, string> = {
      a345sda45: `
      <div><h2> a345sda45 Clause Coverage: 50.0%</h2><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="55" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>define &quot;boolIpp&quot;:
        </span><span data-ref-id="54" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span><span data-ref-id="48" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>[&quot;Encounter&quot;]</span></span></span><span> E</span></span></span><span> </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>where </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="49" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>E</span></span><span>.</span><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>period</span></span></span><span>.</span><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>start</span></span></span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"> during </span><span data-ref-id="52" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>&quot;Measurement Period&quot;</span></span></span></span></span></span></code>
        </pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="1719" style=""><span>define function ToDateTime(value </span><span data-ref-id="1716" style=""><span>dateTime</span></span><span>): </span><span data-ref-id="1718" style=""><span data-ref-id="1718" style=""><span data-ref-id="1717" style=""><span>value</span></span><span>.</span><span data-ref-id="1718" style=""><span>value</span></span></span></span></span></code>
        </pre>
       </div>
      `,
    };
    const htmlCoverage = removeHtmlCoverageHeader(coverage);
    expect(htmlCoverage["a345sda45"]).toEqual(`
      <div><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="55" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>define &quot;boolIpp&quot;:
        </span><span data-ref-id="54" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span><span data-ref-id="48" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>[&quot;Encounter&quot;]</span></span></span><span> E</span></span></span><span> </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>where </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="49" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>E</span></span><span>.</span><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>period</span></span></span><span>.</span><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>start</span></span></span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"> during </span><span data-ref-id="52" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>&quot;Measurement Period&quot;</span></span></span></span></span></span></code>
        </pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="1719" style=""><span>define function ToDateTime(value </span><span data-ref-id="1716" style=""><span>dateTime</span></span><span>): </span><span data-ref-id="1718" style=""><span data-ref-id="1718" style=""><span data-ref-id="1717" style=""><span>value</span></span><span>.</span><span data-ref-id="1718" style=""><span>value</span></span></span></span></span></code>
        </pre>
       </div>
      `);
  });

  it("should remove header with NaN percentage", () => {
    const htmlCoverage = removeHtmlCoverageHeader({
      ab4c23fd5f: `<div><h2> ab4c23fd5f Clause Coverage: NaN%</h2></div>`,
    });
    expect(htmlCoverage["ab4c23fd5f"]).toEqual(`<div></div>`);
  });

  it("should remove header with 100 percentage", () => {
    const htmlCoverage = removeHtmlCoverageHeader({
      ab4c23fd5f: `<div><h2> ab4c23fd5f Clause Coverage: 100%</h2></div>`,
    });
    expect(htmlCoverage["ab4c23fd5f"]).toEqual(`<div></div>`);
  });

  it("should leave regular HTML alone", () => {
    const htmlCoverage = removeHtmlCoverageHeader({
      ab4c23fd5f: `
      <div><h2>Different Header</h2><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="55" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>define &quot;boolIpp&quot;:
        </span><span data-ref-id="54" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span><span data-ref-id="48" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>[&quot;Encounter&quot;]</span></span></span><span> E</span></span></span><span> </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>where </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="49" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>E</span></span><span>.</span><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>period</span></span></span><span>.</span><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>start</span></span></span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"> during </span><span data-ref-id="52" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>&quot;Measurement Period&quot;</span></span></span></span></span></span></code>
        </pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="1719" style=""><span>define function ToDateTime(value </span><span data-ref-id="1716" style=""><span>dateTime</span></span><span>): </span><span data-ref-id="1718" style=""><span data-ref-id="1718" style=""><span data-ref-id="1717" style=""><span>value</span></span><span>.</span><span data-ref-id="1718" style=""><span>value</span></span></span></span></span></code>
        </pre>
       </div>
    `,
    });
    expect(htmlCoverage["ab4c23fd5f"]).toEqual(`
      <div><h2>Different Header</h2><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="55" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>define &quot;boolIpp&quot;:
        </span><span data-ref-id="54" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span><span data-ref-id="48" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>[&quot;Encounter&quot;]</span></span></span><span> E</span></span></span><span> </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>where </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="49" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>E</span></span><span>.</span><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>period</span></span></span><span>.</span><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>start</span></span></span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"> during </span><span data-ref-id="52" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>&quot;Measurement Period&quot;</span></span></span></span></span></span></code>
        </pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="1719" style=""><span>define function ToDateTime(value </span><span data-ref-id="1716" style=""><span>dateTime</span></span><span>): </span><span data-ref-id="1718" style=""><span data-ref-id="1718" style=""><span data-ref-id="1717" style=""><span>value</span></span><span>.</span><span data-ref-id="1718" style=""><span>value</span></span></span></span></span></code>
        </pre>
       </div>
    `);
  });
});
