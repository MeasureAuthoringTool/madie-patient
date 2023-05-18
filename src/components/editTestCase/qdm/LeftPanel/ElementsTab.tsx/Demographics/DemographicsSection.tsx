import React, { useState, useEffect } from "react";
import ElementSection from "../ElementSection";
import { Select, InputLabel } from "@madie/madie-design-system/dist/react";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import EventIcon from "@mui/icons-material/Event";
import { useFormikContext } from "formik";

// import customParseFormat from "dayjs/plugin/customParseFormat";
import { QDMPatient, DataElement, DataElementCode } from "cqm-models";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
  textFieldStyle,
  timeTextFieldStyle,
} from "./DemographicsSectionStyles";
import "./DemographicsSection.scss";
import utc from "dayjs/plugin/utc";

// utils for
import {
  RACE_CODE_OPTIONS,
  GENDER_CODE_OPTIONS,
  getGenderDataElement,
  getBirthDateElement,
  getNewCode,
  getRaceDataElement,
} from "./DemographicsSectionConst";
import { MenuItem as MuiMenuItem } from "@mui/material";

export interface CodeSystem {
  code: string;
  display: string;
  version: string;
  system: string;
}

const DemographicsSection = ({ canEdit }) => {
  dayjs.extend(utc);
  dayjs.utc().format(); // utc format
  const formik: any = useFormikContext();

  // select stuff
  const [qdmPatient, setQdmPatient] = useState<QDMPatient>();
  // this will be local
  const [raceDataElement, setRaceDataElement] = useState<DataElement>();
  const [genderDataElement, setGenderDataElement] = useState<DataElement>();
  const [birthDateElement, setBirthDateElement] = useState<DataElement>();

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

  // this populates the json making it able to be edited. we should only do this before change
  useEffect(() => {
    let patient: QDMPatient = null;
    // if (props.currentTestCase?.json) {
    if (formik.values?.json) {
      patient = JSON.parse(formik.values.json);
    }
    // save local patient
    if (patient) {
      setQdmPatient(patient);
      const dataElements: DataElement[] = patient.dataElements;

      // what is the purpose of this intermediate
      dataElements.forEach((element) => {
        if (element.qdmStatus === "race") {
          setRaceDataElement(element);
        }
        if (element.qdmStatus === "gender") {
          setGenderDataElement(element);
        }
        // seems unecessary?
        if (element.qdmStatus === "birthdate") {
          setBirthDateElement(element);
        }
      });
    } else {
      // default values for QDM patient. to do race and gender default values?
      const newRaceDataElement: DataElement = getRaceDataElement(
        "American Indian or Alaska Native"
      );
      setRaceDataElement(newRaceDataElement);
      const newGenderDataElement: DataElement = getGenderDataElement("Female");
      setGenderDataElement(newGenderDataElement);
      // unneeded ?
      const newbirthDateElement = getBirthDateElement(dayjs());
      setBirthDateElement(newbirthDateElement);

      const patient: QDMPatient = new QDMPatient();
      patient.qdmVersion = "5.6";
      setQdmPatient(patient);
    }
  }, [formik.values.json]);

  // given element and type make this return instead
  const generateNewQdmPatient = (newElement: DataElement, type: string) => {
    const patient: QDMPatient = new QDMPatient();
    patient.qdmVersion = "5.6";
    if (qdmPatient.birthDatetime) {
      patient.birthDatetime = qdmPatient.birthDatetime;
    }
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
    // save local
    patient.dataElements = dataElements;
    return patient;
  };

  // gender race change
  const handleRaceChange = (event) => {
    const newRaceDataElement: DataElement = getRaceDataElement(
      event.target.value
    );
    setRaceDataElement(newRaceDataElement);
    const patient = generateNewQdmPatient(newRaceDataElement, "race");
    setQdmPatient(patient);
    formik.setFieldValue("json", JSON.stringify(patient));
  };

  const handleGenderChange = (event) => {
    const newGenderDataElement: DataElement = getGenderDataElement(
      event.target.value
    );
    setGenderDataElement(newGenderDataElement);
    const patient = generateNewQdmPatient(newGenderDataElement, "gender");
    setQdmPatient(patient);
    formik.setFieldValue("json", JSON.stringify(patient));
  };

  const handleTimeChange = (val) => {
    const formatted = dayjs.utc(val).format();
    const newTimeEleement = getBirthDateElement(formatted);

    // setBirthDateElement(newTimeEleement);
    const patient = generateNewQdmPatient(newTimeEleement, "birthdate");
    patient.birthDatetime = val; // extra ste
    setQdmPatient(patient);
    formik.setFieldValue("json", JSON.stringify(patient));
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
                      sx={[
                        {
                          backgroundColor: "transparent",
                          display: "flex",
                          flexDirection: "row-reverse",
                          alignSelf: "baseline",
                          textTransform: "none",
                          // force it outside the select box
                          position: "initial",
                          transform: "translateX(0px) translateY(0px)",
                          fontFamily: "Rubik",
                          fontWeight: 500,
                          fontSize: 14,
                          color: "#333",
                          "& .MuiInputLabel-asterisk": {
                            color: "#AE1C1C !important",
                            marginRight: "3px !important", //this was
                          },
                        },
                      ]}
                    >
                      Date of Birth
                    </InputLabel>
                    <div style={{ display: "flex" }}>
                      <DatePicker
                        disableOpenPicker
                        value={
                          qdmPatient?.birthDatetime
                            ? dayjs(qdmPatient?.birthDatetime)
                            : null
                        }
                        onChange={(newValue: any) => {
                          const currentDate = dayjs(qdmPatient?.birthDatetime);
                          const newDate = dayjs(currentDate)
                            .set("year", newValue.$y)
                            .set("month", newValue.$M)
                            .set("date", newValue.$D);
                          handleTimeChange(newDate);
                        }}
                        slotProps={{
                          textField: {
                            id: "birth-date",
                            sx: textFieldStyle,
                            InputProps: {
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  style={{ color: "#0073c8" }}
                                >
                                  <EventIcon />
                                </InputAdornment>
                              ),
                            },
                          },
                        }}
                      />
                      <TimePicker
                        disableOpenPicker
                        value={
                          qdmPatient?.birthDatetime
                            ? dayjs(qdmPatient?.birthDatetime)
                            : null
                        }
                        onChange={(newValue: any, v) => {
                          const currentDate = qdmPatient?.birthDatetime;
                          // hours and minute seem to already take into account AMPM
                          const newDate = dayjs(currentDate)
                            .set("hour", newValue.$H)
                            .set("minute", newValue.$m);
                          handleTimeChange(newDate);
                          // on change we need to combine with the date before we set date
                          // formik.setFieldValue("birthDatetime", newDate);
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
                  labelId="demographics-race-select-label"
                  id="demographics-race-select-id"
                  defaultValue="American Indian or Alaska Native"
                  label="Race"
                  disabled={!canEdit}
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
                  value={
                    genderDataElement?.dataElementCodes?.[0].display || "Female"
                  }
                  onChange={handleGenderChange}
                  options={selectOptions(GENDER_CODE_OPTIONS)}
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
