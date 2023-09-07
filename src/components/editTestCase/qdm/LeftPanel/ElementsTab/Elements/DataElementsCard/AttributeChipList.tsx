import React from "react";
import AttributeChip from "./AttributeChip";

interface AttributeChipListProps {
  items: any;
  deleteAttributeChip?: (deletedChip) => void;
}

const AttributeChipList = ({
  items,
  deleteAttributeChip,
}: AttributeChipListProps) => {
  return (
    <div data-testid="attributes-chip-list" className="chip-list">
      {items.map(({ text }, index) => (
        <AttributeChip
          text={text}
          key={`${text}-${index}`}
          index={index}
          deleteAttributeChip={deleteAttributeChip}
        />
      ))}
    </div>
  );
};

export default AttributeChipList;
