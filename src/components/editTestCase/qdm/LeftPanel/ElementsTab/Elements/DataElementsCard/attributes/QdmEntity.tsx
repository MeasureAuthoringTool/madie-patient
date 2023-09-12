import React, { useEffect } from "react";
import IdentifierInput from "../../../../../../../common/Identifier/IdentifierInput";
import cqmModels, { Identifier } from "cqm-models";
import StringInput from "../../../../../../../common/string/StringInput";
import CodeInput from "../../../../../../../common/codeInput/CodeInput";
import _ from "lodash";

export const Location_Attributes = ["LocationType"];
export const Practitioner_Attributes = ["Role", "Specialty", "Qualification"];

const QdmEntity = ({
  setAttributeValue,
  attributeValue,
  attributeType,
  valueSets,
}) => {
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

  const displayQdmEntityRelatedAttributes = (attributesList) => {
    return attributesList.map((attribute) => {
      return (
        <CodeInput
          handleChange={(val) => handleChange(_.camelCase(attribute), val)}
          canEdit={true}
          valueSets={valueSets}
          required={false}
          title={attribute}
        />
      );
    });
  };

  const displayQdmEntity = () => {
    switch (attributeType) {
      case "Location":
        return displayQdmEntityRelatedAttributes(Location_Attributes);
      case "Practitioner":
        return displayQdmEntityRelatedAttributes(Practitioner_Attributes);
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
                : "",
              value: attributeValue?.identifier?.value
                ? attributeValue?.identifier?.value
                : "",
            }}
          />
          <StringInput
            label="Id"
            title="Id"
            canEdit={true}
            fieldValue={attributeValue?.id}
            onStringValueChange={(val) => {
              handleChange("id", val);
            }}
          />
          {displayQdmEntity()}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default QdmEntity;
