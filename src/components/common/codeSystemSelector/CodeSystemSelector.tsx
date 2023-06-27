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
}

const CodeSystemSelector = ({
  canEdit,
  codeSystemProps,
}: CodeSystemSelectProps) => {
  const [codeOptions, setCodeOptions] = useState<codeOptionProps[]>();

  // if the field is not required a default option is provided
  const getCodeSystems = (options: codeOptionProps[], required: boolean) => {
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

  const getCodeConcepts = (
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
            options={getCodeSystems(
              codeSystemProps.options,
              codeSystemProps.required
            )}
            onChange={(event) => generateCodeOptions(event)}
          />
        </div>
        <div tw="flex-initial w-2/4 ">
          <Select
            placeHolder={{
              name: `Select Code`,
              value: "",
            }}
            label="Code"
            id={`code-select`}
            inputProps={{
              "data-testid": `code-select-input`,
            }}
            data-testid={`code-select`}
            disabled={!canEdit}
            size="small"
            SelectDisplayProps={{
              "aria-required": "true",
            }}
            options={getCodeConcepts(codeOptions, codeSystemProps.required)}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeSystemSelector;
