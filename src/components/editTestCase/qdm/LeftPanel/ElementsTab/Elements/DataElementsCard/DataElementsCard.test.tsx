import React from "react";
import { Measure } from "@madie/madie-models";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataElementsCard, {
  applyAttribute,
} from "../DataElementsCard/DataElementsCard";
import { CQL } from "cqm-models";
import {
  ApiContextProvider,
  ServiceConfig,
} from "../../../../../../../api/ServiceContext";
import { QdmExecutionContextProvider } from "../../../../../../routes/qdm/QdmExecutionContext";
import { FormikProvider, FormikContextType } from "formik";
import { QdmPatientProvider } from "../../../../../../../util/QdmPatientContext";

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

const testCaseJson = {
  qdmVersion: "5.6",
  dataElements: [
    {
      admissionSource: {
        code: "10725009",
        system: "2.16.840.1.113883.6.96",
        display: "Benign hypertension (disorder)",
        version: null,
      },
      authorDatetime: "2012-04-05T08:00:00.000+00:00",
      clazz: null,
      codeListId: "2.16.840.1.113883.3.464.1003.101.12.1010",
      dataElementCodes: [
        {
          code: "4525004",
          system: "2.16.840.1.113883.6.96",
          version: null,
          display: null,
        },
      ],
      description: "Encounter, Performed: Emergency Department Visit",
      diagnoses: [
        {
          qdmVersion: "5.6",
          _type: "QDM::DiagnosisComponent",
          code: {
            code: "10725009",
            system: "2.16.840.1.113883.6.96",
            version: null,
            display: "Benign hypertension (disorder)",
          },
          presentOnAdmissionIndicator: null,
          rank: null,
        },
        {
          qdmVersion: "5.6",
          _type: "QDM::DiagnosisComponent",
          code: {
            code: "10725009",
            system: "2.16.840.1.113883.6.96",
            version: null,
            display: "Benign hypertension (disorder)",
          },
          presentOnAdmissionIndicator: {
            code: "4525004",
            system: "2.16.840.1.113883.6.96",
            version: null,
            display: "Emergency department patient visit (procedure)",
          },
          rank: 1,
        },
      ],
      dischargeDisposition: null,
      facilityLocations: [
        {
          qdmVersion: "5.6",
          _type: "QDM::FacilityLocation",
          code: {
            code: "10725009",
            system: "2.16.840.1.113883.6.96",
            version: null,
            display: "Benign hypertension (disorder)",
          },
          locationPeriod: {
            low: "2012-07-19T08:00:00.000+00:00",
            high: "2012-07-19T08:15:00.000+00:00",
            lowClosed: true,
            highClosed: true,
          },
        },
      ],
      hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
      id: "624c6561d226360000a3d231",
      lengthOfStay: {
        value: 12,
        unit: "hours",
      },
      participant: [
        {
          hqmfOid: "2.16.840.1.113883.10.20.28.4.136",
          id: "sd23wde54re",
          identifier: {
            namingSystem: "CPT",
            qdmVersion: "5.6",
            value: "TEST-11",
            _type: "QDM::Identifier",
          },
          qdmVersion: "5.6",
          qrdaOid: "2.16.840.1.113883.10.20.24.3.161",
          _type: "QDM::PatientEntity",
        },
      ],
      priority: null,
      qdmCategory: "encounter",
      qdmStatus: "performed",
      qdmTitle: "Encounter, Performed",
      qdmVersion: "5.6",
      relatedTo: ["624c6575d226360000a3d249"],
      relevantPeriod: {
        low: "2012-04-05T08:00:00.000Z",
        high: "2012-04-05T08:15:00.000Z",
        lowClosed: true,
        highClosed: true,
      },
      _type: "QDM::EncounterPerformed",
    },
    {
      admissionSource: null,
      authorDatetime: "2012-04-05T08:00:00.000+00:00",
      clazz: null,
      codeListId: "2.16.840.1.113883.3.464.1003.101.12.1010",
      dataElementCodes: [
        {
          code: "4525004",
          system: "2.16.840.1.113883.6.96",
          version: null,
          display: null,
        },
      ],
      description: "Encounter, Performed: Emergency Department Visit",
      diagnoses: [],
      dischargeDisposition: null,
      facilityLocations: [],
      hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
      id: "624c6575d226360000a3d249",
      lengthOfStay: null,
      priority: null,
      qdmCategory: "encounter",
      qdmStatus: "performed",
      qdmTitle: "Encounter, Performed",
      qdmVersion: "5.6",
      relatedTo: ["624c6561d226360000a3d231"],
      relevantPeriod: {
        low: "2012-04-05T08:00:00.000Z",
        high: "2012-04-05T08:15:00.000Z",
        lowClosed: true,
        highClosed: true,
      },
      _type: "QDM::EncounterPerformed",
    },
    {
      codeListId: "2.16.840.1.114222.4.11.3591",
      dataElementCodes: [
        {
          code: "1",
          system: "2.16.840.1.113883.3.221.5",
          version: null,
          display: null,
        },
      ],
      description: "Patient Characteristic Payer: Payer",
      hqmfOid: "2.16.840.1.113883.10.20.28.4.58",
      id: "64b851fc88fe62000007f384",
      qdmCategory: "patient_characteristic",
      qdmStatus: "payer",
      qdmTitle: "Patient Characteristic Payer",
      qdmVersion: "5.6",
      relevantPeriod: {
        low: "2012-07-19T08:00:00.000Z",
        high: "2012-07-19T08:15:00.000Z",
        lowClosed: true,
        highClosed: true,
      },
      _type: "QDM::PatientCharacteristicPayer",
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
      id: "6217d4b4f074ce3d0ee74031",
      qdmCategory: "patient_characteristic",
      qdmStatus: "gender",
      qdmTitle: "Patient Characteristic Sex",
      qdmVersion: "5.6",
      _type: "QDM::PatientCharacteristicSex",
    },
    {
      birthDatetime: "1965-01-01T08:00:00.000+00:00",
      codeListId: null,
      dataElementCodes: [],
      description: null,
      hqmfOid: "2.16.840.1.113883.10.20.28.4.54",
      id: "64b8521888fe62000007f390",
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
          code: "1002-5",
          system: "2.16.840.1.113883.6.238",
          version: null,
          display: "American Indian or Alaska Native",
        },
      ],
      description: "Patient Characteristic Race: Race",
      hqmfOid: "2.16.840.1.113883.10.20.28.4.59",
      id: "6217d4b4f074ce3d0ee74033",
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
          code: "2135-2",
          system: "2.16.840.1.113883.6.238",
          version: null,
          display: "Hispanic or Latino",
        },
      ],
      description: "Patient Characteristic Ethnicity: Ethnicity",
      hqmfOid: "2.16.840.1.113883.10.20.28.4.56",
      id: "6217d4b4f074ce3d0ee74032",
      qdmCategory: "patient_characteristic",
      qdmStatus: "ethnicity",
      qdmTitle: "Patient Characteristic Ethnicity",
      qdmVersion: "5.6",
      _type: "QDM::PatientCharacteristicEthnicity",
    },
    {
      dataElementCodes: [],
      _id: "64b979f5cfaef900004340fc",
      qdmTitle: "Patient Characteristic Birthdate",
      hqmfOid: "2.16.840.1.113883.10.20.28.4.54",
      qdmCategory: "patient_characteristic",
      qdmStatus: "birthdate",
      qdmVersion: "5.6",
      _type: "QDM::PatientCharacteristicBirthdate",
      id: "64b979f5cfaef900004340fc",
      birthDatetime: "2023-01-31T19:16:21.000+00:00",
    },
    {
      dataElementCodes: [
        {
          code: "1002-5",
          system: "2.16.840.1.113883.6.238",
          version: "1.2",
          display: "American Indian or Alaska Native",
        },
      ],
      _id: "64b979eacfaef90000434093",
      qdmTitle: "Patient Characteristic Race",
      hqmfOid: "2.16.840.1.113883.10.20.28.4.59",
      qdmCategory: "patient_characteristic",
      qdmStatus: "race",
      qdmVersion: "5.6",
      _type: "QDM::PatientCharacteristicRace",
      id: "64b979eacfaef90000434093",
    },
    {
      dataElementCodes: [
        {
          code: "F",
          system: "2.16.840.1.113883.5.1",
          version: "2022-11",
          display: "Female",
        },
      ],
      _id: "64b979eacfaef90000434095",
      qdmTitle: "Patient Characteristic Sex",
      hqmfOid: "2.16.840.1.113883.10.20.28.4.55",
      qdmCategory: "patient_characteristic",
      qdmStatus: "gender",
      qdmVersion: "5.6",
      _type: "QDM::PatientCharacteristicSex",
      id: "64b979eacfaef90000434095",
    },
  ],
  _id: "64b979eacfaef90000434099",
  birthDatetime: "2023-01-31T19:16:21.063+00:00",
};

