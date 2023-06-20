import React from "react";
import PropTypes from "prop-types";
import { DateTimeField } from "@madie/madie-design-system/dist/react";
import { FormControl } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface DateTimeIntervalProps {
  label: string;
  startDateTime: object;
  handleStartDateTimeChange: Function;
  endDateTime: object;
  handleEndDateTimeChange: Function;
  canEdit: boolean;
}

export const dateTimeTextFieldStyle = {
  fontFamily: "Rubik",
  fontStyle: "normal",
  fontWeight: "500",
  fontSize: "16px",
  lineHeight: "19px",
  height: "19px",
  color: "#125496",
};

const DateTimeInterval = ({
  label,
  startDateTime,
  handleStartDateTimeChange,
  endDateTime,
  handleEndDateTimeChange,
  canEdit,
}: DateTimeIntervalProps) => {
  return (
    <div>
      <h5 style={dateTimeTextFieldStyle}>Time Range</h5>
      <FormControl
        style={{ display: "flex", gap: "32px", flexDirection: "row" }}
      >
        <div>
          <DateTimeField
            disabled={!canEdit}
            label={`${label} - Start`}
            handlDateTimeChange={handleStartDateTimeChange}
            dateTimeValue={startDateTime}
          />
        </div>

        <div>
          <DateTimeField
            disabled={!canEdit}
            label={`${label} - End`}
            handlDateTimeChange={handleEndDateTimeChange}
            dateTimeValue={endDateTime}
          />
        </div>
      </FormControl>
    </div>
  );
};

export default DateTimeInterval;
