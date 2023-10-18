import React, { useState, useEffect } from "react";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import {
  SKIP_ATTRIBUTES,
  getDisplayFromId,
  stringifyValue,
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
  dataElement,
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

export const deleteAttribute = (chipText, dataElement) => {
  const modelClass = getDataElementClass(dataElement);
  const updatedDataElement = new modelClass(dataElement);
  const attributePath = _.camelCase(
    chipText.substring(0, chipText.indexOf(":"))
  );
  const attributeValue = chipText.substring(chipText.indexOf(": ") + 2);
  const pathInfo = updatedDataElement.schema.paths[attributePath];
  if (
    _.upperCase(pathInfo?.instance) === "ARRAY" &&
    updatedDataElement[attributePath].length > 1
  ) {
    const deleteIndex =
      updatedDataElement[attributePath].indexOf(attributeValue);
    updatedDataElement[attributePath].splice(deleteIndex, 1);
  } else {
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

const DataElementsCard = (props: {
  cardActiveTab: string;
  setCardActiveTab: Function;
  selectedDataElement: DataElement;
  setSelectedDataElement: Function;
  canEdit:boolean;
  onChange?: (changedDataElement: DataElement) => void;
}) => {
  const {
    cardActiveTab,
    setCardActiveTab,
    selectedDataElement,
    setSelectedDataElement,
    canEdit,
    onChange,
  } = props;
  const [codeSystemMap, setCodeSystemMap] = useState(null);
  const [attributesPresent, setAttributesPresent] = useState(true);
  const { cqmMeasureState } = useQdmExecutionContext();
  const [cqmMeasure] = cqmMeasureState;
  // from here we know the type, we need to go through the dataElements to matchTypes
  // attributes section
  // codes section
  const [localSelectedDataElement, setLocalSelectedDataElement] =
    useState(null);
  const [displayAttributes, setDisplayAttributes] = useState([]);
  const [dataElements, setDataElements] = useState([]);
  const { patient } = useQdmPatient()?.state;
  // // data elements are required for relatedTo.
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
  useEffect(() => {
    const dataElementClass = getDataElementClass(selectedDataElement);
    const modeledEl = new dataElementClass(selectedDataElement);
    setLocalSelectedDataElement(modeledEl);
  }, [selectedDataElement, getDataElementClass, setLocalSelectedDataElement]);
  useEffect(() => {
    if (localSelectedDataElement && codeSystemMap) {
      const displayAttributes = [];
      localSelectedDataElement.schema.eachPath((path, info) => {
        if (!SKIP_ATTRIBUTES.includes(path) && localSelectedDataElement[path]) {
          if (info.instance === "Array") {
            // 4 instances
            localSelectedDataElement[path].forEach((elem, index) => {
              // works
              if (path == "relatedTo") {
                let id = elem;
                const display = getDisplayFromId(dataElements, id);
                let value = `${stringifyValue(
                  display?.description,
                  true
                )} ${stringifyValue(display?.timing, true, codeSystemMap)}}`;
                displayAttributes.push({
                  name: path,
                  title: _.startCase(path),
                  value: value,
                  isArrayValue: true,
                  index: index,
                });
              } else {
                displayAttributes.push({
                  name: path,
                  title: _.startCase(path),
                  // this is wrong
                  value: stringifyValue(
                    localSelectedDataElement[path],
                    true,
                    codeSystemMap
                  ),
                  isArrayValue: true,
                  index: index,
                });
              }
            });
          } else if (path === "relatedTo") {
            const id = localSelectedDataElement[path];
            const display = getDisplayFromId(dataElements, id);
            const value = `${stringifyValue(
              display.description,
              true
            )} ${stringifyValue(display.timing, true)}`;
            displayAttributes.push({
              name: path,
              title: _.startCase(path),
              value: value,
            });
          } else {
            displayAttributes.push({
              name: path,
              title: _.startCase(path),
              value: stringifyValue(
                localSelectedDataElement[path],
                true,
                codeSystemMap
              ),
            });
          }
        }
      });
      setDisplayAttributes(displayAttributes);
    }
  }, [localSelectedDataElement, codeSystemMap, dataElements]);
  // centralize state one level up so we can conditionally render our child component
  useEffect(() => {
    setAttributesPresent(false);
    if (selectedDataElement && selectedDataElement.schema?.eachPath) {
      selectedDataElement.schema.eachPath((path) => {
        if (!SKIP_ATTRIBUTES.includes(path) && !attributesPresent) {
          //you can't break an eachPath loop, since it's built off of forEach
          setAttributesPresent(true);
        }
      });
    }
  }, [localSelectedDataElement]);
  const onDeleteAttributeChip = (deletedChip) => {
    const deletedChipIndex = deletedChip.index;
    const newAttributes = displayAttributes.slice();
    newAttributes.splice(deletedChipIndex, 1);
    // setDisplayAttributes(newAttributes);
    const updatedElement = deleteAttribute(
      deletedChip.text,
      selectedDataElement
    );
    setLocalSelectedDataElement(updatedElement);
    setSelectedDataElement(updatedElement);
    onChange(updatedElement);
  };

  return (
    <div className="data-elements-card" data-testid="data-element-card">
      <div className="heading-row">
        <div className="text-container">
          {localSelectedDataElement?.qdmStatus && (
            <div className="title">
              {localSelectedDataElement.qdmStatus
                ? _.capitalize(localSelectedDataElement.qdmStatus)
                : localSelectedDataElement.qdmTitle}
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
          updateDataElement={(updatedDataElement) => {
            onChange(updatedDataElement);
          }}
          selectedDataElement={localSelectedDataElement}
        />
      </div>
      {/* Govern our navigation for codes/att/negation */}
      <SubNavigationTabs
        negationRationale={negationRationale}
        activeTab={cardActiveTab}
        setActiveTab={setCardActiveTab}
        attributesPresent={attributesPresent}
      />
      
      {cardActiveTab === "codes" && (
        <Codes
          handleChange={(selectedCode) => {
            const updatedDataElement = applyDataElementCodes(
              selectedCode,
              localSelectedDataElement
            );
            setLocalSelectedDataElement(updatedDataElement);
            onChange(updatedDataElement);
          }}
          deleteCode={(codeId) => {
            const updatedDataElement = deleteDataElementCode(
              codeId,
              localSelectedDataElement
            );
            setLocalSelectedDataElement(updatedDataElement);
            onChange(updatedDataElement);
          }}
          cqmMeasure={cqmMeasure}
          selectedDataElement={localSelectedDataElement}
        />
      )}
      {cardActiveTab === "attributes" && (
        <AttributeSection
          attributeChipList={displayAttributes}
          selectedDataElement={localSelectedDataElement}
          onDeleteAttributeChip={onDeleteAttributeChip}
          canEdit={canEdit}
          onAddClicked={(attribute, type, attributeValue) => {
            const updatedDataElement = applyAttribute(
              attribute,
              type,
              attributeValue,
              localSelectedDataElement
            );
            setLocalSelectedDataElement(updatedDataElement);
            setSelectedDataElement(updatedDataElement);
            if (onChange) {
              onChange(updatedDataElement);
            }
          }}
        />
      )}
      {cardActiveTab === "negation_rationale" && (
        <NegationRationale
          handleChange={(selectedCode) => {
            if (selectedCode) {
              const updatedDataElement = applyNegationRationale(
                selectedCode,
                localSelectedDataElement
              );
              setLocalSelectedDataElement(updatedDataElement);
              onChange(updatedDataElement);
            }
          }}
          deleteNegationRationale={(codeId) => {
            const updatedDataElement = deleteNegationRationale(
              localSelectedDataElement
            );
            setLocalSelectedDataElement(updatedDataElement);
            onChange(updatedDataElement);
          }}
          cqmMeasure={cqmMeasure}
          selectedDataElement={localSelectedDataElement}
        />
      )}
    </div>
  );
};
export default DataElementsCard;
