import React from "react";
import { DataElement } from "cqm-models";
import "./DataElementsList.scss";

import DataElementsTile from "./DataElementsTile";

const DataElementsList = (props: {
  availableDataElements: Array<DataElement>;
  setSelectedDataElement: Function;
}) => {
  const { availableDataElements, setSelectedDataElement } = props;
  // we need to track local state of weather it's open
  return (
    <div className="data-types" data-testid="data-elementslist-container">
      {availableDataElements?.map((element) => (
        <div key={element.description}>
          <DataElementsTile
            element={element}
            setSelectedDataElement={setSelectedDataElement}
          />
        </div>
      ))}
    </div>
  );
};

export default DataElementsList;
