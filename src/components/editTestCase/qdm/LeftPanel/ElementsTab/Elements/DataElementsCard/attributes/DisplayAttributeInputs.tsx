import React, { useEffect, useState } from "react";
import { DataElement } from "cqm-models";
import * as _ from "lodash";
import { DateField } from "@madie/madie-design-system/dist/react";
import { Button } from "@mui/material";
import { SettingsApplicationsRounded } from "@mui/icons-material";

interface DisplayAttributeInputsProps {
  attributeType?: string;
  onChange?: (e) => void;
  onInputAdd: Function;
}

const DisplayAttributeInputs = ({
  attributeType,
  onInputAdd,
}: DisplayAttributeInputsProps) => {
  const [attibuteValue, setAttibuteValue] = useState();

  const plusClick = (e) => {
    e.preventDefault();
    onInputAdd(attibuteValue);
  };

  const displayAttributeInput = () => {
    switch (attributeType) {
      case "Date":
        return (
          <DateField
            label="Date"
            value={""}
            handleDateChange={(e) => setAttibuteValue(e)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {displayAttributeInput()}
      {attributeType ? <Button onClick={plusClick}>+</Button> : ""}
    </div>
  );
};

export default DisplayAttributeInputs;
