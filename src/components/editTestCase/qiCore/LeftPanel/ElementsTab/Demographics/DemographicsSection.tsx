import React, { useState } from "react";
import ElementSection from "../../../../../common/ElementSection";
import { Select, InputLabel } from "@madie/madie-design-system/dist/react";
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
import { FormControl, MenuItem as MuiMenuItem } from "@mui/material";
const selectOptions = (options) => {
  return [
    options
      .sort((a, b) =>
        a.display && b.display
          ? a.display.localeCompare(b.display)
          : a.localeCompare(b)
      )
      .map((opt, i) => {
        const { display } = opt || {};
        const sanitizedString = display
          ? display.replace(/"/g, "")
          : opt?.replace(/"/g, "");
        return (
          <MuiMenuItem key={`${sanitizedString}-${i}`} value={sanitizedString}>
            {sanitizedString}
          </MuiMenuItem>
        );
      }),
  ];
};
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

export const DETAILED_ETHNICITY_CODE_OPTIONS: DataElementCode[] = [
  {
    code: "2137-8",
    display: "Spaniard",
    version: "1.2",
    system: "2.16.840.1.113883.6.238",
  },
  {
    code: "2148-5",
    display: "Mexican",
    version: "1.2",
    system: "2.16.840.1.113883.6.238",
  },
  {
    code: "2155-0",
    display: "Central American",
    version: "1.2",
    system: "2.16.840.1.113883.6.238",
  },
  {
    code: "2165-9",
    display: "South American",
    version: "1.2",
    system: "2.16.840.1.113883.6.238",
  },
];

const DemographicsSection = ({ canEdit }) => {
  const [show, setShow] = useState<boolean>(false);
  const handleChange = (event) => {
    setShow(event.target.value === "Hispanic or Latino");
  };
  return (
    <div>
      <ElementSection
        title="Demographics "
        children={
          <>
            <FormControl>
              <Select
                labelId="demographics-ethnicity-select-label"
                id="demographics-ethnicity-select-id"
                data-testid="demographics-ethnicity-select-id"
                aria-labelledby="ethnicity-label"
                defaultValue="Select One"
                label="Ethnicity (OMB)"
                disabled={!canEdit}
                inputProps={{
                  "data-testid": `demographics-ethnicity-input`,
                }}
                onChange={handleChange}
                options={selectOptions(ETHNICITY_CODE_OPTIONS)}
                style={{ minWidth: "250px" }}
              ></Select>
            </FormControl>
            {show && (
              <FormControl>
                <Select
                  labelId="demographics-detailed-ethnicity-select-label"
                  id="demographics-detailed-ethnicity-select-id"
                  data-testid="demographics-detailed-ethnicity-select-id"
                  defaultValue="Select One"
                  label="Ethnicity (Detailed)"
                  disabled={!canEdit}
                  inputProps={{
                    "data-testid": `demographics-detailed-ethnicity-input`,
                  }}
                  options={selectOptions(DETAILED_ETHNICITY_CODE_OPTIONS)}
                  style={{ minWidth: "250px" }}
                ></Select>
              </FormControl>
            )}
          </>
        }
      />
    </div>
  );
};

export default DemographicsSection;
