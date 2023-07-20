import React, { useEffect, useState } from "react";
import AttributeSelector from "../../../../../../../common/attributeSelector/AttributeSelector";
import { DataElement } from "cqm-models";
import * as _ from "lodash";
import {
  determineAttributeTypeList,
  SKIP_ATTRIBUTES,
} from "../../../../../../../../util/QdmAttributeHelpers";
import { useFormik } from "formik";

interface AttributeSectionProps {
  selectedDataElement: DataElement;
  onAddClicked?: (attribute, type) => void;
}

const AttributeSection = ({
  selectedDataElement,
  onAddClicked,
}: AttributeSectionProps) => {
  const [attributes, setAttributes] = useState([]);
  const [types, setTypes] = useState([]);

  const formik = useFormik({
    initialValues: {
      attribute: null,
      type: "",
    },
    onSubmit: (values) => {
      onAddClicked(values.attribute, values.type);
    },
  });

  useEffect(() => {
    if (selectedDataElement) {
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
      const nextTypes = [...determineAttributeTypeList(attr.path, attr.info)];
      setTypes(nextTypes);
      if (nextTypes?.length === 1) {
        formik.setFieldValue("type", nextTypes[0]);
      } else {
        formik.setFieldValue("type", null);
      }
    } else {
      setTypes([]);
      formik.setFieldValue("type", null);
    }
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
    </form>
  );
};

export default AttributeSection;
