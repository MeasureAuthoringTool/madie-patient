import React, { useEffect } from "react";
import "twin.macro";
import "styled-components/macro";
import IdentifierInput from "../../../../../../../common/Identifier/IdentifierInput";
import cqmModels, { Identifier } from "cqm-models";
import StringInput from "../../../../../../../common/string/StringInput";
import CodeInput from "../../../../../../../common/codeInput/CodeInput";
import _ from "lodash";

export const LOCATION_ATTRIBUTES = ["LocationType"];
export const PRACTITIONER_ATTRIBUTES = ["Role", "Specialty", "Qualification"];
export const CAREPARTNER_ATTRIBUTES = ["Relationship"];
export const ORGANIZATION_ATTRIBUTES = ["OrganizationType"];

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
        return displayQdmEntityRelatedAttributes(LOCATION_ATTRIBUTES);
      case "Practitioner":
        return displayQdmEntityRelatedAttributes(PRACTITIONER_ATTRIBUTES);
      case "CarePartner":
        return displayQdmEntityRelatedAttributes(CAREPARTNER_ATTRIBUTES);
      case "Organization":
        return displayQdmEntityRelatedAttributes(ORGANIZATION_ATTRIBUTES);
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
