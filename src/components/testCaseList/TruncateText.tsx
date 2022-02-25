import React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { truncateInput } from "../../util/Utils";

const TruncateText = ({ text, maxLength = 60, name, dataTestId }) => {
  if (text && text.length > maxLength) {
    const displayText = truncateInput(text, maxLength);
    return (
      <td>
        <Tooltip title={text} placement="right">
          <Button name={name} data-testid={dataTestId}>
            {displayText}...
          </Button>
        </Tooltip>
      </td>
    );
  } else {
    return (
      <td title={name} data-testid={dataTestId}>
        {text}
      </td>
    );
  }
};

export default TruncateText;
