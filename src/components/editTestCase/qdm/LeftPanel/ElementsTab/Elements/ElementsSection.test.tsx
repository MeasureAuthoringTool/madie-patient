import React from "react";
import {
  Measure,
  MeasureScoring,
  Model,
  PopulationType,
} from "@madie/madie-models";
import { describe, expect, test } from "@jest/globals";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { mockCqlWithAllCategoriesPresent } from "../../../mockCql";
import ElementsSection from "./ElementsSection";
import useCqmConversionService, {
  CqmConversionService,
} from "../../../../../../api/CqmModelConversionService";
import useTestCaseServiceApi, {
  TestCaseServiceApi,
} from "../../../../../../api/useTestCaseServiceApi";
import { act } from "react-dom/test-utils";

const serviceConfig: ServiceConfig = {
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

const testCQL = `library QDMMeasureLib2 version '0.0.000'

using QDM version '5.6'

codesystem "Test": 'urn:oid:2.16.840.1.113883.6.1'
codesystem "LOINC": 'urn:oid:2.16.840.1.113883.6.1'


valueset "Emergency Department Visit": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'
valueset "Encounter Inpatient": 'urn:oid:2.16.840.1.113883.3.666.5.307'
valueset "Ethnicity": 'urn:oid:2.16.840.1.114222.4.11.837'
valueset "Observation Services": 'urn:oid:2.16.840.1.113762.1.4.1111.143'
valueset "ONC Administrative Sex": 'urn:oid:2.16.840.1.113762.1.4.1'
valueset "Payer": 'urn:oid:2.16.840.1.114222.4.11.3591'
valueset "Race": 'urn:oid:2.16.840.1.114222.4.11.836'
valueset "Active Bleeding or Bleeding Diathesis (Excluding Menses)": 'urn:oid:2.16.840.1.113883.3.3157.4036'
valueset "Active Peptic Ulcer": 'urn:oid:2.16.840.1.113883.3.3157.4031'
valueset "Adverse reaction to thrombolytics": 'urn:oid:2.16.840.1.113762.1.4.1170.6'
valueset "Allergy to thrombolytics": 'urn:oid:2.16.840.1.113762.1.4.1170.5'
valueset "Anticoagulant Medications, Oral": 'urn:oid:2.16.840.1.113883.3.3157.4045'
valueset "Aortic Dissection and Rupture": 'urn:oid:2.16.840.1.113883.3.3157.4028'
valueset "birth date": 'urn:oid:2.16.840.1.113883.3.560.100.4'
valueset "Cardiopulmonary Arrest": 'urn:oid:2.16.840.1.113883.3.3157.4048'
valueset "Cerebral Vascular Lesion": 'urn:oid:2.16.840.1.113883.3.3157.4025'
valueset "Closed Head and Facial Trauma": 'urn:oid:2.16.840.1.113883.3.3157.4026'
valueset "Dementia": 'urn:oid:2.16.840.1.113883.3.3157.4043'
valueset "Discharge To Acute Care Facility": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.87'

code "Birth date": '21112-8' from "LOINC" display 'Birth date'

parameter "Measurement Period" Interval<DateTime>

context Patient

define "SDE Ethnicity":
  ["Patient Characteristic Ethnicity": "Ethnicity"]

define "SDE Payer":
  ["Patient Characteristic Payer": "Payer"]

define "SDE Race":
  ["Patient Characteristic Race": "Race"]

define "SDE Sex":
  ["Patient Characteristic Sex": "ONC Administrative Sex"]


define "Initial Population":
  ["Adverse Event": "Encounter Inpatient"] //Adverse Event
      union ["Allergy/Intolerance": "Observation Services"] //Allergy
      union ["Assessment, Order": "Active Bleeding or Bleeding Diathesis (Excluding Menses)"] //Assessment
      union ["Assessment, Performed": "Active Peptic Ulcer"] //Assessment
      union ["Assessment, Recommended": "Adverse reaction to thrombolytics"] //Assessment
      union ["Diagnosis": "Allergy to thrombolytics"] //Condition
      union ["Device, Order": "Cardiopulmonary Arrest"] //Device
      union ["Diagnostic Study, Order": "Cerebral Vascular Lesion"] //Diagnostic Study
      union ["Encounter, Performed": "Emergency Department Visit"] //Encounter
      union ["Encounter, Order": "Closed Head and Facial Trauma"] //Encounter
      union ["Encounter, Recommended": "Dementia"] //Encounter
`;
const mockMeasure = {
  id: "testmeasureid",
  scoring: MeasureScoring.COHORT,
  model: Model.QDM_5_6,
  createdBy: "testUserOwner",
  patientBasis: true,
  cql: mockCqlWithAllCategoriesPresent,
  groups: [
    {
      id: "test_groupId",
      scoring: MeasureScoring.COHORT,
      populations: [
        {
          id: "308d2af8-9650-49c0-a454-14a85163d9f9",
          name: PopulationType.INITIAL_POPULATION,
          definition: "IP",
        },
      ],
      populationBasis: "true",
    },
  ],
} as Measure;

jest.mock("../../../../../../api/CqmModelConversionService");
const CQMConversionMock =
  useCqmConversionService as jest.Mock<TestCaseServiceApi>;
const testDataElements = [
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059bf",
    qdmTitle: "Patient Characteristic Ethnicity",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.56",
    qdmCategory: "patient_characteristic",
    qdmStatus: "ethnicity",
    qdmVersion: "5.6",
    _type: "QDM::PatientCharacteristicEthnicity",
    id: "6480f13e91f25700004059bf",
    codeListId: "2.16.840.1.114222.4.11.837",
    description: "Patient Characteristic Ethnicity: Ethnicity",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059c1",
    recorder: [],
    qdmTitle: "Allergy/Intolerance",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.119",
    qdmCategory: "allergy",
    qdmStatus: "intolerance",
    qdmVersion: "5.6",
    _type: "QDM::AllergyIntolerance",
    id: "6480f13e91f25700004059c1",
    codeListId: "2.16.840.1.113762.1.4.1111.143",
    description: "Allergy/Intolerance: Observation Services",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059c3",
    qdmTitle: "Patient Characteristic Sex",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.55",
    qdmCategory: "patient_characteristic",
    qdmStatus: "gender",
    qdmVersion: "5.6",
    _type: "QDM::PatientCharacteristicSex",
    id: "6480f13e91f25700004059c3",
    codeListId: "2.16.840.1.113762.1.4.1",
    description: "Patient Characteristic Sex: ONC Administrative Sex",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059c5",
    requester: [],
    qdmTitle: "Diagnostic Study, Order",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.22",
    qdmCategory: "diagnostic_study",
    qdmStatus: "order",
    qdmVersion: "5.6",
    _type: "QDM::DiagnosticStudyOrder",
    id: "6480f13e91f25700004059c5",
    codeListId: "2.16.840.1.113883.3.3157.4025",
    description: "Diagnostic Study, Order: Cerebral Vascular Lesion",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059c7",
    requester: [],
    qdmTitle: "Assessment, Recommended",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.118",
    qdmCategory: "assessment",
    qdmStatus: "recommended",
    qdmVersion: "5.6",
    _type: "QDM::AssessmentRecommended",
    id: "6480f13e91f25700004059c7",
    codeListId: "2.16.840.1.113762.1.4.1170.6",
    description: "Assessment, Recommended: Adverse reaction to thrombolytics",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059c9",
    requester: [],
    qdmTitle: "Encounter, Order",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.27",
    qdmCategory: "encounter",
    qdmStatus: "order",
    qdmVersion: "5.6",
    _type: "QDM::EncounterOrder",
    id: "6480f13e91f25700004059c9",
    codeListId: "2.16.840.1.113883.3.3157.4026",
    description: "Encounter, Order: Closed Head and Facial Trauma",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059cb",
    requester: [],
    qdmTitle: "Encounter, Recommended",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.28",
    qdmCategory: "encounter",
    qdmStatus: "recommended",
    qdmVersion: "5.6",
    _type: "QDM::EncounterRecommended",
    id: "6480f13e91f25700004059cb",
    codeListId: "2.16.840.1.113883.3.3157.4043",
    description: "Encounter, Recommended: Dementia",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059cd",
    relatedTo: [],
    performer: [],
    qdmTitle: "Assessment, Performed",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.117",
    qdmCategory: "assessment",
    qdmStatus: "performed",
    qdmVersion: "5.6",
    _type: "QDM::AssessmentPerformed",
    id: "6480f13e91f25700004059cd",
    components: [],
    codeListId: "2.16.840.1.113883.3.3157.4031",
    description: "Assessment, Performed: Active Peptic Ulcer",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059cf",
    participant: [],
    relatedTo: [],
    qdmTitle: "Encounter, Performed",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
    qdmCategory: "encounter",
    qdmStatus: "performed",
    qdmVersion: "5.6",
    _type: "QDM::EncounterPerformed",
    id: "6480f13e91f25700004059cf",
    facilityLocations: [],
    diagnoses: [],
    codeListId: "2.16.840.1.113883.3.117.1.7.1.292",
    description: "Encounter, Performed: Emergency Department Visit",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059d1",
    recorder: [],
    qdmTitle: "Diagnosis",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.110",
    qrdaOid: "2.16.840.1.113883.10.20.24.3.135",
    qdmCategory: "condition",
    qdmVersion: "5.6",
    _type: "QDM::Diagnosis",
    id: "6480f13e91f25700004059d1",
    codeListId: "2.16.840.1.113762.1.4.1170.5",
    description: "Diagnosis: Allergy to thrombolytics",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059d3",
    qdmTitle: "Patient Characteristic Race",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.59",
    qdmCategory: "patient_characteristic",
    qdmStatus: "race",
    qdmVersion: "5.6",
    _type: "QDM::PatientCharacteristicRace",
    id: "6480f13e91f25700004059d3",
    codeListId: "2.16.840.1.114222.4.11.836",
    description: "Patient Characteristic Race: Race",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059d5",
    recorder: [],
    qdmTitle: "Adverse Event",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.120",
    qdmCategory: "adverse_event",
    qdmVersion: "5.6",
    _type: "QDM::AdverseEvent",
    id: "6480f13e91f25700004059d5",
    codeListId: "2.16.840.1.113883.3.666.5.307",
    description: "Adverse Event: Encounter Inpatient",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059d7",
    requester: [],
    qdmTitle: "Assessment, Order",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.131",
    qdmCategory: "assessment",
    qdmStatus: "order",
    qdmVersion: "5.6",
    _type: "QDM::AssessmentOrder",
    id: "6480f13e91f25700004059d7",
    codeListId: "2.16.840.1.113883.3.3157.4036",
    description:
      "Assessment, Order: Active Bleeding or Bleeding Diathesis (Excluding Menses)",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059d9",
    qdmTitle: "Patient Characteristic Payer",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.58",
    qdmCategory: "patient_characteristic",
    qdmStatus: "payer",
    qdmVersion: "5.6",
    _type: "QDM::PatientCharacteristicPayer",
    id: "6480f13e91f25700004059d9",
    codeListId: "2.16.840.1.114222.4.11.3591",
    description: "Patient Characteristic Payer: Payer",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059db",
    requester: [],
    qdmTitle: "Device, Order",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.15",
    qdmCategory: "device",
    qdmStatus: "order",
    qdmVersion: "5.6",
    _type: "QDM::DeviceOrder",
    id: "6480f13e91f25700004059db",
    codeListId: "2.16.840.1.113883.3.3157.4048",
    description: "Device, Order: Cardiopulmonary Arrest",
  },
];

