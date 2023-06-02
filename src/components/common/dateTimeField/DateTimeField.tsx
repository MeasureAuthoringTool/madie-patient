import React from "react";
import PropTypes from "prop-types";
import { InputLabel } from "@madie/madie-design-system/dist/react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormControl } from "@mui/material";
import { dateTimeTextFieldStyle } from "./DateTimeFieldStyles";
import { kebabCase } from "lodash";

const DateTimeField = ({ label, value, onChange }) => {
  return (
    <div>
      <FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <InputLabel
            style={{ marginBottom: 0, height: 16 }}
            data-testId={`${kebabCase(label)}-date/time`}
            sx={[
              {
                backgroundColor: "transparent",
                display: "flex",
                height: 17,
                textTransform: "none",
                fontFamily: "Rubik",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: 14,
                color: "#333333",
              },
            ]}
          >
            {`${label} Date/Time`}
          </InputLabel>
          <DateTimePicker
            value={value ? value : null}
            onChange={onChange}
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
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default DateTimeField;
