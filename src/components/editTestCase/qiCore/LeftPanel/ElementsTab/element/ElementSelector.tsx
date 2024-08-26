import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { Checkbox, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface ElementSelectorProps {
  basePath: string;
  options: any[];
  value: any;
  onChange: (event, newValue: any | null) => void;
}

const ElementSelector = ({
  basePath,
  options,
  value,
  onChange,
}: ElementSelectorProps) => {
  return (
    <>
      <Autocomplete
        multiple
        limitTags={2}
        id="checkboxes-tags-demo"
        options={options}
        value={value}
        onChange={onChange}
        disableCloseOnSelect
        getOptionLabel={(option) => `${option.path}`}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.path?.substring(basePath.length + 1)}
          </li>
        )}
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField {...params} label="Checkboxes" placeholder="Elements" />
        )}
      />
    </>
  );
};

export default ElementSelector;
