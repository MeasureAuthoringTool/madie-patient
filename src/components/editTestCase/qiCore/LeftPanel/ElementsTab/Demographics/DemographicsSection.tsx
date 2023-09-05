import React, { useEffect, useState } from "react";
import ElementSection from "../../../../../common/ElementSection";

import { AutoComplete, Select } from "@madie/madie-design-system/dist/react";

import {
  ETHNICITY_CODE_OPTIONS,
  ETHNICITY_DETAILED_CODE_OPTIONS,
  RACE_DETAILED_CODE_OPTIONS,
  RACE_OMB_CODE_OPTIONS,
  getRaceDataElement,
  matchName,
  matchNameWithUrl,
} from "./DemographicsSectionConst";
import "./DemographicsSection.scss";
import _ from "lodash";
import {
  FormControl,
  MenuItem as MuiMenuItem,
  Checkbox,
  TextField,
} from "@mui/material";

import { useQdmPatient } from "../../../../../../util/QdmPatientContext";

import {
  ResourceActionType,
  useQiCoreResource,
} from "../../../../../../util/QiCorePatientProvider";
const SELECT_ONE_OPTION = (
  <MuiMenuItem key="SelectOne-0" value="Select One">
    Select One
  </MuiMenuItem>
);
const DemographicsSection = ({ canEdit }) => {

  const [ombRaceDataElement, setOmbRaceDataElement] = useState();
  const [detailedRaceDataElement, setDetailedRaceDataElement] = useState();
  const { state, dispatch } = useQiCoreResource();
  const { resource } = state;
  const [raceResources, setRaceResources] = useState([]);

  useEffect(() => {
    if (resource !== "Loading...") {
      if (resource?.entry && !_.isNil(resource?.entry)) {
        resource.entry.map((entry) => {
          if (
            entry?.resource?.extension &&
            entry.resource?.resourceType === "Patient"
          ) {
            const extensions = entry?.resource?.extension;
            if (extensions) {
              extensions?.map((res) => {
                if (
                  res?.url ===
                  "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"
                ) {
                  setRaceResources(res.extension);
                }
                //similarly we can do for ethnicity extensions
              });
            }
          }
        });
      }
    }
  }, [_.cloneDeep(resource)]);

  const createExtension = (value, name, resourceExtensions) => {
    const displayNamesPresentInJson = resourceExtensions
      .filter((ext) => ext.url === matchName(name))
      .map((extension) => extension.valueCoding.display);

    if (!displayNamesPresentInJson.includes(value)) {
      if (name === "raceOMB") {
        return getRaceDataElement(value, name, RACE_OMB_CODE_OPTIONS);
      }
      if (name === "raceDetailed") {
        return getRaceDataElement(value, name, RACE_DETAILED_CODE_OPTIONS);
      }
      if (name === "ethnicityOMB") {
        return getRaceDataElement(value, name, ETHNICITY_CODE_OPTIONS);
      }
      if (name === "ethnicityDetailed") {
        return getRaceDataElement(value, name, ETHNICITY_DETAILED_CODE_OPTIONS);
      }
      return;
    }

    //similarly add for ethnicity (only the last paramter of getRaceDataElement function changes)
  };
  const [ombEthnicityDataElement, setOmbEthnicityDataElement] = useState()
  
  const [detailedEthnicityDataElement, setDetailedEthnicityDataElement] =
    useState();
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
  const ethnicityOptions = [
    SELECT_ONE_OPTION,
    ...selectOptions(ETHNICITY_CODE_OPTIONS),
  ];
  const deleteExtension = (value, presentExtensionsInJson) => {
    return presentExtensionsInJson.filter(
      (ext) => ext?.valueCoding?.display !== value
    );
  };

  const updateResourceExtension = (resourceEntry, name, value, reason) => {
    const extensions = resourceEntry?.resource?.extension;
    if (extensions) {
      const updatedResourceExtensions = extensions?.map((res) => {
        if (res?.url === matchNameWithUrl(name)) {
          //need to change name

          if (reason === "removeOption") {
            const updatedExtension = deleteExtension(value, res.extension);
            res.extension = updatedExtension;
          } else {
            const updatedExtension = createExtension(
              value,
              name,
              res.extension
            );

            if (!_.isNil(updatedExtension)) {
              res.extension = [...res.extension, updatedExtension];
            }
          }
        }
        return res;
      });

      resourceEntry.resource.extension = updatedResourceExtensions;
      return resourceEntry;
    }
  };

  const updateResourceEntries = (name, value, reason) => {
    if (resource !== "Loading...") {
      const resourceEntries = resource;

      if (resourceEntries?.entry && !_.isNil(resourceEntries?.entry)) {
        const updatedResourceEntries = resourceEntries.entry.map((entry) => {
          if (
            entry?.resource?.extension &&
            entry.resource?.resourceType === "Patient"
          ) {
            return updateResourceExtension(entry, name, value, reason);
          }
          return entry;
        });

        resourceEntries.entry = updatedResourceEntries;
        return resourceEntries;
      }
    }
  };

  const handleOmbRaceChange = (name, value, reason) => {
    const updatedResource = updateResourceEntries(name, value, reason);
    dispatch({
      type: ResourceActionType.LOAD_RESOURCE,
      payload: updatedResource,
    });
  };
  const [show, setShow] = useState<boolean>(false);
  const handleOmbEthnicityChange = (event) => {
    setShow(event.target.value === "Hispanic or Latino");
    const test = updateResourceEntries(
      event.target.name,
      event.target.value,
      "add"
    );

    setOmbEthnicityDataElement(event.target.value);
  };
  const handleDetailedRaceChange = (name, value, reason) => {
    const updatedResource = updateResourceEntries(name, value, reason);
    dispatch({
      type: ResourceActionType.LOAD_RESOURCE,
      payload: updatedResource,
    });
  };
  const handleDetailedEthnicityChange = (name, value, reason) => {
    const updatedResource = updateResourceEntries(name, value, reason);
    dispatch({
      type: ResourceActionType.LOAD_RESOURCE,
      payload: updatedResource,
    });
    setDetailedEthnicityDataElement(value);
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
                  onChange={(id, selectedVal, reason, detail) => {
                    handleOmbRaceChange(id, detail?.option, reason);
                  }}
                  value={
                    raceResources &&
                    raceResources
                      .filter((ext) => ext.url === "ombCategory")
                      .map((extension) => extension.valueCoding.display)
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
                  onChange={(id, selectedVal, reason, detail) => {
                    handleDetailedRaceChange(id, detail?.option, reason);
                  }}
                  value={
                    raceResources &&
                    raceResources
                      .filter((ext) => ext.url === "detailed")
                      .map((extension) => extension.valueCoding.display)
                  }
                />
              </FormControl>
            </div>
            <div className="demographics-row">
              <FormControl style={{ minWidth: "250px" }}>
                <Select
                  labelId="demographics-ethnicity-omb-select-label"
                  id="demographics-ethnicity-omb-select-id"
                  defaultValue="Select One"
                  label="ethnicity (OMB)"
                  name="ethnicityOMB"
                  disabled={!canEdit}
                  inputProps={{
                    "data-testid": `demographics-ethnicity-omb-input`,
                  }}
                  value={ombEthnicityDataElement}
                  onChange={handleOmbEthnicityChange}
                  options={ethnicityOptions}
                ></Select>
              </FormControl>

              <FormControl style={{ minWidth: "300px", maxWidth: "300px" }}>
                {show && (
                  <AutoComplete
                    multiple
                    labelId="demographics-ethnicity-detailed-select-label"
                    data-testid="demographics-ethnicity-detailed-input"
                    label="Ethnicity (Detailed)"
                    name="ethnicityDetailed"
                    id="ethnicityDetailed"
                    required={true}
                    disabled={!canEdit}
                    options={ETHNICITY_DETAILED_CODE_OPTIONS.map(
                      (option) => option.display
                    )}
                    onChange={(id, selectedVal, reason, detail) => {
                      handleDetailedEthnicityChange(id, detail?.option, reason);
                    }}
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
