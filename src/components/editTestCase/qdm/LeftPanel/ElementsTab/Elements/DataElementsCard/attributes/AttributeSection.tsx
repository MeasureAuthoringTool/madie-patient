import React, { useEffect, useState } from "react";
import AttributeSelector from "../../../../../../../common/attributeSelector/AttributeSelector";
import { DataElement } from "cqm-models";
import * as _ from "lodash";
import {
  determineAttributeTypeList,
  SKIP_ATTRIBUTES,
} from "../../../../../../../../util/QdmAttributeHelpers";
import { useFormik } from "formik";
import DisplayAttributeInputs from "./DisplayAttributeInputs";
import AttributeChipList from "../AttributeChipList";

interface Chip {
  title: String;
  name?: String;
  value?: String;
}
interface AttributeSectionProps {
  selectedDataElement: DataElement;
  onAddClicked?: (attribute, type, attributeValue) => void;
  attributeChipList?: Array<Chip>;
  onDeleteAttributeChip?: (deletedChip) => void;
  setAttributesPresent: (bool) => void;
}

const AttributeSection = ({
  attributeChipList = [],
  selectedDataElement,
  setAttributesPresent,
  onAddClicked,
  onDeleteAttributeChip,
}: AttributeSectionProps) => {
  const mappedAttributeList = attributeChipList.map((chip, index) => ({
    text: `${chip.title}: ${chip.value}`,
  }));
  const [attributes, setAttributes] = useState([]);
  const [types, setTypes] = useState([]);

  const formik = useFormik({
    initialValues: {
      attribute: null,
      type: "",
      attributeValue: "",
    },
    onSubmit: (values) => {
      onAddClicked(values.attribute, values.type, values.attributeValue);
    },
  });

  useEffect(() => {
    if (selectedDataElement && selectedDataElement.schema) {
      const nextAttributes = [];
      selectedDataElement.schema.eachPath((path, info) => {
        if (!SKIP_ATTRIBUTES.includes(path)) {
          nextAttributes.push({
            path,
            info,
            displayName: _.startCase(path),
          });
        }
      });
      setAttributes(nextAttributes);
    } else {
      setAttributes([]);
    }
  }, [selectedDataElement]);

  const handleAttributeChange = (e) => {
    const attr = attributes?.find(
      (attr) => attr.displayName === e.target.value
    );
    formik.setFieldValue("attribute", attr);

    if (attr) {
      // relatedTo's info comes back as a string, which is right, but mockup wants next select to say "Data Element"
      if (attr.path === "relatedTo") {
        setTypes(["DataElement"]);
        formik.setFieldValue("type", "DataElement");
      }
      // all other attribute cases
      else {
        const nextTypes = [...determineAttributeTypeList(attr.path, attr.info)];
        setTypes(nextTypes);
        if (nextTypes?.length === 1) {
          formik.setFieldValue("type", nextTypes[0]);
        } else {
          formik.setFieldValue("type", null);
        }
      }
    } else {
      setTypes([]);
      formik.setFieldValue("type", null);
    }
  };
  const onInputAdd = (e) => {
    onAddClicked(formik.values.attribute.displayName, formik.values.type, e);
  };
  return (
    <form id="add-attribute-form" onSubmit={formik.handleSubmit}>
      <AttributeSelector
        canEdit={true}
        attributeProps={{
          label: "Attribute",
          options: attributes.map((attr) => attr.displayName),
          required: true,
          value: formik.values.attribute?.displayName ?? "",
          onChange: handleAttributeChange,
        }}
        attributeTypeProps={{
          label: "Type",
          options: types,
          required: false,
          ...formik.getFieldProps("type"),
          disabled: _.isEmpty(types),
        }}
      />
      <DisplayAttributeInputs
        selectedDataElement={selectedDataElement}
        attributeType={formik.values.type}
        onInputAdd={onInputAdd}
      />
      <AttributeChipList
        items={mappedAttributeList}
        onDeleteAttributeChip={onDeleteAttributeChip}
      />
    </form>
  );
};

export default AttributeSection;
