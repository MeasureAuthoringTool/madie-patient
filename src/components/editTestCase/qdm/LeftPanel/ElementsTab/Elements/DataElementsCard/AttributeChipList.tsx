import React from "react";
import AttributeChip from "./AttributeChip";

const AttributeChipList = ({ items }) => {
  return (
    <div className="chip-list">
      {items.map(({ text }) => (
        <AttributeChip text={text} />
      ))}
    </div>
  );
};

export default AttributeChipList;
