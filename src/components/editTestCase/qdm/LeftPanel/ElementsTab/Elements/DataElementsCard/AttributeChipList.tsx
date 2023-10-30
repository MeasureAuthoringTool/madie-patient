import React, { useEffect, useState } from "react";
import AttributeChip from "./AttributeChip";
import { Chip } from "./attributes/AttributeSection";
import * as _ from "lodash";

interface AttributeChipListProps {
  attributeChipList?: Array<Chip>;
  onDeleteAttributeChip: (deletedChip) => void;
}

const AttributeChipList = ({
  attributeChipList,
  onDeleteAttributeChip,
}: AttributeChipListProps) => {
  const [chipsToDisplay, setChipsToDisplay] = useState<any>();

  useEffect(() => {
    const mappedAttributeList = attributeChipList?.map((chip) => {
      if (chip.isMultiple) {
        return chip.additionalElements.map((chip) => ({
          text: `${chip.title} - ${chip.name}: ${chip.value}`,
          id: chip.id,
        }));
      } else {
        return {
          text: `${chip.title}: ${chip.value}`,
        };
      }
    });
    setChipsToDisplay(_.flattenDeep(mappedAttributeList));
  }, [attributeChipList]);

  return (
    <div data-testid="attributes-chip-list" className="chip-list">
      {chipsToDisplay?.map(({ text, id }, index) => (
        <AttributeChip
          text={text}
          key={`${text}-${index}`}
          index={index}
          id={id}
          onDeleteAttributeChip={onDeleteAttributeChip}
        />
      ))}
    </div>
  );
};

export default AttributeChipList;
