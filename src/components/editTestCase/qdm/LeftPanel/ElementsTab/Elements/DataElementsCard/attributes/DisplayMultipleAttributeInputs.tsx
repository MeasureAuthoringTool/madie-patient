import React from "react";
import IdentifierInput from "../../../../../../../common/Identifier/IdentifierInput";
import { Identifier } from "cqm-models";

const DisplayMultipleAttributeInputs = ({
  setAttributeValue,
  attributeValue,
  attributeType,
}) => {
  return (
    <>
      {attributeType ? (
        <IdentifierInput
          handleChange={(val) => {
            const identifierObject = new Identifier(val);
            setAttributeValue(identifierObject);
          }}
          canEdit={true}
          identifier={{
            namingSystem: attributeValue?.namingSystem
              ? attributeValue?.namingSystem
              : null,
            value: attributeValue?.value ? attributeValue?.value : null,
          }}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default DisplayMultipleAttributeInputs;
