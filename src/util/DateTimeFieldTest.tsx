import React from "react";
import PropTypes from "prop-types";
import { InputLabel } from "@madie/madie-design-system/dist/react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InputAdornment from "@mui/material/InputAdornment";
import EventIcon from "@mui/icons-material/Event";
import { FormControl } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { dateTextFieldStyle, timeTextFieldStyle } from "./DateTimeFieldStyles";

const DateTimeFieldTest = ({
  label,
  dateValue,
  dateOnChange,
  timeOnChange,
  timeValue,
}) => {
  return (
    <div>
      <FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <InputLabel
            style={{ marginBottom: 0, height: 16 }}
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
          <div style={{ display: "flex" }}>
            <DatePicker
              disableOpenPicker
              value={dateValue ? dateValue : null}
              onChange={dateOnChange}
              slotProps={{
                textField: {
                  id: "date",
                  sx: dateTextFieldStyle,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        style={{ color: "#515151" }}
                      >
                        <EventIcon />
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
            <TimePicker
              disableOpenPicker
              value={timeValue ? timeValue : null}
              onChange={timeOnChange}
              slotProps={{
                textField: {
                  sx: timeTextFieldStyle,
                },
              }}
            />
          </div>
        </LocalizationProvider>
      </FormControl>
    </div>
  );
};
DateTimeFieldTest.propTypes = {
  dateValue: PropTypes.any,
  dateOnChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  timeValue: PropTypes.string.isRequired,
  timeOnChange: PropTypes.func.isRequired,
};

export default DateTimeFieldTest;
