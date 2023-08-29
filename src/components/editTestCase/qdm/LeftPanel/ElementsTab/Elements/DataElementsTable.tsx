import React from "react";
import { DataElement } from "cqm-models";
import * as _ from "lodash";

import "./DataElementsTable.scss";

import MadieTable from "../../../../../common/TanStackTable/MadieTable";
export interface DataElementsTableProps {
  dataElements?: DataElement[];
  onView?: (dataElement: DataElement) => void;
  onDelete?: (dataElement: DataElement) => void;
}

const DataElementsTable = ({
  dataElements,
  onView,
}: DataElementsTableProps) => {
  if (!dataElements) {
    return <div></div>;
  }
  return <MadieTable dataElements={dataElements} onView={onView} />;
};

export default DataElementsTable;
