import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DataElement } from "cqm-models";
import * as _ from "lodash";
import DataElementTitle from "./dataElementTable/DataElementTitle";

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
        <DataElementTitle element={element} />
        <div className="data-types-icon">
          <AddCircleOutlineIcon />
        </div>
      </div>
    </button>
  );
};
export default DataElementsTile;
