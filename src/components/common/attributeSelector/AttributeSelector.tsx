import React, { ComponentProps } from "react";
import "twin.macro";
import "styled-components/macro";
import { Select } from "@madie/madie-design-system/dist/react";
import { MenuItem } from "@mui/material";
import { kebabCase } from "lodash";
import * as _ from "lodash";

interface SelectProps extends ComponentProps<any> {
  label: string;
  options: string[];
  required: boolean;
  error?: boolean;
  helperText?: string;
}

interface AttributeSelectorProps {
  canEdit: boolean;
  attributeProps: SelectProps;
  attributeTypeProps: SelectProps;
}

const AttributeSelector = ({
  canEdit,
  attributeProps,
  attributeTypeProps,
}: AttributeSelectorProps) => {
  // if the field is not required a default option is provided
  const getMenuItems = (options: string[], required: boolean) => {
    return [
      !required ? (
        <MenuItem key="-" value="">
          -
        </MenuItem>
      ) : null,
      ...options.map((option) => (
        <MenuItem key={option} value={option} data-testid={`option-${option}`}>
          {option}
        </MenuItem>
      )),
    ].filter((s) => !_.isNil(s));
  };
  return (
    <div tw="pt-2">
      <div tw="flex">
        <div tw="flex-initial w-4/12 pr-3">
          <Select
            placeHolder={{ name: `Select ${attributeProps.label}`, value: "" }}
            {...attributeProps}
            id={`${kebabCase(attributeProps.label)}-select`}
            inputProps={{
              "data-testid": `${kebabCase(attributeProps.label)}-select-input`,
            }}
            data-testid={`${kebabCase(attributeProps.label)}-select`}
            disabled={!canEdit}
            size="small"
            SelectDisplayProps={{
              "aria-required": "true",
            }}
            options={getMenuItems(
              attributeProps.options,
              attributeProps.required
            )}
          />
        </div>
        <div tw="flex-initial w-3/12 pl-3">
          <Select
            placeHolder={{
              name: `Select ${attributeTypeProps.label}`,
              value: "",
            }}
            {...attributeTypeProps}
            id={`${kebabCase(attributeTypeProps.label)}-select`}
            inputProps={{
              "data-testid": `${kebabCase(
                attributeTypeProps.label
              )}-select-input`,
            }}
            data-testid={`${kebabCase(attributeTypeProps.label)}-select`}
            disabled={!canEdit}
            size="small"
            SelectDisplayProps={{
              "aria-required": "true",
            }}
            options={getMenuItems(
              attributeTypeProps.options,
              attributeTypeProps.required
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AttributeSelector;
