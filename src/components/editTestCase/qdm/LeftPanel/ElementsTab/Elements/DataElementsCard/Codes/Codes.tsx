import React from "react";
import AttributeChipList from "../AttributeChipList";

interface Chip {
  title: String;
  name?: String;
  value?: String;
}
interface CodesProps {
  attributeChipList: Array<Chip>;
}

const Codes = ({ attributeChipList = [] }: CodesProps) => {
  const items = attributeChipList.map((chip) => ({
    text: `${chip.title}: ${chip.value}`,
  }));
  return (
    <div id="codes" data-testId="codes-section">
      <AttributeChipList items={items} />
      {/* uncomment later, use test data to get feel */}
      {/* <CodeSystemSelector
              canEdit={true}
              codeSystemProps={{
                label: "Code System",
                options: options,
                required: false,
                error: false,
                helperText: "",
              }}
            /> */}
      {/* chips live here*/}
    </div>
  );
};

export default Codes;
