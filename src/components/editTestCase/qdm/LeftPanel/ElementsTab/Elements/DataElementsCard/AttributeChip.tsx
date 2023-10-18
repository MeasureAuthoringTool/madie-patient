import React from "react";
import { IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import "./AttributeChipList.scss";

interface AttributeChipProps {
  text: string;
  canEdit: boolean;
  onDeleteAttributeChip: (deletedChip) => void;
  index: string;
}

const AttributeChip = ({
  text,
  canEdit,
  onDeleteAttributeChip,
  index,
}: AttributeChipProps) => {
  return (
    <div className="chip-body">
      {text}
      <IconButton sx={{ padding: 0, marginLeft: "5px", marginTop: "-2px" }}>
        {canEdit && (
          <CancelIcon
            sx={{ color: "#fff", height: "15px", width: "15px" }}
            onClick={(e) => {
              e.preventDefault;
              onDeleteAttributeChip({ index: index, text: text });
            }}
            data-testid={`delete-chip-button-${index}`}
          />
        )}
      </IconButton>
    </div>
  );
};
export default AttributeChip;
