import React, { useEffect, useState } from "react";
import "./TabHeading.scss";
import { Select } from "@madie/madie-design-system/dist/react";
import { TestCase } from "@madie/madie-models";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { MenuItem as MuiMenuItem } from "@mui/material";
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

const Demographics = (props: {
  currentTestCase: TestCase;
  setTestCaseJson;
  canEdit: boolean;
}) => {
  const [qdmPatient, setQdmPatient] = useState<QDMPatient>();
  const [raceDataElement, setRaceDataElement] = useState<DataElement>();
  const [genderDataElement, setGenderDataElement] = useState<DataElement>();

  const selectOptions = (options) => {
    return [
      options
        .sort((a, b) => a.display.localeCompare(b.display))
        .map((opt, i) => {
          const sanitizedString = opt.display.replace(/"/g, "");
          return (
            <MuiMenuItem
              key={`${sanitizedString}-${i}`}
              value={sanitizedString}
            >
              {sanitizedString}
            </MuiMenuItem>
          );
        }),
    ];
  };

  useEffect(() => {
    let patient: QDMPatient = null;
    if (props.currentTestCase?.json) {
      patient = JSON.parse(props.currentTestCase?.json);
    }
    if (patient) {
      setQdmPatient(patient);
      const dataElements: DataElement[] = patient.dataElements;

      dataElements.forEach((element) => {
        if (element.qdmStatus === "race") {
          setRaceDataElement(element);
        }
        if (element.qdmStatus === "gender") {
          setGenderDataElement(element);
        }
      });
    } else {
      const newRaceDataElement: DataElement = getRaceDataElement(
        "American Indian or Alaska Native"
      );
      setRaceDataElement(newRaceDataElement);

      const newGenderDataElement: DataElement = getGenderDataElement("Female");
      setGenderDataElement(newGenderDataElement);

      const patient: QDMPatient = new QDMPatient();
      patient.qdmVersion = "5.6";
      let dataElements: DataElement[] = [];
      dataElements.push(newRaceDataElement);
      dataElements.push(newGenderDataElement);
      patient.dataElements = dataElements;
      setQdmPatient(patient);
      props.setTestCaseJson(JSON.stringify(patient));
    }
  }, [props.currentTestCase]);

  const generateNewQdmPatient = (newElement: DataElement, type: string) => {
    const patient: QDMPatient = new QDMPatient();
    patient.qdmVersion = "5.6";
    let dataElements: DataElement[] = [];
    dataElements.push(newElement);
    const otherElements: DataElement[] = qdmPatient?.dataElements?.filter(
      (element) => {
        return element.qdmStatus !== type;
      }
    );
    if (otherElements) {
      otherElements.forEach((element) => {
        dataElements.push(element);
      });
    }
    patient.dataElements = dataElements;
    // console.log(
    //   "generateNewQdmPatient(): patient = " + JSON.stringify(patient)
    // );
    setQdmPatient(patient);
    props.setTestCaseJson(JSON.stringify(patient));
  };

  const handleRaceChange = (event) => {
    const newRaceDataElement: DataElement = getRaceDataElement(
      event.target.value
    );
    setRaceDataElement(newRaceDataElement);
    generateNewQdmPatient(newRaceDataElement, "race");
  };

  const getRaceDataElement = (value: string): DataElement => {
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

  const handleGenderChange = (event) => {
    const newGenderDataElement: DataElement = getGenderDataElement(
      event.target.value
    );
    setGenderDataElement(newGenderDataElement);
    generateNewQdmPatient(newGenderDataElement, "gender");
  };

  const getGenderDataElement = (value: string): DataElement => {
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

  const getNewCode = (options, selectedValue: string) => {
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

  return (
    <div style={{ display: "flex" }}>
      <Box sx={{ minWidth: "30%" }}>
        <FormControl fullWidth>
          <Select
            labelId="demographics-race-select-label"
            id="demographics-race-select-id"
            defaultValue="American Indian or Alaska Native"
            label="Race"
            disabled={!props.canEdit}
            inputProps={{
              "data-testid": `demographics-race-input`,
            }}
            value={
              raceDataElement?.dataElementCodes?.[0].display ||
              "American Indian or Alaska Native"
            }
            onChange={handleRaceChange}
            options={selectOptions(RACE_CODE_OPTIONS)}
          ></Select>
        </FormControl>
      </Box>

      <Box sx={{ maxWidth: "20%", paddingLeft: 1 }}>
        <FormControl fullWidth>
          <Select
            labelId="demographics-gender-select-label"
            id="demographics-gender-select-id"
            defaultValue="Female"
            label="Gender"
            disabled={!props.canEdit}
            inputProps={{
              "data-testid": `demographics-gender-input`,
            }}
            value={genderDataElement?.dataElementCodes?.[0].display || "Female"}
            onChange={handleGenderChange}
            options={selectOptions(GENDER_CODE_OPTIONS)}
          ></Select>
        </FormControl>
      </Box>
    </div>
  );
};

export default Demographics;
