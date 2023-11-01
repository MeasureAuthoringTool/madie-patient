import React, { useState, useEffect } from "react";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import {
  SKIP_ATTRIBUTES,
  generateAttributesToDisplay,
} from "../../../../../../../util/QdmAttributeHelpers";
import Codes from "./Codes/Codes";
import SubNavigationTabs from "./SubNavigationTabs";
import { DataElement } from "cqm-models";
import "./DataElementsCard.scss";
import AttributeSection from "./attributes/AttributeSection";
import { useQdmExecutionContext } from "../../../../../../routes/qdm/QdmExecutionContext";
import * as _ from "lodash";
import Timing from "./timing/Timing";
import { getDataElementClass } from "../../../../../../../util/DataElementHelper";
import { useQdmPatient } from "../../../../../../../util/QdmPatientContext";
import NegationRationale from "./negationRationale/NegationRationale";

export const applyAttribute = (
  attribute,
  type,
  attributeValue,
  dataElement
) => {
  const modelClass = getDataElementClass(dataElement);
  const updatedDataElement = new modelClass(dataElement);
  const attributePath = _.camelCase(attribute);

  const pathInfo = updatedDataElement.schema.paths[attributePath];
  if (_.upperCase(pathInfo?.instance) === "ARRAY") {
    updatedDataElement[attributePath].push(attributeValue);
  } else {
    updatedDataElement[_.camelCase(attribute)] = attributeValue;
  }
  return updatedDataElement;
};

export const deleteAttribute = (chip, dataElement) => {
  const modelClass = getDataElementClass(dataElement);
  const updatedDataElement = new modelClass(dataElement);
  // If a chip has id, then it is part of an Attribute which can accept multiple dataTypes.
  if (chip.id) {
    const attributePath = _.camelCase(
      _.split(_.split(chip.text, ":", 1)[0], "-", 1)[0]
    );
    const pathInfo = updatedDataElement.schema.paths[attributePath];
    if (_.upperCase(pathInfo?.instance) === "ARRAY") {
      updatedDataElement[attributePath] = _.filter(
        updatedDataElement[attributePath],
        (a) => a._id.toString() !== chip.id
      );
    }
  } else {
    const attributePath = _.camelCase(_.split(chip.text, ":", 1)[0]);
    updatedDataElement[attributePath] = undefined;
  }
  return updatedDataElement;
};

const applyDataElementCodes = (code, dataElement) => {
  const modelClass = getDataElementClass(dataElement);
  const updatedDataElement = new modelClass(dataElement);
  updatedDataElement["dataElementCodes"] = [
    ...updatedDataElement["dataElementCodes"],
    code,
  ];
  return updatedDataElement;
};

const deleteDataElementCode = (codeId, dataElement) => {
  const modelClass = getDataElementClass(dataElement);
  const updatedDataElement = new modelClass(dataElement);
  const remainingCodes = updatedDataElement["dataElementCodes"].filter(
    (dataElementCode) => {
      return dataElementCode.code != codeId;
    }
  );
  updatedDataElement["dataElementCodes"] = [...remainingCodes];
  return updatedDataElement;
};

const applyNegationRationale = (code, dataElement) => {
  const modelClass = getDataElementClass(dataElement);
  const updatedDataElement = new modelClass(dataElement);
  updatedDataElement["negationRationale"] = code;
  return updatedDataElement;
};

const deleteNegationRationale = (dataElement) => {
  const modelClass = getDataElementClass(dataElement);
  const updatedDataElement = new modelClass(dataElement);
  updatedDataElement["negationRationale"] = null;
  return updatedDataElement;
};

