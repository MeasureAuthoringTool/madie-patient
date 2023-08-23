import React, { useState } from "react";
import IdentifierInput from "../../../../../../../common/Identifier/IdentifierInput";
import { Identifier } from "cqm-models";
import StringInput from "../../../../../../../common/string/StringInput";

const QdmEntity = ({ setAttributeValue, attributeValue, attributeType }) => {
  return (
    <>
      {attributeType ? (
        <>
          <IdentifierInput
            onIdentifierChange={(val) => {
              const identifier = new Identifier(val);
              setAttributeValue((prevValues) => ({
                ...prevValues,
                identifier,
              }));
            }}
            canEdit={true}
            identifier={{
              namingSystem: attributeValue?.identifier?.namingSystem
                ? attributeValue?.identifier?.namingSystem
                : null,
              value: attributeValue?.identifier?.value
                ? attributeValue?.identifier?.value
                : null,
            }}
          />
          <StringInput
            label="Id"
            canEdit={true}
            fieldValue=""
            onStringValueChange={(val) => {
              setAttributeValue((prevValues) => ({
                ...prevValues,
                ["id"]: val,
              }));
            }}
          />
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default QdmEntity;
