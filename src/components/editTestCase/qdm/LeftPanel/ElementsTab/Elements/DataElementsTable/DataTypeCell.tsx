import React, { useState, useEffect } from "react";
import { DataElement } from "cqm-models";
import * as _ from "lodash";

const CodesRow = ({ code }) => {
  return <div className="codes-row">{code}</div>;
};

// we care about the codes
const DataTypeCell = (props: { element: DataElement; codeSystemMap: any }) => {
  const { element, codeSystemMap = {} } = props;
  let codes = null;
  if (element && element.get) {
    codes = element?.get("dataElementCodes");
  }
  const [codeList, setCodeList] = useState([]);

  //  if we've got a codesystem lookup, we'll map the name
  useEffect(() => {
    if (codes) {
      setCodeList(
        codes.map((code) => {
          if (codeSystemMap[code.system]) {
            return `${codeSystemMap[code.system]}: ${code.code}`;
          }
          return `${code.system}: ${code.code}`;
        })
      );
    }
  }, [codeSystemMap, codes]);

  return (
    <div className="data-type-container">
      <div className="header">
        <span>{`${_.capitalize(element?.qdmCategory)}, `}</span>
        <span>
          {element?.qdmStatus
            ? _.capitalize(element?.qdmStatus)
            : _.capitalize(element?.qdmTitle)}
        </span>
      </div>
      <div className="element-type">
        {element?.description &&
          element.description.substring(element.qdmTitle.length + 2)}
      </div>
      {codeList.map((code) => (
        <CodesRow code={code} />
      ))}{" "}
    </div>
  );
};

export default DataTypeCell;
