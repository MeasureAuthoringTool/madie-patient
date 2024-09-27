import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { QiCoreResourceProvider } from "../../../../../util/QiCorePatientProvider";
import ElementsTab from "./ElementsTab";
import {
  ApiContextProvider,
  ServiceConfig,
} from "../../../../../api/ServiceContext";
import { Measure, TestCase } from "@madie/madie-models";
import axios from "../../../../../api/axios-instance";

const patientBundle = {
  resourceType: "Bundle",
  id: "IP-Pass-CVPatient",
  type: "collection",
  entry: [
    {
      fullUrl:
        "https://madie.cms.gov/Patient/1409f76a-f837-45fd-8850-6927674fefc4",
      resource: {
        resourceType: "Patient",
        id: "1409f76a-f837-45fd-8850-6927674fefc4",
        extension: [
          {
            extension: [
              {
                url: "ombCategory",
                valueCoding: {
                  system: "urn:oid:2.16.840.1.113883.6.238",
                  code: "2106-3",
                  display: "White",
                },
              },
              {
                url: "detailed",
                valueCoding: {
                  system: "urn:oid:2.16.840.1.113883.6.238",
                  code: "1586-7",
                  display: "Shoshone",
                },
              },
              {
                url: "detailed",
                valueCoding: {
                  system: "urn:oid:2.16.840.1.113883.6.238",
                  code: "2036-2",
                  display: "Filipino",
                },
              },
              {
                url: "text",
                valueString: "Mixed",
              },
              {
                url: "ombCategory",
                valueCoding: {
                  code: "2028-9",
                  system: "urn:oid:2.16.840.1.113883.6.238",
                  display: "Asian",
                },
              },
            ],
            url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
          },
          {
            extension: [
              {
                url: "ombCategory",
                valueCoding: {
                  system: "urn:oid:2.16.840.1.113883.6.238",
                  code: "2135-2",
                  display: "Hispanic or Latino",
                },
              },
              {
                url: "detailed",
                valueCoding: {
                  system: "urn:oid:2.16.840.1.113883.6.238",
                  code: "2184-0",
                  display: "Dominican",
                },
              },
              {
                url: "text",
                valueString: "Hispanic or Latino",
              },
            ],
            url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
          },
          {
            url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity",
            valueCodeableConcept: {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",
                  code: "ASKU",
                  display: "asked but unknown",
                },
              ],
              text: "asked but unknown",
            },
          },
        ],
        name: [
          {
            use: "usual",
            family: "IPPass",
            given: ["IPPass"],
          },
        ],
        gender: "male",
        birthDate: "1954-02-10",
      },
    },
  ],
};
const setEditorVal = jest.fn();

const serviceConfig: ServiceConfig = {
  qdmElmTranslationService: { baseUrl: "qdm-cql-to-elm.com" },
  fhirElmTranslationService: { baseUrl: "fhir-cql-to-elm.com" },
  excelExportService: {
    baseUrl: "excelexport.com",
  },
  measureService: {
    baseUrl: "measure.url",
  },
  testCaseService: {
    baseUrl: "base.url",
  },
  fhirDefinitionsService: {
    baseUrl: "fhirservice.url",
  },
  terminologyService: {
    baseUrl: "something.com",
  },
};
const MEASURE_CREATEDBY = "testuser";
let mockApplyDefaults = false;
jest.mock("@madie/madie-util", () => {
  return {
    useDocumentTitle: jest.fn(),
    useFeatureFlags: () => {
      return {
        applyDefaults: mockApplyDefaults,
        qiCoreElementsTab: true,
      };
    },
    measureStore: {
      updateMeasure: jest.fn((measure) => measure),
      state: null,
      initialState: null,
      subscribe: (set) => {
        set({} as Measure);
        return { unsubscribe: () => null };
      },
      unsubscribe: () => null,
    },
    useOktaTokens: jest.fn(() => ({
      getAccessToken: () => "test.jwt",
    })),
    checkUserCanEdit: jest.fn(() => {
      return true;
    }),
    routeHandlerStore: {
      subscribe: () => {
        return { unsubscribe: () => null };
      },
      updateRouteHandlerState: () => null,
      state: { canTravel: false, pendingPath: "" },
      initialState: { canTravel: false, pendingPath: "" },
    },
  };
});

jest.mock("../../../../../api/axios-instance");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ElementsTab", () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.endsWith("resources")) {
        return Promise.resolve({
          data: ["AdverseEvent", "MedicationStatement", "Claim", "Procedure"],
        });
      }
      return Promise.resolve({ data: null });
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderElementTab = () => {
    render(
      <ApiContextProvider value={serviceConfig}>
        <QiCoreResourceProvider>
          <ElementsTab
            canEdit={true}
            setEditorVal={setEditorVal}
            editorVal={JSON.stringify(patientBundle)}
            testCase={{ json: JSON.stringify(patientBundle) } as TestCase}
          />
        </QiCoreResourceProvider>
      </ApiContextProvider>
    );
  };

  it("displays Element Tab for a QICore case", async () => {
    renderElementTab();
    screen.debug();
    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(await screen.findByText("Adverse Event")).toBeInTheDocument();
  });
});
