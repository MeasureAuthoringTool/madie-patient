import React from "react";
import dayjs from "dayjs";
import { FormControl } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "twin.macro";
import "styled-components/macro";
import { InputLabel } from "@madie/madie-design-system/dist/react/";
import { kebabCase } from "lodash";

export const timeFieldStyle = {
  borderRadius: "3px",
  height: 40,
  width: 134,
  border: "1px solid #DDDDDD",
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "3px",
    "& legend": {
      width: 0,
    },
  },
  "& .MuiOutlinedInput-root": {
    "&&": {
      borderRadius: "3px",
    },
  },
  "& .MuiInputBase-input": {
    color: "#333",
    fontFamily: "Rubik",
    fontSize: 14,
    borderRadius: "3px",
    padding: "9px 5px 9px 5px",
    "&::placeholder": {
      opacity: 1,
      color: "#717171",
      fontFamily: "Rubik",
      fontSize: 14,
      padding: "9px 5px 9px 5px",
    },
  },
};
interface TimeFieldProps {
  label: string;
  time: string;
  handleTimeChange: Function;
  canEdit: boolean;
  required: boolean;
}

const TimeField = ({
  label,
  time,
  handleTimeChange,
  canEdit,
  required,
}: TimeFieldProps) => {
  return (
    <div>
      <FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <InputLabel
            style={{ marginBottom: 11, height: 16 }}
            data-testId={`${kebabCase(label)}`}
          >
            {`${label}`}
          </InputLabel>
          <TimePicker
            sx={timeFieldStyle}
            disableOpenPicker
            disabled={!canEdit}
            value={dayjs(time)}
            onChange={(newValue: any, v) => {
              const currentDate = time;
              const newDate = dayjs(currentDate)
                .set("hour", newValue?.$H)
                .set("minute", newValue?.$m);
              handleTimeChange(newDate);
            }}
            slotProps={{
              textField: {
                required: required,
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>
    </div>
  );
};

export default TimeField;
