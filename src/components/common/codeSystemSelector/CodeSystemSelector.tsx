import React, { ComponentProps, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import { Select, InputLabel } from "@madie/madie-design-system/dist/react";
import { MenuItem, TextField } from "@mui/material";
import { kebabCase } from "lodash";
import { textFieldStyle } from "./CodeSystemStyles";
import FormControl from "@mui/material/FormControl";

interface conceptOptionProps {
  code: string;
  code_system_name: string;
  code_system_oid: string;
  code_system_version: string;
  display_name: string;
}
interface codeOptionProps {
  oid: string;
  version: string;
  concepts: conceptOptionProps[];
  display_name: string;
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
  const [codeOptions, setCodeOptions] = useState([]);
  const [customOptions, setCustomOptions] = useState<boolean>();

  // if the field is not required a default option is provided
  const getCodeSystems = (options, required: boolean) => {
    return [
      !required && (
        <MenuItem key="-" value="">
          -
        </MenuItem>
      ),
      options.map((option) => {
        return (
          <MenuItem
            key={option}
            value={option}
            data-testid={`option-${option}`}
          >
            {option}
          </MenuItem>
        );
      }),
    ];
  };

  const getCodeConcepts = (
    conceptOptions: conceptOptionProps[],
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
        conceptOptions.map((conceptOption) => {
          return (
            <MenuItem
              key={`${conceptOption.code} (${conceptOption.display_name})`}
              value={`${conceptOption.code} (${conceptOption.display_name})`}
              data-testid={`option-${conceptOption.code}-${conceptOption.display_name}`}
            >
              {`${conceptOption.code} (${conceptOption.display_name})`}
            </MenuItem>
          );
        }),
    ];
  };

  const generateUniqueCodeSystems = (options: codeOptionProps[]) => {
    const uniqueCodeSystems = options[0].concepts.reduce(
      (acc, item) => {
        if (!acc.includes(item.code_system_name)) {
          acc.push(item.code_system_name);
        }
        return acc;
      },
      ["Custom"]
    );

    return uniqueCodeSystems;
  };

  const generateCodeOptions = (event) => {
    if (event.target.value != "Custom") {
      setCustomOptions(false);
      const fileteredOption = codeSystemProps?.options[0]?.concepts?.filter(
        (concept) => concept.code_system_name === event.target.value
      );
      setCodeOptions(fileteredOption);
    } else {
      setCustomOptions(true);
    }
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
              generateUniqueCodeSystems(codeSystemProps.options),
              codeSystemProps.required
            )}
            onChange={(event) => generateCodeOptions(event)}
          />
        </div>
        <div tw="flex-initial w-2/4 ">
          {customOptions ? (
            <div className="Custom Inputs">
              <div style={{ display: "flex", marginBottom: 0, height: 16 }} />

              <FormControl>
                <TextField
                  disabled={!canEdit}
                  inputProps={{
                    "data-testid": "custom-input-code-system",
                  }}
                  sx={textFieldStyle}
                  placeholder="Code System"
                />
              </FormControl>
              <FormControl>
                <TextField
                  sx={textFieldStyle}
                  disabled={!canEdit}
                  placeholder="Code"
                  inputProps={{
                    "data-testid": "custom-input-code",
                  }}
                />
              </FormControl>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeSystemSelector;
