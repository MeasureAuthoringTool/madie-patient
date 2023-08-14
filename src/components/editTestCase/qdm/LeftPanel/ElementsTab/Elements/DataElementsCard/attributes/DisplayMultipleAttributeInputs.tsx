import React from "react";
import Identifier from "../../../../../../../common/Identifier/Identifier";

const DisplayMultipleAttributeInputs = ({
  setAttributeValue,
  attributeValue,
  attributeType,
}) => {
  return (
    <>
      {attributeType ? (
        <Identifier
          handleChange={(val) => {
            setAttributeValue(val)
          }}
          canEdit={true}
          identifier={{
            namingSystem: attributeValue?.namingSystem?attributeValue.namingSystem:null,
            value: attributeValue?.value?attributeValue.value:null,
          }}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default DisplayMultipleAttributeInputs;
