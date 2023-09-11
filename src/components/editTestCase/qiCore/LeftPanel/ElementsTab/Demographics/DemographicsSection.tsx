import React, { useEffect, useState } from "react";
import ElementSection from "../../../../../common/ElementSection";

import { AutoComplete, Select } from "@madie/madie-design-system/dist/react";

import {
  ETHNICITY_CODE_OPTIONS,
  ETHNICITY_DETAILED_CODE_OPTIONS,
  RACE_DETAILED_CODE_OPTIONS,
  RACE_OMB_CODE_OPTIONS,
  createExtension,
  deleteExtension,
  matchNameWithUrl,
  updateEthnicityExtension,
} from "./DemographicsSectionConst";
import "./DemographicsSection.scss";
import _ from "lodash";
import { FormControl, MenuItem as MuiMenuItem } from "@mui/material";

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
  const { state, dispatch } = useQiCoreResource();
  const { resource } = state;
  const [show, setShow] = useState<boolean>(false);
  const [raceResources, setRaceResources] = useState([]);
  const [ethnicityResources, setEthnicityResources] = useState([]);

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
                if (
                  res?.url ===
                  "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"
                ) {
                  if (res?.extension) {
                    const filteredExtensions = res?.extension.filter(
                      (ext) =>
                        ext?.valueCoding?.display === "Hispanic or Latino"
                    );
                    setShow(filteredExtensions.length > 0 ? true : false);
                    setEthnicityResources(res.extension);
                  }
                }
              });
            }
          }
        });
      }
    }
  }, [_.cloneDeep(resource)]);

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

  const multiSelectOptions = (options) => {
    return options
      .sort((a, b) =>
        a.display && b.display
          ? a.display.localeCompare(b.display)
          : a.localeCompare(b)
      )
      .map((opt, i) => opt?.display && opt.display);
  };

  const updateResourceExtension = (resourceEntry, name, value, reason) => {
    const extensions = resourceEntry?.resource?.extension;
    if (extensions) {
      const updatedResourceExtensions = extensions?.map((res) => {
        if (res?.url === matchNameWithUrl(name)) {
          if (reason === "removeOption") {
            const updatedExtension = deleteExtension(value, res.extension);
            res.extension = updatedExtension;
          } else if (reason === "updateResource") {
            const updatedExtension = updateEthnicityExtension(
              value,
              name,
              res.extension
            );
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

  const handleOmbEthnicityChange = (event) => {
    setShow(event.target.value === "Hispanic or Latino");
    const updatedResource = updateResourceEntries(
      event.target.name,
      event.target.value,
      "updateResource"
    );
    dispatch({
      type: ResourceActionType.LOAD_RESOURCE,
      payload: updatedResource,
    });
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
                  options={multiSelectOptions(RACE_OMB_CODE_OPTIONS)}
                  onChange={(id, selectedVal, reason, detail) => {
                    handleOmbRaceChange(id, detail?.option, reason);
                  }}
                  value={
                    raceResources &&
                    raceResources
                      .filter(
                        (ext) =>
                          ext.url === "ombCategory" && ext?.valueCoding?.display
                      )
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
                  options={multiSelectOptions(RACE_DETAILED_CODE_OPTIONS)}
                  onChange={(id, selectedVal, reason, detail) => {
                    handleDetailedRaceChange(id, detail?.option, reason);
                  }}
                  value={
                    raceResources &&
                    raceResources
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
              <FormControl style={{ minWidth: "250px" }}>
                <Select
                  labelId="demographics-ethnicity-omb-select-label"
                  id="demographics-ethnicity-omb-select-id"
                  defaultValue="Select One"
                  label="Ethnicity (OMB)"
                  name="ethnicityOMB"
                  disabled={!canEdit}
                  inputProps={{
                    "data-testid": `demographics-ethnicity-omb-input`,
                  }}
                  value={
                    !_.isEmpty(ethnicityResources)
                      ? ethnicityResources
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
                    ...selectOptions(ETHNICITY_CODE_OPTIONS),
                  ]}
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
                    options={multiSelectOptions(
                      ETHNICITY_DETAILED_CODE_OPTIONS
                    )}
                    value={
                      ethnicityResources &&
                      ethnicityResources
                        .filter(
                          (ext) =>
                            ext.url === "detailed" && ext?.valueCoding?.display
                        )
                        .map((extension) => extension.valueCoding.display)
                    }
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
