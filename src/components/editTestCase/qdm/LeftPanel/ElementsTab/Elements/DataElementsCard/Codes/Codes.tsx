import React from "react";
import AttributeChipList from '../AttributeChipList'

const Codes = () => {
  return (
    <div id="codes" data-testId="codes-section">
      <AttributeChipList items={[ "test", "test", "test1", "test really really really long one here"]}/>
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
