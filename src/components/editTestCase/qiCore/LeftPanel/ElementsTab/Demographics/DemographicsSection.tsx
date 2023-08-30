import React, { useEffect, useState } from "react";
import ElementSection from "../../../../../common/ElementSection";
import FormControl from "@mui/material/FormControl";
import { Select, InputLabel } from "@madie/madie-design-system/dist/react";
import {
  RACE_DETAILED_CODE_OPTIONS,
  RACE_OMB_CODE_OPTIONS,
  getRaceDataElement,
  matchNameWithUrl,
} from "./DemographicsSectionConst";
import { MenuItem as MuiMenuItem } from "@mui/material";
import "./DemographicsSection.scss";
import _ from "lodash";

const DemographicsSection = ({ canEdit, setEditorVal, editorVal }) => {
  const [ombRaceDataElement, setOmbRaceDataElement] = useState();
  const [detailedRaceDataElement, setDetailedRaceDataElement] = useState();

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

  const updateResourceEntries = (name, value) => {
    if (editorVal !== "Loading...") {
      const resourceEntries = JSON.parse(editorVal);
      console.log(JSON.parse(editorVal));
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
    setOmbRaceDataElement(event.target.value);
  };

  const handleDetailedRaceChange = (event) => {
    const test = updateResourceEntries(event.target.name, event.target.value);
    console.log(test);
    setDetailedRaceDataElement(event.target.value);
  };
  return (
    <div>
      <ElementSection
        title="Demographics"
        children={
          <div className="demographics-container">
            <div className="demographics-row">
              <FormControl style={{ minWidth: "250px" }}>
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

              <FormControl style={{ minWidth: "250px" }}>
                <Select
                  labelId="demographics-race-detailed-select-label"
                  id="demographics-race-detailed-select-id"
                  defaultValue="Agua Caliente Cahuilla"
                  label="Race (Detailed)"
                  disabled={!canEdit}
                  inputProps={{
                    "data-testid": `demographics-race-detailed-input`,
                  }}
                  name="raceDetailed"
                  value={
                    detailedRaceDataElement ||
                    "Grand Traverse Band of Ottawa/Chippewa"
                  }
                  onChange={handleDetailedRaceChange}
                  options={selectOptions(RACE_DETAILED_CODE_OPTIONS)}
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