const dataEl = [
  {
    admissionSource: {
      code: "10725009",
      system: "2.16.840.1.113883.6.96",
      display: "Benign hypertension (disorder)",
      version: null,
    },
    //authorDatetime: "2012-04-05T08:00:00.000+00:00",
    clazz: null,
    codeListId: "2.16.840.1.113883.3.464.1003.101.12.1010",
    dataElementCodes: [
      {
        code: "4525004",
        system: "2.16.840.1.113883.6.96",
        version: null,
        display: null,
      },
    ],
    description: "Encounter, Performed: Emergency Department Visit",
    diagnoses: [
      {
        qdmVersion: "5.6",
        _type: "QDM::DiagnosisComponent",
        code: {
          code: "10725009",
          system: "2.16.840.1.113883.6.96",
          version: null,
          display: "Benign hypertension (disorder)",
        },
        presentOnAdmissionIndicator: null,
        rank: null,
      },
      {
        qdmVersion: "5.6",
        _type: "QDM::DiagnosisComponent",
        code: {
          code: "10725009",
          system: "2.16.840.1.113883.6.96",
          version: null,
          display: "Benign hypertension (disorder)",
        },
        presentOnAdmissionIndicator: {
          code: "4525004",
          system: "2.16.840.1.113883.6.96",
          version: null,
          display: "Emergency department patient visit (procedure)",
        },
        rank: 1,
      },
    ],
    dischargeDisposition: null,
    facilityLocations: [
      {
        qdmVersion: "5.6",
        _type: "QDM::FacilityLocation",
        code: {
          code: "10725009",
          system: "2.16.840.1.113883.6.96",
          version: null,
          display: "Benign hypertension (disorder)",
        },
        locationPeriod: {
          low: "2012-07-19T08:00:00.000+00:00",
          high: "2012-07-19T08:15:00.000+00:00",
          lowClosed: true,
          highClosed: true,
        },
      },
    ],
    hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
    id: "624c6561d226360000a3d231",
    lengthOfStay: {
      value: 12,
      unit: "hours",
    },
    participant: [
      {
        hqmfOid: "2.16.840.1.113883.10.20.28.4.136",
        id: "sd23wde54re",
        identifier: {
          namingSystem: "CPT",
          qdmVersion: "5.6",
          value: "TEST-11",
          _type: "QDM::Identifier",
        },
        qdmVersion: "5.6",
        qrdaOid: "2.16.840.1.113883.10.20.24.3.161",
        _type: "QDM::PatientEntity",
        _id: "64c176cd6483d90000a8e032",
      },
    ],
    priority: null,
    qdmCategory: "encounter",
    qdmStatus: "performed",
    qdmTitle: "Encounter, Performed",
    qdmVersion: "5.6",
    relatedTo: ["624c6575d226360000a3d249"],
    relevantPeriod: {
      low: "2012-04-05T08:00:00.000Z",
      high: "2012-04-05T08:15:00.000Z",
      lowClosed: true,
      highClosed: true,
    },
    _type: "QDM::EncounterPerformed",
    _id: "64c176cd6483d90000a8e02d",
  },
  {
    admissionSource: null,
    authorDatetime: "2012-04-05T08:00:00.000+00:00",
    clazz: null,
    codeListId: "2.16.840.1.113883.3.464.1003.101.12.1010",
    dataElementCodes: [
      {
        code: "4525004",
        system: "2.16.840.1.113883.6.96",
        version: null,
        display: null,
      },
    ],
    description: "Encounter, Performed: Emergency Department Visit",
    diagnoses: [],
    dischargeDisposition: null,
    facilityLocations: [],
    hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
    id: "624c6575d226360000a3d249",
    lengthOfStay: null,
    priority: null,
    qdmCategory: "encounter",
    qdmStatus: "performed",
    qdmTitle: "Encounter, Performed",
    qdmVersion: "5.6",
    relatedTo: ["624c6561d226360000a3d231"],
    relevantPeriod: {
      low: "2012-04-05T08:00:00.000Z",
      high: "2012-04-05T08:15:00.000Z",
      lowClosed: true,
      highClosed: true,
    },
    _type: "QDM::EncounterPerformed",
    _id: "64c176cd6483d90000a8e034",
  },
  {
    codeListId: "2.16.840.1.114222.4.11.3591",
    dataElementCodes: [
      {
        code: "1",
        system: "2.16.840.1.113883.3.221.5",
        version: null,
        display: null,
      },
    ],
    description: "Patient Characteristic Payer: Payer",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.58",
    id: "64b851fc88fe62000007f384",
    qdmCategory: "patient_characteristic",
    qdmStatus: "payer",
    qdmTitle: "Patient Characteristic Payer",
    qdmVersion: "5.6",
    relevantPeriod: {
      low: "2012-07-19T08:00:00.000Z",
      high: "2012-07-19T08:15:00.000Z",
      lowClosed: true,
      highClosed: true,
    },
    _type: "QDM::PatientCharacteristicPayer",
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
    id: "6217d4b4f074ce3d0ee74031",
    qdmCategory: "patient_characteristic",
    qdmStatus: "gender",
    qdmTitle: "Patient Characteristic Sex",
    qdmVersion: "5.6",
    _type: "QDM::PatientCharacteristicSex",
  },
  {
    birthDatetime: "1965-01-01T08:00:00.000+00:00",
    codeListId: null,
    dataElementCodes: [],
    description: null,
    hqmfOid: "2.16.840.1.113883.10.20.28.4.54",
    id: "64b8521888fe62000007f390",
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
        code: "1002-5",
        system: "2.16.840.1.113883.6.238",
        version: null,
        display: "American Indian or Alaska Native",
      },
    ],
    description: "Patient Characteristic Race: Race",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.59",
    id: "6217d4b4f074ce3d0ee74033",
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
        code: "2135-2",
        system: "2.16.840.1.113883.6.238",
        version: null,
        display: "Hispanic or Latino",
      },
    ],
    description: "Patient Characteristic Ethnicity: Ethnicity",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.56",
    id: "6217d4b4f074ce3d0ee74032",
    qdmCategory: "patient_characteristic",
    qdmStatus: "ethnicity",
    qdmTitle: "Patient Characteristic Ethnicity",
    qdmVersion: "5.6",
    _type: "QDM::PatientCharacteristicEthnicity",
  },
  {
    dataElementCodes: [],
    _id: "64b979f5cfaef900004340fc",
    qdmTitle: "Patient Characteristic Birthdate",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.54",
    qdmCategory: "patient_characteristic",
    qdmStatus: "birthdate",
    qdmVersion: "5.6",
    _type: "QDM::PatientCharacteristicBirthdate",
    id: "64b979f5cfaef900004340fc",
    birthDatetime: "2023-01-31T19:16:21.000+00:00",
  },
  {
    dataElementCodes: [
      {
        code: "1002-5",
        system: "2.16.840.1.113883.6.238",
        version: "1.2",
        display: "American Indian or Alaska Native",
      },
    ],
    _id: "64b979eacfaef90000434093",
    qdmTitle: "Patient Characteristic Race",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.59",
    qdmCategory: "patient_characteristic",
    qdmStatus: "race",
    qdmVersion: "5.6",
    _type: "QDM::PatientCharacteristicRace",
    id: "64b979eacfaef90000434093",
  },
  {
    dataElementCodes: [
      {
        code: "F",
        system: "2.16.840.1.113883.5.1",
        version: "2022-11",
        display: "Female",
      },
    ],
    _id: "64b979eacfaef90000434095",
    qdmTitle: "Patient Characteristic Sex",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.55",
    qdmCategory: "patient_characteristic",
    qdmStatus: "gender",
    qdmVersion: "5.6",
    _type: "QDM::PatientCharacteristicSex",
    id: "64b979eacfaef90000434095",
  },
];
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
    negationRationale: true,
  },
];

