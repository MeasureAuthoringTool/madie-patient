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
    version: undefined,
    system: "2.16.840.1.113883.6.238",
  },
  {
    code: "2028-9",
    display: "Asian",
    version: undefined,
    system: "2.16.840.1.113883.6.238",
  },
  {
    code: "2054-5",
    display: "Black or African American",
    version: undefined,
    system: "2.16.840.1.113883.6.238",
  },
  {
    code: "2076-8",
    display: "Native Hawaiian or Other Pacific Islander",
    version: undefined,
    system: "2.16.840.1.113883.6.238",
  },
  {
    code: "2106-3",
    display: "White",
    version: undefined,
    system: "2.16.840.1.113883.6.238",
  },
  {
    code: "2131-1",
    display: "Other Race",
    version: undefined,
    system: "2.16.840.1.113883.6.238",
  },
];

export const GENDER_CODE_OPTIONS: DataElementCode[] = [
  {
    system: "http://snomed.info/sct",
    version: "http://snomed.info/sct/731000124108/version/20240901",
    code: "184115007",
    display: "Patient sex unknown (finding)",
  },
  {
    system: "http://snomed.info/sct",
    version: "http://snomed.info/sct/731000124108/version/20240901",
    code: "248152002",
    display: "Female (finding)",
  },
  {
    system: "http://snomed.info/sct",
    version: "http://snomed.info/sct/731000124108/version/20240901",
    code: "248153007",
    display: "Male (finding)",
  },
  {
    system: "http://terminology.hl7.org/CodeSystem/v3-AdministrativeGender",
    version: "2023-02-01",
    code: "F",
    display: "Female",
  },
  {
    system: "http://terminology.hl7.org/CodeSystem/v3-AdministrativeGender",
    version: "2023-02-01",
    code: "M",
    display: "Male",
  },
  {
    system: "http://terminology.hl7.org/CodeSystem/data-absent-reason",
    version: "0.1.0",
    code: "asked-declined",
    display: "Asked But Declined",
  },
];

export const ETHNICITY_CODE_OPTIONS: DataElementCode[] = [
  {
    code: "2135-2",
    display: "Hispanic or Latino",
    version: undefined,
    system: "2.16.840.1.113883.6.238",
  },
  {
    code: "2186-5",
    display: "Not Hispanic or Latino",
    version: undefined,
    system: "2.16.840.1.113883.6.238",
  },
];

export const LIVING_STATUS_CODE_OPTIONS = ["Living", "Expired"];

export const getBirthDateElement = (
  value,
  existingElement: DataElement
): DataElement => {
  const pcb: DataElement = existingElement
    ? new PatientCharacteristicBirthdate(existingElement)
    : new PatientCharacteristicBirthdate();
  pcb.birthDatetime = value;
  return pcb;
};

// given a value, return a data element
export const getRaceDataElement = (
  value: string,
  existingElement: DataElement
): DataElement => {
  const newCode: DataElementCode = getNewCode(RACE_CODE_OPTIONS, value);
  const pcr: DataElement = existingElement
    ? new PatientCharacteristicRace(existingElement)
    : new PatientCharacteristicRace();
  pcr.dataElementCodes = [newCode];
  return pcr;
};

export const getGenderDataElement = (
  value: string,
  existingElement: DataElement
): DataElement => {
  const newCode: DataElementCode = getNewCode(GENDER_CODE_OPTIONS, value);
  const pcs: DataElement = existingElement
    ? new PatientCharacteristicSex(existingElement)
    : new PatientCharacteristicSex();
  pcs.dataElementCodes = [newCode];
  return pcs;
};

export const getEthnicityDataElement = (
  value: string,
  existingElement: DataElement
): DataElement => {
  const newCode: DataElementCode = getNewCode(ETHNICITY_CODE_OPTIONS, value);
  const pce: DataElement = existingElement
    ? new PatientCharacteristicEthnicity(existingElement)
    : new PatientCharacteristicEthnicity();
  pce.dataElementCodes = [newCode];
  return pce;
};

export const getLivingStatusDataElement = (): DataElement => {
  const pce: DataElement = new PatientCharacteristicExpired();
  pce.dataElementCodes = [];
  return pce;
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
