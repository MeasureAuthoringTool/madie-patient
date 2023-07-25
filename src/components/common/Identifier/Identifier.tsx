import React from "react";
import { TextField } from "@madie/madie-design-system/dist/react/";
import "twin.macro";
import "styled-components/macro";

export interface IdentifierProps {
  handleChange: Function;
  canEdit: boolean;
  namingLabel?: string;
  namingPlaceholder?: string;
  valueLabel?: string;
  idLabel?: string;
  identifier: { namingSystem: string; value: string };
}

const Identifier = ({
  handleChange,
  canEdit,
  namingLabel = "Value Set / Direct Reference Code",
  namingPlaceholder = "Naming System",
  valueLabel = "Value",
  //idenfifier is an object of {namingSystem,value}
  identifier,
}: IdentifierProps) => {
  return (
    <div>
      <h4 className="header" tw="text-blue-800">
        {"Identifier"}
      </h4>
      <div tw="flex flex-row">
        <div tw="w-72 mr-4">
          <TextField
            value={identifier.namingSystem}
            label={namingLabel}
            disabled={!canEdit}
            placeholder={`${namingPlaceholder}`}
            id={`identifier-field-${namingPlaceholder}`}
            data-testid={`identifier-field-${namingPlaceholder}`}
            inputProps={{
              "data-testid": `identifier-input-field-${namingPlaceholder}`,
              "aria-describedby": `identifier-input-field-helper-text-${namingPlaceholder}`,
              required: true,
            }}
            onChange={(e) => {
              handleChange({
                namingSystem: e.target.value,
                value: identifier.value,
              });
            }}
          />
        </div>
        <div tw="w-28">
          <TextField
            value={identifier.value}
            label={valueLabel}
            disabled={!canEdit}
            placeholder={`${valueLabel}`}
            id={`identifier-value-field-${valueLabel}`}
            data-testid={`identifier-value-field-${valueLabel}`}
            inputProps={{
              "data-testid": `identifier-value-input-field-${valueLabel}`,
              "aria-describedby": `identifier-value-input-field-helper-text-${valueLabel}`,
              required: true,
            }}
            onChange={(e) => {
              handleChange({
                value: e.target.value,
                namingSystem: identifier.namingSystem,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Identifier;
