import React from "react";
import { TypeComponentProps } from "./TypeComponentProps";
import { InputLabel } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import { DateTimeField, LocalizationProvider } from "@mui/x-date-pickers";

const DateTimeComponent = ({ label, value, onChange }: TypeComponentProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <InputLabel>{label}</InputLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimeField variant="filled" sx={{ width: "220px" }} />
      </LocalizationProvider>
    </Box>
  );
};

export default DateTimeComponent;
