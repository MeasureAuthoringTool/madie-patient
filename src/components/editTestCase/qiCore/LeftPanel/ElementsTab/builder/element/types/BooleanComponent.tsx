import React from "react";
import { MenuItem as MuiMenuItem } from "@mui/material";
import { Select } from "@madie/madie-design-system/dist/react";
import { TypeComponentProps } from "./TypeComponentProps";

const BooleanComponent = ({
  disabled,
  value,
  onChange,
  label,
}: TypeComponentProps) => {
  return (
    <Select
      defaultValue="True"
      inputProps={{
        "data-testid": `qicore-boolean-${label}`,
      }}
      value={value ? "True" : "False"}
      onChange={(e) => {
        onChange(e.target.value === "true");
      }}
      options={[
        <MuiMenuItem key={"True"} value={"true"}>
          True
        </MuiMenuItem>,
        <MuiMenuItem key={"False"} value={"false"}>
          False
        </MuiMenuItem>,
      ]}
    ></Select>
  );
};

export default BooleanComponent;
