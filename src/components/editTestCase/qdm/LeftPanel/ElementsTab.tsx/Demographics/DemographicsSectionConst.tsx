import { QDMPatient, DataElement, DataElementCode } from "cqm-models";

export interface CodeSystem {
  code: string;
  display: string;
  version: string;
  system: string;
}

export const RACE_CODE_OPTIONS: DataElementCode[] = [
  {
    code: "1002-5",
    display: "American Indian or Alaska Native",
    version: "1.2",
    system: "2.16.840.1.113883.6.238",
  },
  {
    code: "2028-9",
    display: "Asian",
    version: "1.2",
    system: "2.16.840.1.113883.6.238",
  },
  {
    code: "2054-5",
    display: "Black or African American",
    version: "1.2",
    system: "2.16.840.1.113883.6.238",
  },
  {
    code: "2076-8",
    display: "Native Hawaiian or Other Pacific Islander",
    version: "1.2",
    system: "2.16.840.1.113883.6.238",
  },
  {
    code: "2106-3",
    display: "White",
    version: "1.2",
    system: "2.16.840.1.113883.6.238",
  },
  {
    code: "2131-1",
    display: "Other Race",
    version: "1.2",
    system: "2.16.840.1.113883.6.238",
  },
];

export const GENDER_CODE_OPTIONS: DataElementCode[] = [
  {
    code: "F",
    display: "Female",
    version: "2022-11",
    system: "2.16.840.1.113883.5.1",
  },
  {
    code: "M",
    display: "Male",
    version: "2022-11",
    system: "2.16.840.1.113883.5.1",
  },
];

export const getBirthDateElement = (value): DataElement => {
  const newBirthDateElement: DataElement = {
    dataElementCodes: [
      {
        code: "21112-8",
        system: "2.16.840.1.113883.6.1",
        version: null,
        display: "Birth date",
      },
    ],
    qdmTitle: "Patient Characteristic Birthdate",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.54",
    qdmCategory: "patient_characteristic",
    qdmStatus: "birthdate",
    qdmVersion: "5.6",
    _type: "QDM::PatientCharacteristicBirthdate",
    description: "Patient Characteristic Birthdate: Birth date",
    codeListId:
      "drc-c48426f721cede4d865df946157d5e2dc90bd32763ffcb982ca45b3bd97a29db",
    birthDatetime: value,
    // birthDatetime: "1985-01-01T08:00:00.000+00:00",
    // _id: "609d95acb789028849ab7be4",
    // id: "609d95acb789028849ab7be4" ??
  };
  return newBirthDateElement;
};

// given a value, return a data element
export const getRaceDataElement = (value: string): DataElement => {
  const newCode: DataElementCode = getNewCode(RACE_CODE_OPTIONS, value);
  const newRaceDataElement: DataElement = {
    dataElementCodes: [newCode],
    qdmTitle: "Patient Characteristic Race",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.59",
    qdmCategory: "patient_characteristic",
    qdmStatus: "race",
    qdmVersion: "5.6",
    _type: "QDM::PatientCharacteristicRace",
    description: "Patient Characteristic Race: Race",
    codeListId: "2.16.840.1.114222.4.11.836",

    //ids???
    // _id: "609d95acb789028849ab7bcc",
    // id: "609d95acb789028849ab7bcc",
  };
  return newRaceDataElement;
};

export const getGenderDataElement = (value: string): DataElement => {
  const newCode: DataElementCode = getNewCode(GENDER_CODE_OPTIONS, value);
  const newGenderDataElement: DataElement = {
    dataElementCodes: [newCode],
    qdmTitle: "Patient Characteristic Sex",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.55",
    qdmCategory: "patient_characteristic",
    qdmStatus: "gender",
    qdmVersion: "5.6",
    _type: "QDM::PatientCharacteristicSex",
    description: "Patient Characteristic Sex: ONCAdministrativeSex",
    codeListId: "2.16.840.1.113762.1.4.1",
  };
  return newGenderDataElement;
};

export const getNewCode = (options, selectedValue: string) => {
  const found: CodeSystem = options.find(
    (option) => selectedValue === option.display
  );
  const newCode: DataElementCode = {
    code: found?.code,
    system: found?.system,
    version: found?.version,
    display: found?.display,
  };
  return newCode;
};
