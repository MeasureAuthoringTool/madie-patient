import React, { useEffect, useState } from "react";
import { DataElement, CQL } from "cqm-models";
import * as _ from "lodash";
import { DateField } from "@madie/madie-design-system/dist/react";
import { Button, IconButton } from "@mui/material";
import { DateTime } from "cql-execution";
import { SettingsApplicationsRounded } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import dayjs from "dayjs";
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
