import React from "react";
import "twin.macro";
import "styled-components/macro";
import { DisplayAttributes } from "./DataElementsTable";
import _ from "lodash";

interface AttributeRowProps {
  attribute: DisplayAttributes;
  isMultiple?: boolean;
}

const generateAttributeCell = (a: DisplayAttributes) => {
  if (_.isEmpty(a)) {
    return <div></div>;
  } else {
    return (
      <div tw="flex flex-col text-xs">
        <span tw="whitespace-nowrap">
          <b>{a?.title}</b> - {a?.name}{" "}
        </span>
        <span>{a?.value}</span>
      </div>
    );
  }
};

const AttributesCell = ({ attribute, isMultiple }: AttributeRowProps) => {
  return (
    <div>
      {isMultiple ? (
        <div>
          {attribute?.additionalElements?.map((a) => {
            return generateAttributeCell(a);
          })}
        </div>
      ) : (
        generateAttributeCell(attribute)
      )}
    </div>
  );
};

export default AttributesCell;
