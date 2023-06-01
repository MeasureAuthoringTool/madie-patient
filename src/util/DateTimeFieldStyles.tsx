export const dateTextFieldStyle = {
  width: "160px",
  borderRadius: "3px",
  height: 40,
  border: "0px solid #DDDDDD",
  marginTop: "8px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "0px",
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
    padding: "9px 5px 9px 5px",
    Width: "160px",
    "&::placeholder": {
      opacity: 1,
      color: "#717171",
      fontFamily: "Rubik",
      fontSize: 14,
      padding: "9px 5px 9px 5px",
    },
  },
};

export const timeTextFieldStyle = {
  borderRadius: "3px",
  height: 40,
  border: "0px solid #DDD",
  width: "90px",
  marginTop: "8px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "0px",
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
    padding: "9px 9px",
    "&::placeholder": {
      opacity: 1,
      color: "#717171",
    },
  },
};
