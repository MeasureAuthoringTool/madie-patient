import React, {useState } from "react";
import ElementSection from "../../../../../common/ElementSection";
import FormControl from "@mui/material/FormControl";
import {
  AutoComplete,
} from "@madie/madie-design-system/dist/react";
import {
  RACE_DETAILED_CODE_OPTIONS,
  RACE_OMB_CODE_OPTIONS,
  getRaceDataElement,
  matchNameWithUrl,
  matchUrl,
} from "./DemographicsSectionConst";
import "./DemographicsSection.scss";
import _ from "lodash";
import {
  ResourceActionType,
  useQiCoreResource,
} from "../../../../../../util/QiCorePatientProvider";

const DemographicsSection = ({ canEdit }) => {
  const [ombRaceDataElement, setOmbRaceDataElement] = useState();
  const [detailedRaceDataElement, setDetailedRaceDataElement] = useState();
  const { state, dispatch } = useQiCoreResource();
  const { resource } = state;

  console.log("resource from parent:",resource);

  const createDataElement = (value, name, presentExtensionsInJson) => {
    const displayNamesPresentInJson = presentExtensionsInJson.map(
      (extension) => extension.valueCoding.display
    );
    const valuesToBeAdded = value.filter(
      (item) => !displayNamesPresentInJson.includes(item)
    );

    if (valuesToBeAdded.length > 0) {
      if (name === "raceOMB") {
        return getRaceDataElement(
          valuesToBeAdded[0],
          name,
          RACE_OMB_CODE_OPTIONS
        );
      }
      if (name === "raceDetailed") {
        return getRaceDataElement(
          valuesToBeAdded[0],
          name,
          RACE_DETAILED_CODE_OPTIONS
        );
      }
      return;
    }

    //similarly add for ethnicity (only the last paramter of getRaceDataElement function changes)
  };

  const updateResourceExtension = (resourceEntry, name, value) => {
    const extensions = resourceEntry?.resource?.extension;
    if (extensions) {
      const updatedResourceExtensions = extensions?.map((res) => {
        if (res?.url === matchNameWithUrl(name)) {
          //need to change name
          const presentExtensionsInJson = res.extension.filter(
            (ext) => ext.url === matchUrl(name)
          );
          const updatedExtension = createDataElement(
            value,
            name,
            presentExtensionsInJson
          );
          if (!_.isNil(updatedExtension)) {
            res.extension = [...res.extension, updatedExtension];
          }
        }
        return res;
      });

      resourceEntry.resource.extension = updatedResourceExtensions;
      return resourceEntry;
    }
  };

  const updateResourceEntries = (name, value) => {
    if (resource !== "Loading...") {
      const resourceEntries = resource;
      if (resourceEntries?.entry && !_.isNil(resourceEntries?.entry)) {
        const updatedResourceEntries = resourceEntries.entry.map((entry) => {
          if (
            entry?.resource?.extension &&
            entry.resource?.resourceType === "Patient"
          ) {
            return updateResourceExtension(entry, name, value);
          }
          return entry;
        });

        resourceEntries.entry = updatedResourceEntries;
        return resourceEntries;
      }
    }
  };

  const handleOmbRaceChange = (name, value) => {
    const updatedResource = updateResourceEntries(name, value);
    dispatch({
      type: ResourceActionType.ADD_DATA_RESOURCE,
      payload: updatedResource,
    });
    setOmbRaceDataElement(value);
  };

  const handleDetailedRaceChange = (name, value) => {
    const updatedResource = updateResourceEntries(name, value);
    dispatch({
      type: ResourceActionType.ADD_DATA_RESOURCE,
      payload: updatedResource,
    });
    setDetailedRaceDataElement(value);
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
                  data-testid="demographics-race-omb"
                  inputProps={{
                    "data-testid": `demographics-race-omb-input`,
                  }}
                  label="Race (OMB)"
                  name="raceOMB"
                  id="raceOMB"
                  required={true}
                  disabled={!canEdit}
                  options={RACE_OMB_CODE_OPTIONS.map(
                    (option) => option.display
                  )}
                  onChange={(id, selectedValue) =>
                    handleOmbRaceChange(id, selectedValue)
                  }
                />
              </FormControl>

              <FormControl style={{ minWidth: "300px", maxWidth: "300px" }}>
                <AutoComplete
                  multiple
                  labelId="demographics-race-detailed-select-label"
                  data-testid="demographics-race-detailed-input"
                  label="Race (Detailed)"
                  name="raceDetailed"
                  id="raceDetailed"
                  required={true}
                  disabled={!canEdit}
                  options={RACE_DETAILED_CODE_OPTIONS.map(
                    (option) => option.display
                  )}
                  onChange={(id, selectedValue) =>
                    handleDetailedRaceChange(id, selectedValue)
                  }
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