//@ts-ignore
const mockFormik: FormikContextType<any> = {
  values: {
    json: JSON.stringify(testCaseJson),
  },
};

const testValueSets = [
  {
    oid: "2.16.840.1.113883.3.117.1.7.1.292",
    version: "N/A",
    concepts: [
      {
        code: "4525004",
        code_system_oid: "2.16.840.1.113883.6.96",
        code_system_name: "SNOMEDCT",
        code_system_version: "2023-03",
        display_name: "Emergency department patient visit (procedure)",
      },
    ],
    display_name: "Emergency Department Visit",
  },
];

const renderDataElementsCard = (
  activeTab,
  setCardActiveTab,
  selectedDataElement,
  setSelectedDataElement
) => {
  return render(
    <MemoryRouter>
      <ApiContextProvider value={serviceConfig}>
        <QdmExecutionContextProvider
          value={{
            measureState: [{} as Measure, jest.fn],
            cqmMeasureState: [{ value_sets: testValueSets }, jest.fn],
            executionContextReady: true,
            executing: false,
            setExecuting: jest.fn(),
          }}
        >
          <FormikProvider value={mockFormik}>
            <QdmPatientProvider>
              <DataElementsCard
                cardActiveTab={activeTab}
                setCardActiveTab={setCardActiveTab}
                selectedDataElement={selectedDataElement}
                setSelectedDataElement={setSelectedDataElement}
              />
            </QdmPatientProvider>
          </FormikProvider>
        </QdmExecutionContextProvider>
      </ApiContextProvider>
    </MemoryRouter>
  );
};

