import React from "react";
import "twin.macro";
import "styled-components/macro";
import { DataElement } from "cqm-models";

const DataElementTableCodes = ({
  element,
  codeSystemMap,
}: {
  element: DataElement;
  codeSystemMap;
}) => {
  return (
    <div className="text-container">
      {element.dataElementCodes.map((codes) => {
        return (
          <>
            <span>{`${
              codeSystemMap[codes.system]
                ? codeSystemMap[codes.system]
                : codes.system
            }-${codes.code}`}</span>
            <br />
          </>
        );
      })}
    </div>
  );
};

export default DataElementTableCodes;
