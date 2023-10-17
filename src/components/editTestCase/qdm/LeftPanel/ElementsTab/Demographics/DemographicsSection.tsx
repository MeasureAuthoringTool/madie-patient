import React, { useEffect, useState } from "react";
import ElementSection from "../../../../../common/ElementSection";
import { InputLabel, Select } from "@madie/madie-design-system/dist/react";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import EventIcon from "@mui/icons-material/Event";
import { useFormikContext } from "formik";

import { DataElement, QDMPatient } from "cqm-models";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
  birthDateLabelStyle,
  textFieldStyle,
  timeTextFieldStyle,
} from "./DemographicsSectionStyles";
import "./DemographicsSection.scss";
import utc from "dayjs/plugin/utc";

// utils for
import {
  ETHNICITY_CODE_OPTIONS,
  GENDER_CODE_OPTIONS,
  getBirthDateElement,
  getEthnicityDataElement,
  getGenderDataElement,
  getLivingStatusDataElement,
  getRaceDataElement,
  LIVING_STATUS_CODE_OPTIONS,
  RACE_CODE_OPTIONS,
} from "./DemographicsSectionConst";
import { MenuItem as MuiMenuItem } from "@mui/material";
import {
  PatientActionType,
  useQdmPatient,
} from "../../../../../../util/QdmPatientContext";

export interface CodeSystem {
  code: string;
  display: string;
  version: string;
  system: string;
}

