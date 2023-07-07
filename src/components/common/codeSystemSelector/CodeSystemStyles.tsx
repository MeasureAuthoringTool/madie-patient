export const textFieldStyle = {
  borderRadius: "3px",
  height: 40,
  border: "1px solid #DDDDDD",
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

      // padding: "9px 0px 9px 5px",
    },
  },
};

export const labelStyle = [
  {
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "row-reverse",
    alignSelf: "baseline",
    textTransform: "none",
    // force it outside the select box
    position: "initial",
    transform: "translateX(0px) translateY(0px)",
    fontFamily: "Rubik",
    fontWeight: 500,
    fontSize: 14,
    color: "#333",
    "& .MuiInputLabel-asterisk": {
      color: "#AE1C1C !important",
      marginRight: "3px !important", //this was
    },
  },
];
