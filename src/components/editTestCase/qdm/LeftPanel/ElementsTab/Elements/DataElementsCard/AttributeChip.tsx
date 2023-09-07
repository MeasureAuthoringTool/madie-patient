import React from "react";
import { IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import "./AttributeChipList.scss";

interface AttributeChipProps {
  text: string;
  deleteAttributeChip?: (deletedChip) => void;
  index?: string;
}

const AttributeChip = ({
  text,
  deleteAttributeChip,
  index,
}: AttributeChipProps) => {
  return (
    <div className="chip-body">
      {text}
      <IconButton sx={{ padding: 0, marginLeft: "5px", marginTop: "-2px" }}>
        <CancelIcon
          sx={{ color: "#fff", height: "15px", width: "15px" }}
          onClick={(e) => {
            e.preventDefault;
            deleteAttributeChip(index);
          }}
          data-testid={`delete-chip-button-${index}`}
        />
      </IconButton>
    </div>
  );
};
export default AttributeChip;
