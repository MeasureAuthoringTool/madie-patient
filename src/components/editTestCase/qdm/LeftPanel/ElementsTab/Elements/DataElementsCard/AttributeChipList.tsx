import React from "react";
import AttributeChip from "./AttributeChip";

interface AttributeChipListProps {
  items: any;
  canEdit: boolean;
  onDeleteAttributeChip: (deletedChip) => void;
}

const AttributeChipList = ({
  items,
  canEdit,
  onDeleteAttributeChip,
}: AttributeChipListProps) => {
  return (
    <div data-testid="attributes-chip-list" className="chip-list">
      {items.map(({ text }, index) => (
        <AttributeChip
          canEdit={canEdit}
          text={text}
          key={`${text}-${index}`}
          index={index}
          onDeleteAttributeChip={onDeleteAttributeChip}
        />
      ))}
    </div>
  );
};

export default AttributeChipList;