const DataElementsCard = (props: {
  cardActiveTab: string;
  setCardActiveTab: Function;
  selectedDataElement: DataElement;
  setSelectedDataElement: Function;
  canEdit: boolean;
  onChange?: (changedDataElement: DataElement) => void;
}) => {
  const {
    cardActiveTab,
    setCardActiveTab,
    selectedDataElement,
    setSelectedDataElement,
    canEdit=false,
    onChange,
  } = props;
  const [codeSystemMap, setCodeSystemMap] = useState(null);
  const [attributesPresent, setAttributesPresent] = useState(true);
  const { cqmMeasureState } = useQdmExecutionContext();
  const [cqmMeasure] = cqmMeasureState;
  // from here we know the type, we need to go through the dataElements to matchTypes
  // attributes section
  // codes section

  const [displayAttributes, setDisplayAttributes] = useState([]);
  const [dataElements, setDataElements] = useState([]);
  const { patient } = useQdmPatient()?.state;

  // data elements are required for relatedTo.
  useEffect(() => {
    patient?.dataElements
      ? setDataElements(patient.dataElements)
      : setDataElements([]);
  }, [patient?.dataElements]);

  useEffect(() => {
    const valueSets = cqmMeasureState?.[0]?.value_sets;
    if (valueSets) {
      const codeSystemMap = {};
      valueSets.forEach((valueSet) => {
        valueSet.concepts.forEach((concept) => {
          codeSystemMap[concept.code_system_oid] = concept.code_system_name;
        });
      });
      setCodeSystemMap(codeSystemMap);
    }
  }, [cqmMeasureState]);

  const negationRationale =
    selectedDataElement?.hasOwnProperty("negationRationale");
  // https://ecqi.healthit.gov/mcw/2020/qdm-attribute/negationrationale.html  (list of all categories that use negation rationale)

  // Generates data required for displaying saved attributes in Chips.
  // If an attribute is of type Array, then "additionalElements" field is populated
  // returns { name, title, value }
  useEffect(() => {
    if (selectedDataElement && codeSystemMap) {
      const attributesToDisplay = generateAttributesToDisplay(
        selectedDataElement,
        [],
        codeSystemMap
      );
      setDisplayAttributes(attributesToDisplay);
    }
  }, [selectedDataElement, codeSystemMap, dataElements]);

  // centralize state one level up so we can conditionally render our child component
  // Determines if the selected DataElement has at least one attribute.
  useEffect(() => {
    setAttributesPresent(false);
    if (selectedDataElement && selectedDataElement.schema?.eachPath) {
      selectedDataElement.schema.eachPath((path) => {
        if (!SKIP_ATTRIBUTES.includes(path)) {
          //you can't break an eachPath loop, since it's built off of forEach
          setAttributesPresent(true);
        }
      });
    }
  }, [selectedDataElement]);

  // Updates selectedDataElement which is a parent components State
  // also calls onChange so that the QDM Patient state is updated
  const updateDataElement = (updatedDataElement: DataElement) => {
    setSelectedDataElement(updatedDataElement);
    onChange(updatedDataElement);
  };

  return (
    <div className="data-elements-card" data-testid="data-element-card">
      <div className="heading-row">
        <div className="text-container">
          {selectedDataElement?.qdmStatus && (
            <div className="title">
              {selectedDataElement.qdmStatus
                ? _.capitalize(selectedDataElement.qdmStatus)
                : selectedDataElement.qdmTitle}
              :&nbsp;
            </div>
          )}
          {selectedDataElement?.description && (
            <div className="sub-text">
              {selectedDataElement.description.substring(
                selectedDataElement.description.indexOf(":") + 2,
                selectedDataElement.description.length
              )}
            </div>
          )}
        </div>
        <IconButton
          className="close-icon-button"
          data-testid="close-element-card"
          aria-label="close"
          sx={{ padding: 0 }}
          onClick={() => setSelectedDataElement(null)}
        >
          <Close
            className="close-icon"
            sx={{ height: 16, width: 16, color: "#D92F2F" }}
          />
        </IconButton>
      </div>
      {/* heading row end */}
      <div className="timing">
        <Timing
          canEdit={canEdit}
          onChange={(updatedDataElement) => {
            updateDataElement(updatedDataElement);
          }}
          selectedDataElement={selectedDataElement}
        />
      </div>
      {/* Govern our navigation for codes/attribute/negation */}
      <SubNavigationTabs
        negationRationale={negationRationale}
        activeTab={cardActiveTab}
        setActiveTab={setCardActiveTab}
        attributesPresent={attributesPresent}
      />
      {cardActiveTab === "codes" && (
        <Codes
          canEdit={canEdit}
          handleChange={(selectedCode) => {
            const updatedDataElement = applyDataElementCodes(
              selectedCode,
              selectedDataElement
            );
            updateDataElement(updatedDataElement);
          }}
          deleteCode={(codeId) => {
            const updatedDataElement = deleteDataElementCode(
              codeId,
              selectedDataElement
            );
            updateDataElement(updatedDataElement);
          }}
          cqmMeasure={cqmMeasure}
          selectedDataElement={selectedDataElement}
        />
      )}
      {cardActiveTab === "attributes" && (
        <AttributeSection
          attributeChipList={displayAttributes}
          selectedDataElement={selectedDataElement}
          canEdit={canEdit}
          onAddClicked={(attribute, type, attributeValue) => {
            const updatedDataElement = applyAttribute(
              attribute,
              type,
              attributeValue,
              selectedDataElement
            );
            updateDataElement(updatedDataElement);
          }}
          onDeleteAttributeChip={(deletedChip) => {
            const updatedDataElement = deleteAttribute(
              deletedChip,
              selectedDataElement
            );
            updateDataElement(updatedDataElement);
          }}
        />
      )}
      {cardActiveTab === "negation_rationale" && (
        <NegationRationale
          canEdit={canEdit}
          handleChange={(selectedCode) => {
            if (selectedCode) {
              const updatedDataElement = applyNegationRationale(
                selectedCode,
                selectedDataElement
              );
              updateDataElement(updatedDataElement);
            }
          }}
          deleteNegationRationale={() => {
            const updatedDataElement =
              deleteNegationRationale(selectedDataElement);
            updateDataElement(updatedDataElement);
          }}
          cqmMeasure={cqmMeasure}
          selectedDataElement={selectedDataElement}
        />
      )}
    </div>
  );
};
export default DataElementsCard;
