import React from "react";
import { TypeComponentProps } from "./TypeComponentProps";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import { DateTimeField } from "@mui/x-date-pickers";
import { InputLabel } from "@mui/material";

const PeriodComponent = ({
  label,
  value,
  onChange,
  fieldRequired,
}: TypeComponentProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <InputLabel>{label}</InputLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "start",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <InputLabel>Start</InputLabel>
            <DateTimeField
              label="start"
              variant="filled"
              sx={{ width: "220px" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <InputLabel>End</InputLabel>
            <DateTimeField
              label="end"
              variant="filled"
              sx={{ width: "220px" }}
            />
          </Box>
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default PeriodComponent;
