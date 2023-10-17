import React, { ComponentProps, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import CodeInput from "../codeInput/CodeInput";
import { Select } from "@madie/madie-design-system/dist/react";
import { ValueSet, DataElement, Component, CQL, Result } from "cqm-models";
import { kebabCase } from "lodash";
import { MenuItem } from "@mui/material";
import * as _ from "lodash";
import DisplayAttributeInputs from "../../editTestCase/qdm/LeftPanel/ElementsTab/Elements/DataElementsCard/attributes/DisplayAttributeInputs";

interface SelectProps extends ComponentProps<any> {
  label: string;
  options: string[];
  required: boolean;
  error?: boolean;
  helperText?: string;
}

export interface ComponentTypeProps {
  onChange: Function;
  canEdit: boolean;
  valueSets: ValueSet[];
  attributeTypeProps: SelectProps;
  selectedDataElement: DataElement;
  onInputAdd: Function;
}

const ComponentType = ({
  valueSets,
  onChange,
  canEdit,
  attributeTypeProps,
  selectedDataElement,
  onInputAdd,
}: ComponentTypeProps) => {
  const [resultType, setResultType] = useState<string>("");
  const [localComponent, setLocalComponent] = useState(null);
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

  console.log("selectedDataElement", selectedDataElement);

  const saveComponentInputs = (val) => {
    if (localComponent) {
      if (val instanceof CQL.Code) {
        setLocalComponent({ ...localComponent, Code: val });
      } else {
        setLocalComponent({ ...localComponent, Result: val });
      }
    } else {
      const component = new Component();
      if (val instanceof CQL.Code) {
        setLocalComponent({ ...component, Code: val });
      } else {
        setLocalComponent({ ...component, Result: val });
      }
    }
    debugger;
    // console.log("component", component);
  };

  return (
    <div tw="flex flex-col">
      <div tw="w-full">
        <CodeInput
          handleChange={(val) => saveComponentInputs(val)}
          canEdit={true}
          valueSets={valueSets}
          required={false}
        />
      </div>
      <div tw="flex flex-row">
        <div tw="w-1/2 pt-4">
          <Select
            placeHolder={{
              name: `Select ${attributeTypeProps.label}`,
              value: "",
            }}
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
            onChange={(val) => {
              setResultType(val.target.value);
            }}
          />
        </div>
        <div tw="w-1/2 pl-5">
          <DisplayAttributeInputs
            selectedDataElement={selectedDataElement}
            attributeType={resultType}
            onInputAdd={onInputAdd}
            onChangeForComponentType={(val) => saveComponentInputs(val)}
          />
        </div>
      </div>
    </div>
  );
};

export default ComponentType;
