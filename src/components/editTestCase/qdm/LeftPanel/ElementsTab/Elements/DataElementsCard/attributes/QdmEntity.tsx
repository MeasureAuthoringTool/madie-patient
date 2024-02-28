import React, { useEffect, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import IdentifierInput from "../../../../../../../common/Identifier/IdentifierInput";
import cqmModels from "cqm-models";
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
  const [identifier, setIdentifier] = useState({
    namingSystem: undefined,
    value: undefined,
  });
  const [id, setId] = useState();
  const [field, setField] = useState();
  const [code, setCode] = useState();
  const [role, setRole] = useState();
  const [specialty, setSpecialty] = useState();
  const [qualification, setQualification] = useState();

  useEffect(() => {
    if (attributeType && identifier.namingSystem && identifier.value && id) {
      const newAttribute = new cqmModels[attributeType]();
      newAttribute["id"] = id;
      newAttribute["identifier"] = identifier;
      newAttribute[field] = code;
      newAttribute["role"] = role;
      newAttribute["specialty"] = specialty;
      newAttribute["qualification"] = qualification;
      if (attributeType === "PatientEntity") {
        setAttributeValue(newAttribute);
      } else if (attributeType !== "Practitioner" && code) {
        setAttributeValue(newAttribute);
      } else if (role && specialty && qualification) {
        setAttributeValue(newAttribute);
      }
    }
  }, [attributeType, identifier, id, code, role, specialty, qualification]);

  const handleChange = (field, value) => {
    if (field === "identifier") {
      setIdentifier(value);
    } else if (field === "id") {
      setId(value);
    } else if (field === "role") {
      setRole(value);
    } else if (field === "specialty") {
      setSpecialty(value);
    } else if (field === "qualification") {
      setQualification(value);
    } else {
      setField(field);
      setCode(value);
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
                handleChange("identifier", val);
              }}
              canEdit={true}
              identifier={identifier}
            />
          </div>
          <div tw="mt-4">
            <StringInput
              label="Id"
              title="Id"
              canEdit={true}
              fieldValue={id}
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
