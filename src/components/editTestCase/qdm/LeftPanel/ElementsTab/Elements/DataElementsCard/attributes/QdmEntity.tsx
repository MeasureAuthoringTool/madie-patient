import React, { useEffect } from "react";
import IdentifierInput from "../../../../../../../common/Identifier/IdentifierInput";
import cqmModels, { Identifier } from "cqm-models";
import StringInput from "../../../../../../../common/string/StringInput";

const QdmEntity = ({ setAttributeValue, attributeValue, attributeType }) => {
  useEffect(() => {
    if (attributeType) {
      setAttributeValue(new cqmModels[attributeType]());
    }
  }, [attributeType]);

  const handleChange = (field, value) => {
    const entityClass = cqmModels[attributeType];
    if (entityClass && attributeValue) {
      const nextEntity = new entityClass(attributeValue);
      nextEntity[field] = value;
      setAttributeValue(nextEntity);
    }
  };

  return (
    <>
      {attributeType ? (
        <>
          <IdentifierInput
            onIdentifierChange={(val) => {
              handleChange("identifier", new Identifier(val));
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
            fieldValue={attributeValue?.id}
            onStringValueChange={(val) => {
              handleChange("id", val);
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
