import React, { useEffect, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import CodeInput from "../codeInput/CodeInput";
import { Select } from "@madie/madie-design-system/dist/react";
import { ValueSet, DataElement, Component } from "cqm-models";
import { MenuItem } from "@mui/material";
import * as _ from "lodash";
import DisplayAttributeInputs from "../../editTestCase/qdm/LeftPanel/ElementsTab/Elements/DataElementsCard/attributes/DisplayAttributeInputs";

export interface ComponentTypeProps {
  onChange: Function;
  canEdit: boolean;
  valueSets: ValueSet[];
  selectedDataElement: DataElement;
  onInputAdd: Function;
}

const resultOptions = [
  "Code",
  "Quantity",
  "Ratio",
  "Integer",
  "Decimal",
  "Date",
  "DateTime",
  "Time",
];

const ComponentType = ({
  valueSets,
  onChange,
  canEdit,
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

  useEffect(() => {
    if (localComponent) {
      onChange(localComponent);
    }
  }, [localComponent]);

  const saveComponentInputs = (val) => {
    let component;
    if (localComponent) {
      component = new Component(localComponent);
    } else {
      component = new Component();
    }
    if (typeof val === "string") {
      component.result = parseFloat(val);
    } else {
      component.result = val;
    }
    setLocalComponent(component);
  };

  const saveCodeInput = (cqlCode) => {
    let component;
    if (localComponent) {
      component = new Component(localComponent);
    } else {
      component = new Component();
    }
    component.code = cqlCode;
    setLocalComponent(component);
  };

  return (
    <div tw="flex flex-col">
      <div tw="w-full">
        <CodeInput
          handleChange={(cqlCode) => saveCodeInput(cqlCode)}
          canEdit={true}
          valueSets={valueSets}
          required={false}
        />
      </div>
      <div tw="flex flex-row">
        <div tw="w-1/2 pt-4">
          <Select
            placeHolder={{
              name: "Select Result",
              value: "",
            }}
            label={"Result"}
            id={"result-select"}
            inputProps={{
              "data-testid": "result-select-input",
            }}
            data-testid={"result-select"}
            disabled={!canEdit}
            size="small"
            SelectDisplayProps={{
              "aria-required": "true",
            }}
            options={getMenuItems(resultOptions, false)}
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
