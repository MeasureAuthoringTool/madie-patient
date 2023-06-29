import React from "react";
import { DataElement } from "cqm-models";

import DataElementsTile from "./DataElementsTile";

const DataElementsList = (props: {
  availableDataElements: Array<DataElement>;
  setSelectedDataElement: Function;
}) => {
  const { availableDataElements, setSelectedDataElement } = props;
  // we need to track local state of weather it's open
  return availableDataElements?.map((element) => (
    <DataElementsTile
      element={element}
      setSelectedDataElement={setSelectedDataElement}
      key={`element - ${element.title}`}
    />
  ));
};

export default DataElementsList;
