import React from "react";
import "twin.macro";
import "styled-components/macro";
import { DataElement } from "cqm-models";
import * as _ from "lodash";
import { DisplayAttributes } from "./DataElementsTable";

interface AttributeRowProps {
  attributeNumber: number;
  dataElement: DataElement;
  attributes: Array<DisplayAttributes>;
}

// we care about the codes
const AttributesCell = ({
  attributeNumber,
  dataElement,
  attributes,
}: AttributeRowProps) => {
  console.log("dataElement", dataElement);
  return (
    <div>
      {!_.isEmpty(attributes) && attributes.length >= attributeNumber ? (
        <div tw="text-xs max-w-xs">
          {attributes[attributeNumber - 1].title} <br />
          {attributes[attributeNumber - 1].name} <br />
          {attributes[attributeNumber - 1].value}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default AttributesCell;
