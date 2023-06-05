import React from "react";
import PropTypes from "prop-types";
import { InputLabel } from "@madie/madie-design-system/dist/react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormControl } from "@mui/material";
import {
  dateTimeTextFieldStyle,
  labelFieldStyle,
} from "./DateTimeFieldsStyles";
import { kebabCase } from "lodash";

const DateTimeField = ({ label, dateTimevalue, handleDateTimeChange }) => {
  return (
    <div>
      <FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <InputLabel
            style={{ marginBottom: 0, height: 16 }}
            data-testId={`${kebabCase(label)}-date/time`}
            sx={labelFieldStyle}
          >
            {`${label} Date/Time`}
          </InputLabel>
          <DateTimePicker
            value={dateTimevalue ? dateTimevalue : null}
            onChange={handleDateTimeChange}
            views={["year", "day", "hours", "minutes"]}
            slotProps={{
              textField: {
                id: "dateTime",
                sx: dateTimeTextFieldStyle,
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>
    </div>
  );
};
DateTimeField.propTypes = {
  dateTimevalue: PropTypes.object,
  handleDateTimeChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default DateTimeField;
