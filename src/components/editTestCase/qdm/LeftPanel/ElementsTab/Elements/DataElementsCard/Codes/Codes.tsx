import React from "react";
import AttributeChipList from "../AttributeChipList";

interface Chip {
  title: String;
  name?: String;
  value?: String;
}
interface CodesProps {
  attributeChipList?: Array<Chip>;
}

const Codes = ({ attributeChipList = [] }: CodesProps) => {
  const items = attributeChipList.map((chip) => ({
    text: `${chip.title}: ${chip.value}`,
  }));
  return (
    <div id="codes" data-testid="codes-section">
      <AttributeChipList items={items} />
      <span data-testid="codes-section-content">
        Codes section coming soon!
      </span>
    </div>
  );
};

export default Codes;
