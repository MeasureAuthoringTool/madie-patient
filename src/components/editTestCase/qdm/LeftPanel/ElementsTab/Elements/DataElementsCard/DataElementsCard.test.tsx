import * as React from "react";
import { Measure } from "@madie/madie-models";
import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataElementsCard, {
  applyAttribute,
} from "../DataElementsCard/DataElementsCard";
import { CQL, PatientEntity, CarePartner, Identifier } from "cqm-models";
import {
  ApiContextProvider,
  ServiceConfig,
} from "../../../../../../../api/ServiceContext";
import { QdmExecutionContextProvider } from "../../../../../../routes/qdm/QdmExecutionContext";
import { FormikProvider, FormikContextType } from "formik";
import { QdmPatientProvider } from "../../../../../../../util/QdmPatientContext";
import userEvent from "@testing-library/user-event";
import { getDataElementClass } from "../../../../../../../util/DataElementHelper";

const serviceConfig = {
  testCaseService: {
    baseUrl: "base.url",
  },
  measureService: {
    baseUrl: "base.url",
  },
  terminologyService: {
    baseUrl: "http.com",
  },
} as ServiceConfig;

export const testCaseJson = {
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

export const dataEl = [
  {
    admissionSource: {
      code: "10725009",
      system: "2.16.840.1.113883.6.96",
      display: "Benign hypertension (disorder)",
      version: null,
    },
    //authorDatetime: "2012-04-05T08:00:00.000+00:00",
    clazz: null,
    codeListId: "2.16.840.1.113883.3.117.1.7.1.292",
    dataElementCodes: [
      {
        code: "4525004",
        system: "2.16.840.1.113883.6.96",
        version: null,
        display: "Emergency Department Visit",
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
    schema: {
      paths: {
        performer: {
          caster: {
            path: "performer",
            instance: "AnyEntity",
            validators: [],
            getters: [],
            setters: [],
            _presplitPath: ["performer"],
            options: {},
            _index: null,
            _arrayPath: "performer.$",
            _arrayParentPath: "performer",
          },
          path: "performer",
          instance: "Array",
          validators: [],
          getters: [],
          setters: [],
          _presplitPath: ["performer"],
          options: {
            type: [null],
          },
          _index: null,
        },
        result: {
          path: "result",
          instance: "Any",
          validators: [],
          getters: [],
          setters: [],
          _presplitPath: ["result"],
          options: {},
          _index: null,
        },
      },
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
  {
    dataElementCodes: [],
    _id: "64f9cb4600acd60000b74732",
    relatedTo: [],
    performer: [],
    qdmTitle: "Assessment, Performed",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.117",
    qdmCategory: "assessment",
    qdmStatus: "performed",
    qdmVersion: "5.6",
    _type: "QDM::AssessmentPerformed",
    id: "64f9cb4600acd60000b74732",
    components: [],
    codeListId: "2.16.840.1.113883.3.3157.4031",
    description: "Assessment, Performed: Active Peptic Ulcer",
    result: null,
  },
  {
    dataElementCodes: [],
    _id: "64f9cb4600acd60000b74732",
    relatedTo: [],
    performer: [
      {
        qdmVersion: "5.6",
        _type: "QDM::PatientEntity",
        _id: "64fa7f785708322c5dfce804",
        hqmfOid: "2.16.840.1.113883.10.20.28.4.136",
        qrdaOid: "2.16.840.1.113883.10.20.24.3.161",
        id: "PatientEntityID1",
        identifier: {
          qdmVersion: "5.6",
          _type: "QDM::Identifier",
          namingSystem: "IdentifierNamingSystem1",
          value: "IdentifierValue1",
        },
      },
    ],
    qdmTitle: "Assessment, Performed",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.117",
    qdmCategory: "assessment",
    qdmStatus: "performed",
    qdmVersion: "5.6",
    _type: "QDM::AssessmentPerformed",
    id: "64f9cb4600acd60000b74732",
    components: [],
    codeListId: "2.16.840.1.113883.3.3157.4031",
    description: "Assessment, Performed: Active Peptic Ulcer",
    result: null,
  },
];
export const testDataElements = [
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
    negationRationale: {
      code: "10217006",
      system: "2.16.840.1.113883.6.96",
      version: null,
      display: "Third degree perineal laceration (disorder)",
    },
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
    result: 1,
  },
  {
    dataElementCodes: [
      {
        code: "4525004",
        system: "SNOMEDCT",
        version: null,
        display: "Emergency department patient visit (procedure)",
      },
    ],
    _id: "653fde67b0f7260000d5eb9d",
    relatedTo: [],
    performer: [],
    qdmTitle: "Assessment, Performed",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.117",
    qdmCategory: "assessment",
    qdmStatus: "performed",
    qdmVersion: "5.6",
    _type: "QDM::AssessmentPerformed",
    description: "Assessment, Performed: Risk for venous thromboembolism",
    codeListId: "drc-efe800ace1e7ebcd8e49f196420f4f5b",
    id: "653fde6bb0f7260000d5eb9f",
    result: 2323,
    components: [
      {
        qdmVersion: "5.6",
        _type: "QDM::Component",
        _id: "65401988cd7f770000460de5",
        code: {
          code: "133918004",
          system: "2.16.840.1.113883.6.96",
          version: null,
          display: "Comfort measures (regime/therapy)",
        },
        result: 4545,
      },
      {
        qdmVersion: "5.6",
        _type: "QDM::Component",
        _id: "65401999cd7f770000460e16",
        result: "NaN",
      },
    ],
    negationRationale: null,
    relevantPeriod: {
      low: "2023-10-04T00:00:00.000+00:00",
      high: "2023-10-18T00:00:00.000+00:00",
      lowClosed: true,
      highClosed: true,
    },
    relevantDatetime: "2023-10-30T00:00:00.000+00:00",
    authorDatetime: "2023-10-23T00:00:00.000+00:00",
  },
  {
    dataElementCodes: [
      {
        code: "28568-4",
        system: "2.16.840.1.113883.6.1",
        version: null,
        display: "Physician Emergency department Note",
      },
    ],
    _id: "6545107d39e8a400008d7a68",
    relatedTo: [
      "654a289b170fde0000137c07 - Encounter, Performed: Outpatient Surgery Service",
    ],
    performer: [],
    qdmTitle: "Assessment, Performed",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.117",
    qdmCategory: "assessment",
    qdmStatus: "performed",
    qdmVersion: "5.6",
    _type: "QDM::AssessmentPerformed",
    description: "Assessment, Performed: Emergency Department Evaluation",
    codeListId: "2.16.840.1.113762.1.4.1111.163",
    id: "6545108039e8a400008d7a6c",
    components: [],
  },
];

//@ts-ignore
const mockFormik: FormikContextType<any> = {
  values: {
    json: JSON.stringify(testCaseJson),
  },
};

export const testValueSets = [
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

const mockOnChange = jest.fn();

jest.mock("@madie/madie-util", () => ({
  routeHandlerStore: {
    subscribe: (set) => {
      set();
      return { unsubscribe: () => null };
    },
    updateRouteHandlerState: () => null,
    state: { canTravel: true, pendingPath: "" },
    initialState: { canTravel: true, pendingPath: "" },
  },
}));

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
            setExecutionContextReady: jest.fn(),
            executing: false,
            setExecuting: jest.fn(),
            contextFailure: false,
          }}
        >
          <FormikProvider value={mockFormik}>
            <QdmPatientProvider>
              <DataElementsCard
                cardActiveTab={activeTab}
                setCardActiveTab={setCardActiveTab}
                selectedDataElement={selectedDataElement}
                setSelectedDataElement={setSelectedDataElement}
                onChange={mockOnChange}
                canEdit={true}
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

  it("DataElementsCards renders length of stay", async () => {
    const modelClass = getDataElementClass(dataEl[0]);
    const newDataElement = new modelClass(dataEl[0]);
    renderDataElementsCard("attributes", jest.fn, newDataElement, jest.fn);
    await waitFor(() => {
      expect(queryByText("Length Of Stay: 12 'hours'")).toBeInTheDocument();
    });
  });

  it("DataElementsCard renders codes", async () => {
    const modelClass = getDataElementClass(dataEl[0]);
    const newDataElement = new modelClass(dataEl[0]);
    renderDataElementsCard("codes", jest.fn, newDataElement, jest.fn);
    expect(screen.getByTestId("codes-section")).toBeInTheDocument();
  });

  it("DataElementsCards renders nothing", async () => {
    const modelClass = getDataElementClass(testDataElements[0]);
    const newDataElement = new modelClass(testDataElements[0]);
    renderDataElementsCard("codes", jest.fn, newDataElement, jest.fn);
    await waitFor(() => {
      expect(
        screen.queryByText("Admission Source: SNOMEDCT : 10725009")
      ).not.toBeInTheDocument();
    });
  });

  it("Should render Attribute chips and deletes them", async () => {
    const mockSetSelectedElement = jest.fn();
    renderDataElementsCard(
      "attributes",
      jest.fn,
      testDataElements[2],
      mockSetSelectedElement
    );
    const resultChip = await screen.findByText("Result: 1");
    expect(resultChip).toBeInTheDocument();
    const closeButton = await screen.findByTestId("delete-chip-button-0");
    expect(closeButton).toBeInTheDocument();
    userEvent.click(closeButton);

    expect(mockSetSelectedElement).toHaveBeenCalledTimes(1);
  });

  it("Should render Attribute chip for RelatedTo and delete it", async () => {
    const mockSetSelectedElement = jest.fn();
    renderDataElementsCard(
      "attributes",
      jest.fn,
      testDataElements[4],
      mockSetSelectedElement
    );

    const resultChip = await screen.findByText(
      "Related To - : 654a289b170fde0000137c07 - Encounter, Performed: Outpatient Surgery Service"
    );
    expect(resultChip).toBeInTheDocument();
    const closeButton = await screen.findByTestId("delete-chip-button-0");
    expect(closeButton).toBeInTheDocument();
    userEvent.click(closeButton);

    expect(mockSetSelectedElement).toHaveBeenCalledTimes(1);
  });

  it("Should render Attribute chips of array type and deletes them", async () => {
    const mockSetSelectedElement = jest.fn();
    const modelClass = getDataElementClass(testDataElements[3]);
    const newDataElement = new modelClass(testDataElements[3]);
    renderDataElementsCard(
      "attributes",
      jest.fn,
      newDataElement,
      mockSetSelectedElement
    );

    const attributeChipList = await screen.findByTestId("attributes-chip-list");

    const chips = attributeChipList.querySelectorAll(".chip-body");

    expect(chips[0]).toHaveTextContent("Result: 2323");
    const resultChipCloseButton = await screen.findByTestId(
      "delete-chip-button-0"
    );
    userEvent.click(resultChipCloseButton);

    expect(chips[1]).toHaveTextContent(
      "Components - Component: Code: SNOMEDCT : 133918004, Result: 4545"
    );
    const component1CloseButton = await screen.findByTestId(
      "delete-chip-button-1"
    );
    expect(component1CloseButton).toBeInTheDocument();
    userEvent.click(component1CloseButton);

    expect(mockSetSelectedElement).toHaveBeenCalledTimes(2);
  });

  it("Should add new Codes", async () => {
    const modelClass = getDataElementClass(dataEl[0]);
    const newDataElement = new modelClass(dataEl[0]);
    renderDataElementsCard("codes", jest.fn, newDataElement, jest.fn);

    expect(screen.getByTestId("codes-section")).toBeInTheDocument();
    // select the code system
    const codeSystemSelectInput = screen.getByTestId(
      "code-system-selector-input"
    ) as HTMLInputElement;
    expect(codeSystemSelectInput.value).toBe("");
    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole(
      "combobox",
      {
        name: "Code System",
      }
    );
    userEvent.click(codeSystemDropdown);
    const codeSystemOptions = await screen.findAllByTestId(
      /code-system-option/i
    );
    expect(codeSystemOptions).toHaveLength(2);
    userEvent.click(codeSystemOptions[1]);
    expect(codeSystemSelectInput.value).toBe("SNOMEDCT");

    // select the code
    const codeSelectInput = screen.getByTestId(
      "code-selector-input"
    ) as HTMLInputElement;
    expect(codeSelectInput.value).toBe("");
    const codeSelector = screen.getByTestId("code-selector");
    const codeDropdown = within(codeSelector).getByRole("combobox", {
      name: "Code",
    });
    userEvent.click(codeDropdown);
    const codeOptions = await screen.findAllByTestId(/code-option/i);
    expect(codeOptions).toHaveLength(1);
    expect(codeOptions[0]).toHaveTextContent(
      "4525004 - Emergency department patient visit (procedure)"
    );
    userEvent.click(codeOptions[0]);
    expect(codeSelectInput.value).toBe("4525004");

    userEvent.click(screen.getByTestId("add-code-concept-button"));
    // verify chips is added
    expect(await screen.findByTestId("SNOMEDCT_4525004")).toBeInTheDocument();
  });

  it("Should delete data element codes", async () => {
    const mockSetSelectedElement = jest.fn();
    const modelClass = getDataElementClass(dataEl[0]);
    const newDataElement = new modelClass(dataEl[0]);
    renderDataElementsCard(
      "codes",
      jest.fn,
      newDataElement,
      mockSetSelectedElement
    );

    const codeChip = await screen.findByTestId("SNOMEDCT_4525004");
    expect(codeChip).toBeInTheDocument();

    const cancelIcon = within(codeChip).getByTestId("CancelIcon");
    userEvent.click(cancelIcon);
    expect(mockSetSelectedElement).toHaveBeenCalledTimes(1);
  });
});

describe("applyAttribute function", () => {
  it("should add a result of date type", () => {
    const cqlDate: CQL.Date = new CQL.Date(2023, 4, 22);
    const dataElement = dataEl[10] as any;
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

  it("should add an attribute value for array type when array is empty", () => {
    const patientEntity: PatientEntity = new PatientEntity();
    patientEntity.id = "PatientEntityID1";
    patientEntity.identifier = new Identifier({
      namingSystem: "IdentifierNamingSystem1",
      value: "IdentifierValue1",
    });
    const dataElement = dataEl[10] as any;
    expect(dataElement.performer).toBeTruthy();
    expect(dataElement.performer.length).toEqual(0);
    const updatedElement = applyAttribute(
      "Performer",
      "PatientEntity",
      patientEntity,
      dataElement
    );
    expect(updatedElement.performer).toBeTruthy();
    expect(updatedElement.performer.length).toEqual(1);
    expect(updatedElement.performer[0].id).toEqual("PatientEntityID1");
    expect(updatedElement.performer[0].identifier).toBeTruthy();
    expect(updatedElement.performer[0].identifier.value).toEqual(
      "IdentifierValue1"
    );
  });

  it("should add an attribute value for array type when array contains and element", () => {
    const carePartner: CarePartner = new CarePartner();
    carePartner.id = "CarePartnerID2";
    carePartner.identifier = new Identifier({
      namingSystem: "IdentifierNamingSystem2",
      value: "IdentifierValue2",
    });
    const dataElement = dataEl[11] as any;
    expect(dataElement.performer).toBeTruthy();
    expect(dataElement.performer.length).toEqual(1);
    const updatedElement = applyAttribute(
      "Performer",
      "PatientEntity",
      carePartner,
      dataElement
    );
    expect(updatedElement.performer).toBeTruthy();
    expect(updatedElement.performer.length).toEqual(2);
    expect(updatedElement.performer[0].id).toEqual("PatientEntityID1");
    expect(updatedElement.performer[0].identifier).toBeTruthy();
    expect(updatedElement.performer[0].identifier.value).toEqual(
      "IdentifierValue1"
    );
    expect(updatedElement.performer[1].id).toEqual("CarePartnerID2");
    expect(updatedElement.performer[1].identifier).toBeTruthy();
    expect(updatedElement.performer[1].identifier.value).toEqual(
      "IdentifierValue2"
    );
  });
});

describe("Negation Rationale", () => {
  it("DataElementsCard renders negation rationale", async () => {
    renderDataElementsCard(
      "negation_rationale",
      jest.fn,
      testDataElements[1],
      jest.fn
    );
    expect(
      await screen.findByTestId("negation-rationale-div")
    ).toBeInTheDocument();

    const valueSetsInput = screen.getByTestId(
      "value-set-selector-input"
    ) as HTMLInputElement;
    expect(valueSetsInput.value).toBe("");
    const valueSetSelector = screen.getByTestId("value-set-selector");
    const valueSetDropdown = within(valueSetSelector).getByRole("combobox", {
      name: "Value Set / Direct Reference Code",
    }) as HTMLInputElement;
    userEvent.click(valueSetDropdown);

    const valueSetOptions = await screen.findAllByRole("option");
    expect(valueSetOptions).toHaveLength(2);
    // by default code system and code dropdown is not displayed unless user choose value set
    expect(
      screen.queryByTestId("code-system-selector")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("code-selector")).not.toBeInTheDocument();
    expect(screen.queryByTestId("custom-code-system")).not.toBeInTheDocument();
    expect(screen.queryByTestId("custom-code")).not.toBeInTheDocument();
    expect(
      screen.getByTestId("2.16.840.1.113883.6.96 : 10217006")
    ).toBeInTheDocument();
  });

  it("Should allow user to choose negation rationale value set, code and system", async () => {
    const modelClass = getDataElementClass(testDataElements[1]);
    const newDataElement = new modelClass(testDataElements[1]);
    const mockSetSelectedDataElement = jest.fn();
    renderDataElementsCard(
      "negation_rationale",
      jest.fn,
      newDataElement,
      mockSetSelectedDataElement
    );

    expect(
      await screen.findByTestId("negation-rationale-div")
    ).toBeInTheDocument();

    const addNegationRationale = screen.getByRole("button", { name: "Add" });
    expect(addNegationRationale).toBeDisabled();

    const valueSetsInput = screen.getByTestId(
      "value-set-selector-input"
    ) as HTMLInputElement;
    expect(valueSetsInput.value).toBe("");
    const valueSetSelector = screen.getByTestId("value-set-selector");
    const valueSetDropdown = within(valueSetSelector).getByRole("combobox", {
      name: "Value Set / Direct Reference Code",
    }) as HTMLInputElement;
    userEvent.click(valueSetDropdown);
    const valueSetOptions = await screen.findAllByRole("option");
    userEvent.click(valueSetOptions[1]);

    // select the code system
    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole(
      "combobox",
      { name: "Code System" }
    );
    userEvent.click(codeSystemDropdown);
    const codeSystemOptions = await screen.findAllByRole("option");
    expect(codeSystemOptions[0]).toHaveTextContent("SNOMEDCT");
    userEvent.click(codeSystemOptions[0]);

    // select the code
    const codeSelector = screen.getByTestId("code-selector");
    const codeDropdown = within(codeSelector).getByRole("combobox", {
      name: "Code",
    });
    userEvent.click(codeDropdown);
    const codeOptions = await screen.findAllByRole("option");
    expect(codeOptions).toHaveLength(1);
    expect(codeOptions[0]).toHaveTextContent(
      "4525004 - Emergency department patient visit (procedure)"
    );
    userEvent.click(codeOptions[0]);

    //add negation rationale
    expect(addNegationRationale).toBeEnabled();
    userEvent.click(addNegationRationale);

    expect(mockSetSelectedDataElement).toHaveBeenCalledTimes(1);
  });
});
