import React, { useEffect, useState } from "react";
import IdentifierInput from "../../../../../../../common/Identifier/IdentifierInput";
import cqmModels, { Identifier } from "cqm-models";
import StringInput from "../../../../../../../common/string/StringInput";
import * as _ from "lodash";

const QdmEntity = ({ setAttributeValue, attributeValue, attributeType }) => {
  // const [entity, setEntity] = useState(null);

  useEffect(() => {
    if (attributeType) {
      console.log("attributeType changed: ", attributeType);
      const entityClass = cqmModels[attributeType];
      setAttributeValue(new entityClass());
      // setEntity(new entityClass());
    }
  }, [attributeType]);

  const handleChange = (field, value) => {
    console.log("attributeType", attributeType);
    const entityClass = cqmModels[attributeType];
    if (entityClass && attributeValue) {
      const nextEntity = new entityClass(attributeValue);
      nextEntity[field] = value;
      // setEntity(nextEntity);
      console.log("returning nextEntity: ", nextEntity);
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
