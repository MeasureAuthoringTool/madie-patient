import * as React from "react";
import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import DynamicElementsTabs from "./DynamicElementTabs";
import userEvent from "@testing-library/user-event";

const testCategories = [
  "adverse_event",
  "allergy",
  "assessment",
  "condition",
  "device",
  "diagnostic_study",
  "encounter",
  "patient_characteristic",
];

const mockSetActiveTab = jest.fn();

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

describe("DynamicElementsTabs component", () => {
  test("should render DynamicElementsTabs", () => {
    render(
      <DynamicElementsTabs
        categories={testCategories}
        activeTab={"adverse_event"}
        setActiveTab={mockSetActiveTab}
        dataElements={testDataElements}
      />
    );

    expect(
      screen.getByTestId("elements-tab-adverse_event")
    ).toBeInTheDocument();
    expect(screen.getByTestId("elements-tab-allergy")).toBeInTheDocument();
    expect(screen.getByTestId("elements-tab-assessment")).toBeInTheDocument();
    expect(screen.getByTestId("elements-tab-condition")).toBeInTheDocument();
    expect(
      screen.getByTestId("elements-tab-diagnostic_study")
    ).toBeInTheDocument();
    expect(screen.getByTestId("elements-tab-encounter")).toBeInTheDocument();
    expect(
      screen.getByTestId("elements-tab-patient_characteristic")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("data-type-Adverse Event: Encounter Inpatient")
    ).toBeInTheDocument();
  });

  test("should display active tab and data type", () => {
    render(
      <DynamicElementsTabs
        categories={testCategories}
        activeTab={"adverse_event"}
        setActiveTab={mockSetActiveTab}
        dataElements={testDataElements}
      />
    );
    const adverseEventTab = screen.getByTestId("elements-tab-adverse_event");
    expect(adverseEventTab).toBeInTheDocument();
    expect(adverseEventTab).toHaveAttribute("aria-selected", "true");
    const adverseEventDataType = screen.getByTestId(
      "data-type-Adverse Event: Encounter Inpatient"
    );
    expect(adverseEventDataType).toBeInTheDocument();
  });

  test("should display correspondant data type when clicking tab ", () => {
    render(
      <DynamicElementsTabs
        categories={testCategories}
        activeTab={"adverse_event"}
        setActiveTab={mockSetActiveTab}
        dataElements={testDataElements}
      />
    );
    const adverseEventDataType = screen.getByTestId(
      "data-type-Adverse Event: Encounter Inpatient"
    );
    expect(adverseEventDataType).toBeInTheDocument();
    const encounterTab = screen.getByTestId("elements-tab-encounter");
    expect(encounterTab).toBeInTheDocument();

    userEvent.click(encounterTab);

    expect(
      screen.getByTestId(
        "data-type-Encounter, Order: Closed Head and Facial Trauma"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("data-type-Encounter, Recommended: Dementia")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "data-type-Encounter, Performed: Emergency Department Visit"
      )
    ).toBeInTheDocument();
  });
});
