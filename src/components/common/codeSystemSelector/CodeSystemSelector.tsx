import React, { ComponentProps, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import { Select } from "@madie/madie-design-system/dist/react";
import { MenuItem } from "@mui/material";
import { kebabCase } from "lodash";

interface conceptOptionProps {
  code: string;
  display: string;
}
interface codeOptionProps {
  system: string;
  version: string;
  concept: conceptOptionProps[];
}

interface CodeSelectorProps {
  label: string;
  required: boolean;
  error?: boolean;
  helperText?: string;
}

interface CodeSystemSelectorProps extends ComponentProps<any> {
  label: string;
  options: codeOptionProps[];
  required: boolean;
  error?: boolean;
  helperText?: string;
}

interface CodeSystemSelectProps {
  canEdit: boolean;
  codeSystemProps: CodeSystemSelectorProps;
  codeProps: CodeSelectorProps;
}

const CodeSystemSelector = ({
  canEdit,
  codeSystemProps,
  codeProps,
}: CodeSystemSelectProps) => {
  const [codeOptions, setCodeOptions] = useState<codeOptionProps[]>();

  // if the field is not required a default option is provided
  const getMenuItems = (options: codeOptionProps[], required: boolean) => {
    return [
      !required && (
        <MenuItem key="-" value="">
          -
        </MenuItem>
      ),

      options.map((option) => {
        return (
          <MenuItem
            key={option.system}
            value={option.system}
            data-testid={`option-${option.system}`}
          >
            {option.system}
          </MenuItem>
        );
      }),
    ];
  };

  const getCodeConceptItems = (
    conceptOptions: codeOptionProps[],
    required: boolean
  ) => {
    return [
      !required && (
        <MenuItem key="-" value="">
          -
        </MenuItem>
      ),

      conceptOptions &&
        conceptOptions.length > 0 &&
        conceptOptions[0].concept.map((conceptOption) => {
          return (
            <MenuItem
              key={`${conceptOption.code} (${conceptOption.display})`}
              value={`${conceptOption.code} (${conceptOption.display})`}
              data-testid={`option-${conceptOption.code}-${conceptOption.display}`}
            >
              {`${conceptOption.code} (${conceptOption.display})`}
            </MenuItem>
          );
        }),
    ];
  };

  const generateCodeOptions = (event) => {
    const fileteredOption = codeSystemProps.options.filter((option) => {
      return option.system === event.target.value;
    });
    setCodeOptions(fileteredOption);
  };

  return (
    <div>
      <div tw="flex">
        <div tw="flex-initial w-1/4 mr-8">
          <Select
            placeHolder={{ name: `Select ${codeSystemProps.label}`, value: "" }}
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
            onChange={(event) => generateCodeOptions(event)}
          />
        </div>
        <div tw="flex-initial w-2/4 ">
          <Select
            placeHolder={{
              name: `Select ${codeProps.label}`,
              value: "",
            }}
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
            options={getCodeConceptItems(codeOptions, codeProps.required)}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeSystemSelector;
