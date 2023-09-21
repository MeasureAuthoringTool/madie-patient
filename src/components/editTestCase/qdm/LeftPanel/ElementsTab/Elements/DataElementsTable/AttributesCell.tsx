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
              <div tw="flex flex-col text-xs">
                <span tw="whitespace-nowrap">
                  <b>{a?.title}</b> - {a?.name}{" "}
                </span>
                <span>{a?.value}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div tw="flex flex-col text-xs">
          <span tw="whitespace-nowrap">
            <b>{attribute?.title}</b> - {attribute?.name}{" "}
          </span>
          <span>{attribute?.value}</span>
        </div>
      )}
    </div>
  );
};

export default AttributesCell;
