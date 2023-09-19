import React from "react";
import "twin.macro";
import "styled-components/macro";
import { DisplayAttributes } from "./DataElementsTable";

interface AttributeRowProps {
  attribute: DisplayAttributes;
  isMultiple?: boolean;
}

const AttributesCell = ({ attribute, isMultiple }: AttributeRowProps) => {
  return (
    <div>
      {isMultiple ? (
        <div>
          {attribute?.additionalElements?.map((a) => {
            return (
              <div tw="text-xs max-w-xs">
                {a?.title} <br />
                {a?.name} <br />
                {a?.value}
              </div>
            );
          })}
        </div>
      ) : (
        <div tw="text-xs max-w-xs">
          {attribute?.title} <br />
          {attribute?.name} <br />
          {attribute?.value} <br />
          <br />
        </div>
      )}
    </div>
  );
};

export default AttributesCell;