const useCqmConversionServiceMockResolved = {
  fetchSourceDataCriteria: jest.fn().mockResolvedValue(testDataElements),
} as unknown as TestCaseServiceApi;
let mockApplyDefaults = false;

jest.mock("@madie/madie-util", () => ({
  useDocumentTitle: jest.fn(),
  useFeatureFlags: () => {
    return { applyDefaults: mockApplyDefaults };
  },
  measureStore: {
    updateMeasure: jest.fn((measure) => measure),
    state: jest.fn().mockImplementation(() => mockMeasure),
    initialState: null,
    subscribe: (set) => {
      set(mockMeasure);
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
    subscribe: (set) => {
      return { unsubscribe: () => null };
    },
    updateRouteHandlerState: () => null,
    state: { canTravel: false, pendingPath: "" },
    initialState: { canTravel: false, pendingPath: "" },
  },
}));
screen.debug(undefined, Infinity);
describe("ElementsSection allows card opening and closing", () => {
  screen.debug(undefined, Infinity);

  CQMConversionMock.mockImplementation(() => {
    return useCqmConversionServiceMockResolved;
  });
  // need to mock measureStore, and the results from retrieve categories
  const { findByTestId, getByTestId, queryByText } = screen;
  test("should open and close a data element card manual close selection", async () => {
    render(<ElementsSection />);
    const elementSection = await findByTestId("elements-section");
    expect(elementSection).toBeInTheDocument();
    //  navigate to adverse event
    const adverseEventTab = screen.getByTestId("elements-tab-adverse_event");
    expect(adverseEventTab).toBeInTheDocument();
    act(() => {
      userEvent.click(adverseEventTab);
    });
    expect(adverseEventTab).toHaveAttribute("aria-selected", "true");
    const adverseEventDataType = screen.getByTestId(
      "data-type-Adverse Event: Encounter Inpatient"
    );

    expect(adverseEventDataType).toBeInTheDocument();
    act(() => {
      fireEvent.click(adverseEventDataType);
    });

    await waitFor(() => {
      expect(getByTestId("data-element-card")).toBeInTheDocument();
    });
    const closeButton = getByTestId("close-element-card");
    expect(closeButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(closeButton);
    });
    await waitFor(() => {
      expect(queryByText("Timing")).not.toBeInTheDocument();
    });
  });

  test("should open and close a data element card manual close selection", async () => {
    render(<ElementsSection />);
    const elementSection = await findByTestId("elements-section");
    expect(elementSection).toBeInTheDocument();
    const adverseEventTab = screen.getByTestId("elements-tab-adverse_event");
    expect(adverseEventTab).toBeInTheDocument();
    act(() => {
      userEvent.click(adverseEventTab);
    });
    expect(adverseEventTab).toHaveAttribute("aria-selected", "true");
    const adverseEventDataType = screen.getByTestId(
      "data-type-Adverse Event: Encounter Inpatient"
    );

    expect(adverseEventDataType).toBeInTheDocument();
    act(() => {
      fireEvent.click(adverseEventDataType);
    });

    await waitFor(() => {
      expect(getByTestId("data-element-card")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(queryByText("Negation Rationale")).not.toBeInTheDocument();
    });
    const deviceTab = screen.getByTestId("elements-tab-device");
    expect(deviceTab).toBeInTheDocument();
    act(() => {
      userEvent.click(deviceTab);
    });
    await waitFor(() => {
      expect(queryByText("Timing")).not.toBeInTheDocument();
    });
    const deviceDataType = screen.getByTestId(
      "data-type-Device, Order: Cardiopulmonary Arrest"
    );
    act(() => {
      fireEvent.click(deviceDataType);
    });
    await waitFor(() => {
      expect(queryByText("Negation Rationale")).toBeInTheDocument();
    });
  });
});