const DemographicsSection = ({ canEdit }) => {
  dayjs.extend(utc);
  dayjs.utc().format(); // utc format
  const { state, dispatch } = useQdmPatient();
  const { patient } = state;
  // this will be local
  const [raceDataElement, setRaceDataElement] = useState<DataElement>();
  const [genderDataElement, setGenderDataElement] = useState<DataElement>();
  const [ethnicityDataElement, setEthnicityDataElement] =
    useState<DataElement>();
  const [livingStatusDataElement, setLivingStatusDataElement] =
    useState<DataElement>();

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

  const getDataElementByStatus = (status: string, patient: QDMPatient) => {
    return patient?.dataElements?.find(
      (element) => element?.qdmStatus === status
    );
  };

  // this populates the json making it able to be edited. we should only do this before change
  useEffect(() => {
    // save local patient
    if (patient) {
      const raceElement = getDataElementByStatus("race", patient);
      if (raceElement) {
        setRaceDataElement(raceElement);
      } else {
        setRaceDataElement(undefined);
      }

      const genderElement = getDataElementByStatus("gender", patient);
      if (genderElement) {
        setGenderDataElement(genderElement);
      } else {
        setGenderDataElement(undefined);
      }

      const ethnicity = getDataElementByStatus("ethnicity", patient);
      if (ethnicity) {
        setEthnicityDataElement(ethnicity);
      } else {
        setEthnicityDataElement(undefined);
      }

      const expiredElement = getDataElementByStatus("expired", patient);
      if (expiredElement) {
        setLivingStatusDataElement(expiredElement);
      } else {
        setLivingStatusDataElement("Living");
      }
    }
  }, [patient]);

  // gender race change
  const handleRaceChange = (event) => {
    const existingElement = getDataElementByStatus("race", patient);
    const newRaceDataElement: DataElement = getRaceDataElement(
      event.target.value,
      existingElement
    );
    setRaceDataElement(newRaceDataElement);
    dispatch({
      type: existingElement
        ? PatientActionType.MODIFY_DATA_ELEMENT
        : PatientActionType.ADD_DATA_ELEMENT,
      payload: newRaceDataElement,
    });
  };

  const handleGenderChange = (event) => {
    const existingElement = getDataElementByStatus("gender", patient);
    const newGenderDataElement: DataElement = getGenderDataElement(
      event.target.value,
      existingElement
    );
    setGenderDataElement(newGenderDataElement);
    dispatch({
      type: existingElement
        ? PatientActionType.MODIFY_DATA_ELEMENT
        : PatientActionType.ADD_DATA_ELEMENT,
      payload: newGenderDataElement,
    });
  };

  const handleEthnicityChange = (event) => {
    const existingElement = getDataElementByStatus("ethnicity", patient);
    const newEthnicityDataElement: DataElement = getEthnicityDataElement(
      event.target.value,
      existingElement
    );
    setEthnicityDataElement(newEthnicityDataElement);
    dispatch({
      type: existingElement
        ? PatientActionType.MODIFY_DATA_ELEMENT
        : PatientActionType.ADD_DATA_ELEMENT,
      payload: newEthnicityDataElement,
    });
  };

  const handleLivingStatusChange = (event) => {
    if (event.target.value !== "Living") {
      const newLivingStatusDataElement: DataElement =
        getLivingStatusDataElement();
      setLivingStatusDataElement(newLivingStatusDataElement);
      dispatch({
        type: PatientActionType.ADD_DATA_ELEMENT,
        payload: newLivingStatusDataElement,
      });
    } else {
      setLivingStatusDataElement(event.target.value);
      const expiredElement = getDataElementByStatus("expired", patient);
      if (expiredElement) {
        dispatch({
          type: PatientActionType.REMOVE_DATA_ELEMENT,
          payload: expiredElement,
        });
      }
    }
  };

  const handleTimeChange = (val) => {
    const formatted = dayjs.utc(val).format();
    const existingElement = getDataElementByStatus("birthdate", patient);
    const newTimeElement = getBirthDateElement(formatted, existingElement);
    dispatch({
      type: existingElement
        ? PatientActionType.MODIFY_DATA_ELEMENT
        : PatientActionType.ADD_DATA_ELEMENT,
      payload: newTimeElement,
    });
    dispatch({
      type: PatientActionType.SET_BIRTHDATETIME,
      payload: val,
    });
  };

  return (
    <div>
      <ElementSection
        title="Demographics"
        children={
          <div className="demographics-container">
            {/* container */}
            <div className="demographics-row">
              <div className="birth-date">
                <FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <InputLabel
                      required
                      htmlFor={"birth-date"}
                      style={{ marginBottom: 0, height: 16 }} // force a heignt
                      sx={birthDateLabelStyle}
                    >
                      Date of Birth
                    </InputLabel>
                    <div style={{ display: "flex" }}>
                      <DatePicker
                        disabled={!canEdit}
                        value={
                          patient?.birthDatetime
                            ? dayjs(patient?.birthDatetime)
                            : null
                        }
                        onChange={(newValue: any) => {
                          const currentDate = dayjs(patient?.birthDatetime);
                          const newDate = dayjs(currentDate)
                            .set("year", newValue?.$y)
                            .set("month", newValue?.$M)
                            .set("date", newValue?.$D);

                          handleTimeChange(newDate);
                        }}
                        slotProps={{
                          textField: {
                            id: "birth-date",
                            sx: textFieldStyle,
                          },
                        }}
                      />
                      <TimePicker
                        disableOpenPicker
                        disabled={!canEdit}
                        value={
                          patient?.birthDatetime
                            ? dayjs(patient?.birthDatetime)
                            : null
                        }
                        onChange={(newValue: any, v) => {
                          const currentDate = patient?.birthDatetime;
                          // hours and minute seem to already take into account AMPM
                          const newDate = dayjs(currentDate)
                            .set("hour", newValue?.$H)
                            .set("minute", newValue?.$m);
                          handleTimeChange(newDate);
                        }}
                        slotProps={{
                          textField: {
                            sx: timeTextFieldStyle,
                          },
                        }}
                      />
                    </div>
                  </LocalizationProvider>
                </FormControl>
              </div>
              <FormControl>
                <Select
                  labelId="demographics-living-status-select-label"
                  id="demographics-living-status-select-id"
                  defaultValue="Living"
                  label="Living Status"
                  disabled={!canEdit}
                  inputProps={{
                    "data-testid": `demographics-living-status-input`,
                  }}
                  value={
                    livingStatusDataElement?.qdmStatus === "expired"
                      ? "Expired"
                      : "Living"
                  }
                  onChange={handleLivingStatusChange}
                  options={selectOptions(LIVING_STATUS_CODE_OPTIONS)}
                ></Select>
              </FormControl>
              <FormControl>
                <Select
                  labelId="demographics-race-select-label"
                  id="demographics-race-select-id"
                  defaultValue="American Indian or Alaska Native"
                  label="Race"
                  disabled={!canEdit}
                  inputProps={{
                    "data-testid": `demographics-race-input`,
                  }}
                  value={raceDataElement?.dataElementCodes?.[0].display ?? ""}
                  placeHolder={{ name: "Select a Race", value: "" }}
                  onChange={handleRaceChange}
                  options={selectOptions(RACE_CODE_OPTIONS)}
                ></Select>
              </FormControl>
              <FormControl>
                <Select
                  labelId="demographics-gender-select-label"
                  id="demographics-gender-select-id"
                  defaultValue="Female"
                  label="Gender"
                  disabled={!canEdit}
                  inputProps={{
                    "data-testid": `demographics-gender-input`,
                  }}
                  value={genderDataElement?.dataElementCodes?.[0].display ?? ""}
                  placeHolder={{ name: "Select a Gender", value: "" }}
                  onChange={handleGenderChange}
                  options={selectOptions(GENDER_CODE_OPTIONS)}
                ></Select>
              </FormControl>
            </div>
            <div className="demographics-row">
              <FormControl>
                <Select
                  labelId="demographics-ethnicity-select-label"
                  id="demographics-ethnicity-select-id"
                  defaultValue="Hispanic or Latino"
                  label="Ethnicity"
                  disabled={!canEdit}
                  inputProps={{
                    "data-testid": `demographics-ethnicity-input`,
                  }}
                  value={
                    ethnicityDataElement?.dataElementCodes?.[0].display ?? ""
                  }
                  placeHolder={{ name: "Select an Ethnicity", value: "" }}
                  onChange={handleEthnicityChange}
                  options={selectOptions(ETHNICITY_CODE_OPTIONS)}
                  style={{ minWidth: "250px" }}
                ></Select>
              </FormControl>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default DemographicsSection;
