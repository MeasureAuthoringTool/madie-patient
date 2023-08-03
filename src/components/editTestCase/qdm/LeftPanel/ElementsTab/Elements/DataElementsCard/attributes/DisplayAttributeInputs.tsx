import React, { useEffect, useState } from "react";
import { DataElement, CQL } from "cqm-models";
import * as _ from "lodash";
import {
  DateField,
  DateTimeField,
} from "@madie/madie-design-system/dist/react";
import { Button, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import dayjs from "dayjs";
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
  const [attributeValue, setAttributeValue] = useState();

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
            value={""}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {displayAttributeInput()}
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
