import React, { useState } from "react";
import { DataElement } from "cqm-models";
import { Select } from "@madie/madie-design-system/dist/react";
import { useQdmPatient } from "../../../util/QdmPatientContext";
import { filterDataElements } from "../../../util/DataElementHelper";
import { MenuItem } from "@mui/material";

interface DataElementSelectorProps {
  canEdit: boolean;
  value?: string;
  handleChange?: (value) => void;
  selectedDataElement: DataElement;
}
interface MenuObj {
  value: string;
  label: string;
}

const DataElementSelector = ({
  canEdit,
  handleChange,
  value,
  selectedDataElement,
}: DataElementSelectorProps) => {
  const { state } = useQdmPatient();
  const { patient } = state;
  const dataElements = filterDataElements(patient?.dataElements);
  const options: MenuObj[] = dataElements
    ? dataElements
        .filter((el) => el.id !== selectedDataElement.id)
        .map(({ id, description }) => ({
          value: id,
          label: description,
        }))
    : [];
  const renderMenuItems = (options: MenuObj[]) => {
    return [
      <MenuItem key="-" value="">
        -
      </MenuItem>,
      ...options.map(({ value, label }) => (
        <MenuItem
          key={`${label}-option`}
          value={value}
          data-testid={`${label}-option`}
        >
          {label}
        </MenuItem>
      )),
    ];
  };

  const findAndRenderLabel = (value) => {
    let result = "--";
    if (value && options) {
      options.forEach((opt) => {
        if (opt.value === value) {
          result = opt.label;
        }
      });
    }
    return result;
  };
  return (
    <Select
      disabled={!canEdit}
      placeHolder={{ name: `--`, value: "" }}
      value={value}
      id="data-element-selector"
      data-testid="data-element-selector"
      inputProps={{
        "data-testid": "data-element-selector-input",
      }}
      SelectDisplayProps={{
        "aria-label": "data elements select field",
      }}
      options={renderMenuItems(options)}
      renderValue={(value) => {
        return findAndRenderLabel(value);
      }}
      onChange={(e, v, t) => {
        handleChange(e.target.value);
      }}
    />
  );
};

export default DataElementSelector;
