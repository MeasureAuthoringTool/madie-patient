import React from "react";
import * as _ from "lodash";
import { DataElement } from "cqm-models";
import "./DataElementTitle.scss";

const DataElementTitle = ({ element }: { element: DataElement }) => {
  return (
    <div className="text-container">
      <span style={{ color: "#125496" }} className="title">
        {element.qdmStatus ? _.capitalize(element.qdmStatus) : element.qdmTitle}
        :&nbsp;
      </span>
      <span style={{ color: "#333333" }} className="sub-text">
        {element.description?.substring(
          element.description.indexOf(":") + 2,
          element.description.length
        )}
      </span>
    </div>
  );
};

export default DataElementTitle;