describe("DataElementsCard", () => {
  const { queryByText } = screen;
  test("DataElementsCards renders length of stay", async () => {
    await waitFor(() =>
      renderDataElementsCard("attributes", jest.fn, dataEl[0], jest.fn)
    );
    await waitFor(() => {
      expect(queryByText("Length Of Stay: 12 'hours'")).toBeInTheDocument();
    });
  });

  test("DataElementsCard renders codes", async () => {
    await waitFor(() =>
      renderDataElementsCard("codes", jest.fn, dataEl[0], jest.fn)
    );
    const codesChip = await queryByText(
      "Admission Source: SNOMEDCT : 10725009"
    );
    expect(codesChip).toBeInTheDocument();
  });

  test("DataElementsCards renders nothing", async () => {
    await waitFor(() =>
      renderDataElementsCard("codes", jest.fn, testDataElements[0], jest.fn)
    );
    await waitFor(() => {
      expect(
        screen.queryByText("Admission Source: SNOMEDCT : 10725009")
      ).not.toBeInTheDocument();
    });
  });
});

describe("applyAttribute function", () => {
  it("should add a result of date type", () => {
    const cqlDate: CQL.Date = new CQL.Date(2023, 4, 22);
    const dataElement = dataEl[0] as any;
    expect(dataElement.result).toBeFalsy();
    const updatedElement = applyAttribute(
      "Result",
      "Date",
      cqlDate,
      dataElement
    );
    expect(updatedElement.result).toEqual(cqlDate);
    expect(dataElement === updatedElement).toBeFalsy();
  });
});
