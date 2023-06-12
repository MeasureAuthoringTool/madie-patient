import React from "react";
import { Button } from "@madie/madie-design-system/dist/react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function DataTypes({ selectedDataElements }) {
  const capitalizeFirstLetter = (w) => w.charAt(0).toUpperCase() + w.slice(1);

  return selectedDataElements?.map((selectedDataElement) => (
    <Button
      variant="outline-filled"
      className="data-types-button"
      data-testid={`data-type-${selectedDataElement.description}`}
    >
      <table>
        <tr>
          <td width={254}>
            <span>
              <span style={{ color: "#125496" }}>
                {selectedDataElement.qdmStatus
                  ? capitalizeFirstLetter(selectedDataElement.qdmStatus)
                  : selectedDataElement.qdmTitle}
                :&nbsp;
              </span>
              <span style={{ color: "#333333" }}>
                {selectedDataElement.description.substring(
                  selectedDataElement.description.indexOf(":") + 2,
                  selectedDataElement.description.length
                )}
              </span>
            </span>
          </td>

          <td className="data-types-icon">
            <span>
              <AddCircleOutlineIcon />
            </span>
          </td>
        </tr>
      </table>
    </Button>
  ));
}
