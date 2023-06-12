import {
  QDMPatient,
  DataElement,
  DataElementCode,
  PatientCharacteristicRace,
  PatientCharacteristicEthnicity,
  PatientCharacteristicBirthdate,
  PatientCharacteristicSex,
  PatientCharacteristicExpired,
} from "cqm-models";

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

export const ETHNICITY_CODE_OPTIONS: DataElementCode[] = [
  {
    code: "2135-2",
    display: "Hispanic or Latino",
    version: "1.2",
    system: "2.16.840.1.113883.6.238",
  },
  {
    code: "2186-5",
    display: "Not Hispanic or Latino",
    version: "1.2",
    system: "2.16.840.1.113883.6.238",
  },
];

export const LIVING_STATUS_CODE_OPTIONS = [
  {
    code: "2186-5",
    version: null,
    system: "2.16.840.1.113883.6.238",
    display: "Living",
  },
  {
    code: "2135-2",
    version: null,
    system: "2.16.840.1.113883.6.238",
    display: "Deceased",
  },
];

export const getBirthDateElement = (value): DataElement => {
  const pcb: DataElement = new PatientCharacteristicBirthdate();
  pcb.birthDatetime = value;
  return pcb;
};

// given a value, return a data element
export const getRaceDataElement = (value: string): DataElement => {
  const newCode: DataElementCode = getNewCode(RACE_CODE_OPTIONS, value);
  const pcr: DataElement = new PatientCharacteristicRace();
  pcr.dataElementCodes = [newCode];
  return pcr;
};

export const getGenderDataElement = (value: string): DataElement => {
  const newCode: DataElementCode = getNewCode(GENDER_CODE_OPTIONS, value);
  const pcs: DataElement = new PatientCharacteristicSex();
  pcs.dataElementCodes = [newCode];
  return pcs;
};

export const getEthnicityDataElement = (value: string): DataElement => {
  const newCode: DataElementCode = getNewCode(ETHNICITY_CODE_OPTIONS, value);
  const pce: DataElement = new PatientCharacteristicEthnicity();
  pce.dataElementCodes = [newCode];
  return pce;
};

export const getLivingStatusDataElement = (value: string): DataElement => {
  const newCode: DataElementCode = getNewCode(
    LIVING_STATUS_CODE_OPTIONS,
    value
  );
  const pce: DataElement = new PatientCharacteristicExpired();
  pce.dataElementCodes = [newCode];

  return pce;
};

// export const getExpiredStatusDataElement = (value: string) => {
//   const newCode = test(
//     Expired_CODE_OPTIONS,
//     value
//   );
//   console.log(newCode)
//   const pce  = new PatientCharacteristicExpired();
//   pce.expired = [newCode];
//   console.log(pce)
//   return pce;
// }

// export const test= (options, selectedValue: string) => {
//   const found: CodeSystem = options.find(
//     (option) => selectedValue === option.display
//   );
//   const newCode: DataElementCode = {
//     display: found?.display,
//   };
//   return newCode;
// }

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
