export const dateTimeTextFieldStyle = {
  width: "240px",
  borderRadius: "3px",
  height: 40,
  border: "1px solid #B0B0B0",
  marginTop: "8px",
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
    color: "#333333",
    fontFamily: "Rubik",
    fontSize: 14,
    borderRadius: "3px",
    padding: "9px",
    Width: "240px",
    "&::placeholder": {
      opacity: 1,
      color: "#717171",
      fontFamily: "Rubik",
      fontSize: 14,
    },
  },
};

export const labelFieldStyle = {
  backgroundColor: "transparent",
  display: "flex",
  height: 17,
  textTransform: "none",
  fontFamily: "Rubik",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: 14,
  color: "#333333",
};
