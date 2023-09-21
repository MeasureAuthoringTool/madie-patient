import React, { useEffect } from "react";
import "twin.macro";
import "styled-components/macro";
import IdentifierInput from "../../../../../../../common/Identifier/IdentifierInput";
import cqmModels, { Identifier } from "cqm-models";
import StringInput from "../../../../../../../common/string/StringInput";
import CodeInput from "../../../../../../../common/codeInput/CodeInput";
import _ from "lodash";

export const Location_Attributes = ["LocationType"];
export const Practitioner_Attributes = ["Role", "Specialty", "Qualification"];
export const CarePartner_Attributes = ["Relationship"];
export const Organization_Attributes = ["OrganizationType"];

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
        <div tw="mt-4">
          <CodeInput
            handleChange={(val) => handleChange(_.camelCase(attribute), val)}
            canEdit={true}
            valueSets={valueSets}
            required={false}
            title={attribute}
          />
        </div>
      );
    });
  };

  const displayQdmEntity = () => {
    switch (attributeType) {
      case "Location":
        return displayQdmEntityRelatedAttributes(Location_Attributes);
      case "Practitioner":
        return displayQdmEntityRelatedAttributes(Practitioner_Attributes);
      case "CarePartner":
        return displayQdmEntityRelatedAttributes(CarePartner_Attributes);
      case "Organization":
        return displayQdmEntityRelatedAttributes(Organization_Attributes);
    }
  };

  return (
    <>
      {attributeType ? (
        <>
          <div tw="mt-4">
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
          </div>
          <div tw="mt-4">
            <StringInput
              label="Id"
              title="Id"
              canEdit={true}
              fieldValue={attributeValue?.id}
              onStringValueChange={(val) => {
                handleChange("id", val);
              }}
            />
          </div>
          {displayQdmEntity()}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default QdmEntity;
