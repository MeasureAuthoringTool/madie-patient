import React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { truncateInput } from "../../util/Utils";

const TruncateText = ({ text, maxLength = 60, name, dataTestId }) => {
  if (text && text.length > maxLength) {
    const displayText = truncateInput(text, maxLength);
    return (
      <Tooltip title={text} placement="right">
        <Button name={name} data-testid={dataTestId}>
          {displayText}...
        </Button>
      </Tooltip>
    );
  } else {
    return text;
  }
};

export default TruncateText;
