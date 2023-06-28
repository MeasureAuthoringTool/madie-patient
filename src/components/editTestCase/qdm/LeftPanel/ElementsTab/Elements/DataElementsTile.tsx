import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DataElement } from "cqm-models";
import * as _ from "lodash";

const DataElementsTile = (props: {
  element: DataElement;
  setSelectedDataElement: Function;
}) => {
  const { element, setSelectedDataElement } = props;
  return (
    <button
      onClick={() => {
        setSelectedDataElement(element);
      }}
      className="data-types-button"
      data-testid={`data-type-${element.description}`}
    >
      <div className="data-type-inner">
        <div className="text-container">
          <span style={{ color: "#125496" }} className="title">
            {element.qdmStatus
              ? _.capitalize(element.qdmStatus)
              : element.qdmTitle}
            :&nbsp;
          </span>
          <span style={{ color: "#333333" }} className="sub-text">
            {element.description.substring(
              element.description.indexOf(":") + 2,
              element.description.length
            )}
          </span>
        </div>

        <div className="data-types-icon">
          <AddCircleOutlineIcon />
        </div>
      </div>
    </button>
  );
};
export default DataElementsTile;
