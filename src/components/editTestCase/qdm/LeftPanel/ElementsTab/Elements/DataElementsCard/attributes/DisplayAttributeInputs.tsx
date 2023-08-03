import React, { useState } from "react";
import { CQL } from "cqm-models";
import * as _ from "lodash";
import {
  DateField,
  DateTimeField,
} from "@madie/madie-design-system/dist/react";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import dayjs from "dayjs";
import IntegerInput from "../../../../../../../common/IntegerInput/IntegerInput";
import "./DisplayAttributeInputs.scss";
const cql = require("cql-execution");

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

  const handleAttributeChange = (e) => {
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
      case "DateTime":
        return (
          <DateTimeField
            label="DateTime"
            handleDateTimeChange={(e) => {
              const newDateTime = dayjs.utc(e);
              const newCQLDateTime: CQL.Date = new CQL.DateTime(
                newDateTime.year(),
                newDateTime.month() + 1,
                newDateTime.date(),
                newDateTime.get("hour"),
                newDateTime.get("minute"),
                0
              );
              setAttributeValue(newCQLDateTime);
            }}
            value={null}
      case "Integer":
        return (
          <IntegerInput
            intValue={null}
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
    <>
      <div className="attributes-display-container">
        <div className="attribute-model"> {displayAttributeInput()}</div>
        <div className="add-value-icon">
          {attributeType ? (
            <IconButton onClick={handleAttributeChange}>
              <AddCircleOutlineIcon sx={{ color: "#0073c8" }} />
            </IconButton>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default DisplayAttributeInputs;
