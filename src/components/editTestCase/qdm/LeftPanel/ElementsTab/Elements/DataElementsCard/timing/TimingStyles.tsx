export const labelStyle = {
  backgroundColor: "transparent",
  display: "flex",
  flexDirection: "row",
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
};
