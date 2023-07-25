import React from "react";
import AttributeChip from "./AttributeChip";

const AttributeChipList = ({ items }) => {
  return (
    <div className="chip-list">
      {items.map(({ text }, index) => (
        <AttributeChip text={text} key={`${text}-${index}`} />
      ))}
    </div>
  );
};

export default AttributeChipList;
