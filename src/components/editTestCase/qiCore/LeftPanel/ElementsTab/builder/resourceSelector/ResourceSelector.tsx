import React from "react";
import { Checkbox, TextField } from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const resourceFilterOptions = createFilterOptions({
  stringify: (option: any) => option,
  ignoreCase: true,
  trim: true,
});

const ResourceSelector = (options, value, onChange) => {
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={options}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      filterOptions={resourceFilterOptions}
      value={value}
      onChange={(event, value) => {
        onChange(value);
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField {...params} label="Resources" placeholder="Favorites" />
      )}
    />
  );
};

export default ResourceSelector;
