import React, { useEffect, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import { Patient } from "fhir/r4";
import ElementSection from "../../../../../common/ElementSection";
import {
  AutoComplete,
  Select,
  DateField,
} from "@madie/madie-design-system/dist/react";
import {
  createExtension,
  deleteExtension,
  matchNameWithUrl,
  updateEthnicityExtension,
  sortOptions,
  singleSelectOptions,
  multiSelectOptions,
  ETHNICITY_CODE_OPTIONS,
  ETHNICITY_DETAILED_CODE_OPTIONS,
  GENDER_CODE_OPTIONS,
  RACE_DETAILED_CODE_OPTIONS,
  RACE_OMB_CODE_OPTIONS,
  US_CORE_RACE,
  US_CORE_ETHNICITY,
} from "./DemographicUtils";
import "./DemographicsSection.scss";
import _ from "lodash";
import { FormControl, MenuItem as MuiMenuItem } from "@mui/material";

import {
  ResourceActionType,
  useQiCoreResource,
} from "../../../../../../util/QiCorePatientProvider";
import dayjs from "dayjs";

const SELECT_ONE_OPTION = (
  <MuiMenuItem key="SelectOne-0" value="Select One">
    Select One
  </MuiMenuItem>
);
const DemographicsSection = ({ canEdit }) => {
  const { state, dispatch } = useQiCoreResource();
  const { resource } = state;
  const [isHispanic, setHispanic] = useState<boolean>(false);
  const [raceExtension, setRaceExtension] = useState([]);
  const [ethnicityExtension, setEthnicityExtension] = useState([]);
  const [patient, setPatient] = useState<Patient>();

  useEffect(() => {
    if (resource !== "Loading...") {
      if (resource?.entry && !_.isNil(resource?.entry)) {
        const patient = resource.entry.find(
          (entry) => entry.resource?.resourceType === "Patient"
        )?.resource;
        setPatient(patient);
        if (patient?.extension) {
          const extensions = patient.extension;
          if (extensions) {
            extensions?.forEach((extension) => {
              if (extension.url === US_CORE_RACE) {
                setRaceExtension(extension.extension);
              }
              if (extension.url === US_CORE_ETHNICITY) {
                if (extension.extension) {
                  const isHispanic = extension.extension.some(
                    (ext) => ext.valueCoding?.display === "Hispanic or Latino"
                  );
                  setHispanic(isHispanic);
                  setEthnicityExtension(extension.extension);
                }
              }
            });
          }
        }
      }
    }
  }, [resource]);

  const updatePatientExtension = (name, value, reason) => {
    const extensions = patient?.extension;
    if (extensions) {
      patient.extension = extensions.map((extension) => {
        if (extension.url === matchNameWithUrl(name)) {
          if (reason === "removeOption") {
            extension.extension = deleteExtension(value, extension.extension);
          } else if (reason === "updateResource") {
            extension.extension = updateEthnicityExtension(
              value,
              name,
              extension.extension
            );
          } else {
            const updatedExtension = createExtension(
              value,
              name,
              extension.extension
            );
            if (!_.isNil(updatedExtension)) {
              extension.extension = [...extension.extension, updatedExtension];
            }
          }
        }
        return extension;
      });
      const updatedResource = _.cloneDeep(resource);
      const patientEntry = updatedResource.entry.find(
        (entry) => entry.resource?.resourceType === "Patient"
      );
      patientEntry.resource = patient;
      dispatch({
        type: ResourceActionType.LOAD_RESOURCE,
        payload: updatedResource,
      });
    }
  };

  const handleOmbEthnicityChange = (event) => {
    setHispanic(event.target.value === "Hispanic or Latino");
    updatePatientExtension(
      event.target.name,
      event.target.value,
      "updateResource"
    );
  };

  const handleGenderChange = (gender) => {
    const updatedResource = _.cloneDeep(resource);
    const patientEntry = updatedResource.entry.find(
      (entry) => entry.resource?.resourceType === "Patient"
    );
    patientEntry.resource.gender = gender;
    dispatch({
      type: ResourceActionType.LOAD_RESOURCE,
      payload: updatedResource,
    });
  };
  const handleBirthDateChange = (birthdate) => {
    const updatedResource = _.cloneDeep(resource);
    const patientEntry = updatedResource.entry.find(
      (entry) => entry.resource?.resourceType === "Patient"
    );
    patientEntry.resource.birthDate = birthdate;
    dispatch({
      type: ResourceActionType.LOAD_RESOURCE,
      payload: updatedResource,
    });
  };

  return (
    <div>
      <ElementSection
        title="Demographics"
        children={
          <div className="demographics-container">
            <div className="demographics-row">
              <FormControl tw={"w-2/4"}>
                <DateField
                  value={patient?.birthDate ? dayjs(patient.birthDate) : null}
                  handleDateChange={(value: any) => {
                    const date = new Date(value);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    const formattedDate = `${year}-${month}-${day}`;
                    handleBirthDateChange(formattedDate);
                  }}
                  required
                  disabled={!canEdit}
                  label="Date of Birth"
                />
                <Select
                  id="gender-selector"
                  label="Gender"
                  name="gender"
                  disabled={!canEdit}
                  inputProps={{
                    "data-testid": "demographics-gender-input",
                  }}
                  value={patient?.gender ? patient.gender : "female"}
                  renderValue={(value) => _.startCase(value)}
                  onChange={(event) =>
                    handleGenderChange(_.lowerCase(event.target.value))
                  }
                  options={sortOptions(GENDER_CODE_OPTIONS).map(
                    ({ code, display }) => (
                      <MuiMenuItem key={code} value={code}>
                        {display}
                      </MuiMenuItem>
                    )
                  )}
                />
              </FormControl>
            </div>
            <div className="demographics-row">
              <FormControl tw={"w-2/4"}>
                <AutoComplete
                  multiple
                  labelId="demographics-race-omb-select-label"
                  data-testid="demographics-race-omb"
                  inputProps={{
                    "data-testid": `demographics-race-omb-input`,
                  }}
                  label="Race (OMB)"
                  name="raceOMB"
                  id="raceOMB"
                  disabled={!canEdit}
                  options={multiSelectOptions(RACE_OMB_CODE_OPTIONS)}
                  onChange={(id, selectedVal, reason, detail) => {
                    updatePatientExtension(id, detail?.option, reason);
                  }}
                  value={
                    raceExtension &&
                    raceExtension
                      .filter(
                        (ext) =>
                          ext.url === "ombCategory" && ext?.valueCoding?.display
                      )
                      .map((extension) => extension.valueCoding.display)
                  }
                />
              </FormControl>
              <FormControl tw={"w-2/4"}>
                <AutoComplete
                  multiple
                  labelId="demographics-race-detailed-select-label"
                  data-testid="demographics-race-detailed-input"
                  label="Race (Detailed)"
                  name="raceDetailed"
                  id="raceDetailed"
                  disabled={!canEdit}
                  options={multiSelectOptions(RACE_DETAILED_CODE_OPTIONS)}
                  onChange={(id, selectedVal, reason, detail) => {
                    updatePatientExtension(id, detail?.option, reason);
                  }}
                  value={
                    raceExtension &&
                    raceExtension
                      .filter(
                        (ext) =>
                          ext.url === "detailed" && ext?.valueCoding?.display
                      )
                      .map((extension) => extension.valueCoding.display)
                  }
                />
              </FormControl>
            </div>
            <div className="demographics-row">
              <FormControl tw={"w-2/4"}>
                <Select
                  labelId="demographics-ethnicity-omb-select-label"
                  id="demographics-ethnicity-omb-select-id"
                  data-testid="demographics-ethnicity-omb-select-id"
                  defaultValue="Select One"
                  label="Ethnicity (OMB)"
                  name="ethnicityOMB"
                  disabled={!canEdit}
                  inputProps={{
                    "data-testid": `demographics-ethnicity-omb-input`,
                  }}
                  value={
                    !_.isEmpty(ethnicityExtension)
                      ? ethnicityExtension
                          .filter(
                            (ext) =>
                              ext?.url === "ombCategory" &&
                              ext?.valueCoding?.display
                          )
                          .map((extension) => extension?.valueCoding?.display)
                      : "Select One"
                  }
                  onChange={handleOmbEthnicityChange}
                  options={[
                    SELECT_ONE_OPTION,
                    ...singleSelectOptions(ETHNICITY_CODE_OPTIONS),
                  ]}
                />
              </FormControl>
              <FormControl tw={"w-2/4"}>
                {isHispanic && (
                  <AutoComplete
                    multiple
                    labelId="demographics-ethnicity-detailed-select-label"
                    data-testid="demographics-ethnicity-detailed-input"
                    label="Ethnicity (Detailed)"
                    name="ethnicityDetailed"
                    id="ethnicityDetailed"
                    disabled={!canEdit}
                    options={multiSelectOptions(
                      ETHNICITY_DETAILED_CODE_OPTIONS
                    )}
                    value={
                      ethnicityExtension &&
                      ethnicityExtension
                        .filter(
                          (ext) =>
                            ext.url === "detailed" && ext?.valueCoding?.display
                        )
                        .map((extension) => extension.valueCoding.display)
                    }
                    onChange={(id, selectedVal, reason, detail) =>
                      updatePatientExtension(id, detail?.option, reason)
                    }
                  />
                )}
              </FormControl>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default DemographicsSection;
