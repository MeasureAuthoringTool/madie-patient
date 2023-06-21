import React, { ComponentProps } from "react";
import "twin.macro";
import "styled-components/macro";
import { Select } from "@madie/madie-design-system/dist/react";
import { MenuItem } from "@mui/material";
import { kebabCase } from "lodash";

interface SelectProps extends ComponentProps<any> {
  label: string;
  options: string[];
  required: boolean;
  error?: boolean;
  helperText?: string;
}

interface CodeSystemSelectorProps {
  canEdit: boolean;
  codeProps: SelectProps;
  codeSystemProps: SelectProps;
}

const CodeSystemSelector = ({
  canEdit,
  codeProps,
  codeSystemProps,
}: CodeSystemSelectorProps) => {
  // if the field is not required a default option is provided
  const getMenuItems = (options: string[], required: boolean) => {
    return [
      !required && (
        <MenuItem key="-" value="">
          -
        </MenuItem>
      ),
      options.map((option) => (
        <MenuItem key={option} value={option} data-testid={`option-${option}`}>
          {option}
        </MenuItem>
      )),
    ];
  };
  return (
    <div>
      <div tw="flex">
        <div tw="flex-initial w-1/4 h-10 mr-8">
          <Select
            placeHolder={{ name: `Select ${codeProps.label}`, value: "" }}
            {...codeProps}
            id={`${kebabCase(codeProps.label)}-select`}
            inputProps={{
              "data-testid": `${kebabCase(codeProps.label)}-select-input`,
            }}
            data-testid={`${kebabCase(codeProps.label)}-select`}
            disabled={!canEdit}
            size="small"
            SelectDisplayProps={{
              "aria-required": "true",
            }}
            options={getMenuItems(codeProps.options, codeProps.required)}
          />
        </div>
        <div tw="flex-initial w-2/4 h-10">
          <Select
            placeHolder={{
              name: `Select ${codeSystemProps.label}`,
              value: "",
            }}
            {...codeSystemProps}
            id={`${kebabCase(codeSystemProps.label)}-select`}
            inputProps={{
              "data-testid": `${kebabCase(codeSystemProps.label)}-select-input`,
            }}
            data-testid={`${kebabCase(codeSystemProps.label)}-select`}
            disabled={!canEdit}
            size="small"
            SelectDisplayProps={{
              "aria-required": "true",
            }}
            options={getMenuItems(
              codeSystemProps.options,
              codeSystemProps.required
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeSystemSelector;
