import React, { useState } from "react";
import { CQL } from "cqm-models";
import * as _ from "lodash";
import { DateField } from "@madie/madie-design-system/dist/react";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import dayjs from "dayjs";
import IntegerInput from "../../../../../../../common/IntegerInput/IntegerInput";
import "./DisplayAttributeInputs.scss";

interface DisplayAttributeInputsProps {
  attributeType?: string;
  onChange?: (e) => void;
  onInputAdd: Function;
}

const DisplayAttributeInputs = ({
  attributeType,
  onInputAdd,
}: DisplayAttributeInputsProps) => {
  const [attributeValue, setAttributeValue] = useState(null);

  const plusClick = (e) => {
    e.preventDefault();
    onInputAdd(attributeValue);
  };

  const displayAttributeInput = () => {
    switch (attributeType) {
      case "Date":
        return (
          <DateField
            label="Date"
            value={""}
            data-testid="date-input"
            handleDateChange={(e) => {
              const newDate = dayjs.utc(e);
              const newCQLDate: CQL.Date = new CQL.Date(
                newDate.year(),
                newDate.month() + 1,
                newDate.date()
              );
              setAttributeValue(newCQLDate);
            }}
          />
        );
      case "Integer":
        return (
          <IntegerInput
            intValue={attributeValue}
            canEdit={true}
            handleChange={(val) => setAttributeValue(parseInt(val))}
            label="Integer"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div style={{ display: "inline-block" }}>{displayAttributeInput()}</div>
      {attributeType ? (
        <IconButton className="add-value-icon" onClick={plusClick}>
          <AddCircleOutlineIcon sx={{ color: "#0073c8" }} />
        </IconButton>
      ) : (
        ""
      )}
    </div>
  );
};

export default DisplayAttributeInputs;
