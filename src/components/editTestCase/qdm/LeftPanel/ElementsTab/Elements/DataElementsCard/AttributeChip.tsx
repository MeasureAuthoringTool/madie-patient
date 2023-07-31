import React from "react";
import { IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import "./AttributeChipList.scss";
const AttributeChip = (AttributeChipProps: { text }) => {
  const { text } = AttributeChipProps;
  return (
    <div className="chip-body">
      {text}
      <IconButton sx={{ padding: 0, marginLeft: "5px", marginTop: "-2px" }}>
        <CancelIcon sx={{ color: "#fff", height: "15px", width: "15px" }} />
      </IconButton>
    </div>
  );
};
export default AttributeChip;
