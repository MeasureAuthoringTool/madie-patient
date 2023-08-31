import React, { useEffect, useState } from "react";
import ElementSection from "../../../../../common/ElementSection";
import FormControl from "@mui/material/FormControl";
import {
  Select,
  InputLabel,
  AutoComplete,
} from "@madie/madie-design-system/dist/react";
import {
  RACE_DETAILED_CODE_OPTIONS,
  RACE_OMB_CODE_OPTIONS,
  getRaceDataElement,
  matchNameWithUrl,
} from "./DemographicsSectionConst";
import { MenuItem as MuiMenuItem, TextField } from "@mui/material";
import "./DemographicsSection.scss";
import _ from "lodash";
import { useQdmPatient } from "../../../../../../util/QdmPatientContext";
import {
  ResourceActionType,
  useQiCoreResource,
} from "../../../../../../util/QiCorePatientProvider";

const DemographicsSection = ({ canEdit }) => {
  const [ombRaceDataElement, setOmbRaceDataElement] = useState();
  const [detailedRaceDataElement, setDetailedRaceDataElement] = useState();
  const [multiState, setMultiState] = useState();
  const { state, dispatch } = useQiCoreResource();
  const { resource } = state;

  console.log("resource from parent:",resource);

  const decideFunctionToCreateDataElement = (value, name) => {
    if (name === "raceOMB") {
      return getRaceDataElement(value, name, RACE_OMB_CODE_OPTIONS);
    }
    if (name === "raceDetailed") {
      return getRaceDataElement(value, name, RACE_DETAILED_CODE_OPTIONS);
    }

    //similarly add for ethnicity (only the last paramter of getRaceDataElement function changes)
  };

  const generateExtensionDataElement = (resourceExtensions, name, value) => {
    const extensions = resourceExtensions?.resource?.extension;
    if (extensions) {
      const matchedExtension = extensions?.map((res) => {
        if (res?.url === matchNameWithUrl(name)) {
          res.extension = [
            ...res.extension,
            decideFunctionToCreateDataElement(value, name),
          ];
        }
        return res;
      });

      resourceExtensions.resource.extension = matchedExtension;
      return resourceExtensions;
    }
  };

  //////
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

  const updateResourceEntries = (name, value) => {
    if (resource !== "Loading...") {
      const resourceEntries = resource;
      if (resourceEntries?.entry && !_.isNil(resourceEntries?.entry)) {
        const updatedResourceExtension = resourceEntries.entry.map((entry) => {
          if (entry?.resource?.extension) {
            return generateExtensionDataElement(entry, name, value);
          }
          return entry;
        });

        resourceEntries.entry = updatedResourceExtension;
        return resourceEntries;
      }
    }
  };

  const handleOmbRaceChange = (event) => {
    const test = updateResourceEntries(event.target.name, event.target.value);
    console.log(test);
    dispatch({
          type: ResourceActionType.ADD_DATA_RESOURCE,
          payload: test
        });
    // setEditorVal(JSON.stringify(test, null, 2));
    setOmbRaceDataElement(event.target.value);
  };

  const handleDetailedRaceChange = (event) => {
    const test = updateResourceEntries(event.target.name, event.target.value);
    setDetailedRaceDataElement(event.target.value);
  };
  return (
    <div>
      <ElementSection
        title="Demographics"
        children={
          <div className="demographics-container">
            <div className="demographics-row">
              <FormControl style={{ minWidth: "300px", maxWidth: "300px" }}>
                <AutoComplete
                  multiple
                  labelId="demographics-race-omb-select-label"
                  data-testid="demographics-race-omb-input"
                  label="Race (OMB)"
                  name="raceOMB"
                  // placeholder="-"
                  required={true}
                  disabled={!canEdit}
                  options={RACE_OMB_CODE_OPTIONS.map(
                    (option) => option.display
                  )}
                  onChange={setMultiState}
                />

                <Select
                  labelId="demographics-race-omb-select-label"
                  id="demographics-race-omb-select-id"
                  defaultValue="American Indian or Alaska Native"
                  label="Race (OMB)"
                  name="raceOMB"
                  disabled={!canEdit}
                  inputProps={{
                    "data-testid": `demographics-race-omb-input`,
                  }}
                  value={
                    ombRaceDataElement ||
                    "Native Hawaiian or Other Pacific Islander"
                  }
                  onChange={handleOmbRaceChange}
                  options={selectOptions(RACE_OMB_CODE_OPTIONS)}
                ></Select>
              </FormControl>

              <FormControl style={{ minWidth: "300px", maxWidth: "300px" }}>
                <AutoComplete
                  multiple
                  labelId="demographics-race-detailed-select-label"
                  id="demographics-race-detailed-select-id"
                  data-testid="demographics-race-detailed-input"
                  label="Race (Detailed)"
                  name="raceDetailed"
                  // placeholder="-"
                  required={true}
                  disabled={!canEdit}
                  options={RACE_DETAILED_CODE_OPTIONS.map(
                    (option) => option.display
                  )}
                  onChange={setMultiState}
                />
              </FormControl>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default DemographicsSection;
