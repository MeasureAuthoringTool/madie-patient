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
import cqmModels, { DataElement } from "cqm-models";
import "./DataElementsCard.scss";
import AttributeSection from "./attributes/AttributeSection";
import { useQdmExecutionContext } from "../../../../../../routes/qdm/QdmExecutionContext";
import * as _ from "lodash";

function getDataElementClass(dataElement) {
  const qdmType = dataElement?._type; // match against for attributes
  const model = qdmType.split("QDM::")[1];
  return cqmModels[model];
}

const applyAttribute = (attribute, type, attributeValue, dataElement) => {
  const modelClass = getDataElementClass(dataElement);
  const updatedDataElement = new modelClass(dataElement);
  updatedDataElement[_.camelCase(attribute)] = attributeValue;
  return updatedDataElement;
};

const DataElementsCard = (props: {
  cardActiveTab: string;
  setCardActiveTab: Function;
  selectedDataElement: DataElement;
  setSelectedDataElement: Function;
}) => {
  const {
    cardActiveTab,
    setCardActiveTab,
    selectedDataElement,
    setSelectedDataElement,
  } = props;

  const [codeSystemMap, setCodeSystemMap] = useState(null);
  const { cqmMeasureState } = useQdmExecutionContext();
  // from here we know the type, we need to go through the dataElements to matchTypes
  // attributes section
  const [displayAttributes, setDisplayAttributes] = useState([]);
  // codes section
  const [codesChips, setCodesChips] = useState([]);
  const [localSelectedDataElement, setLocalSelectedDataElement] =
    useState(selectedDataElement);

  useEffect(() => {
    const valueSets = cqmMeasureState?.[0]?.value_sets;
    if (valueSets) {
      const codeSystemMap = {};
      valueSets.forEach((valueSet) => {
        valueSet.concepts.forEach((concept) => {
          codeSystemMap[concept.code_system_oid] = {
            code_system_name: concept.code_system_name,
          };
        });
      });
      setCodeSystemMap(codeSystemMap);
    }
  }, [cqmMeasureState]);
  const negationRationale =
    selectedDataElement?.hasOwnProperty("negationRationale");
  // https://ecqi.healthit.gov/mcw/2020/qdm-attribute/negationrationale.html  (list of all categories that use negation rationale)

  useEffect(() => {
    setLocalSelectedDataElement(selectedDataElement);
  }, [selectedDataElement]);

  useEffect(() => {
    if (localSelectedDataElement && codeSystemMap) {
      const displayAttributes = [];
      const codesChips = [];

      const dataElementClass = getDataElementClass(localSelectedDataElement);
      const modeledEl = new dataElementClass(localSelectedDataElement);

      modeledEl.schema.eachPath((path, info) => {
        if (!SKIP_ATTRIBUTES.includes(path) && modeledEl[path]) {
          if (info.instance === "Array") {
            modeledEl[path].forEach((elem, index) => {
              if (path == "relatedTo") {
                let id = elem;
                const display = getDisplayFromId(modeledEl, id);
                let value = `${stringifyValue(
                  display?.description,
                  true
                )} ${stringifyValue(display?.timing, true)}}`;
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
                  // this is wrong.
                  value: stringifyValue(modeledEl[path], true),
                  isArrayValue: true,
                  index: index,
                });
              }
            });
          } else if (path === "relatedTo") {
            const id = modeledEl[path];
            const display = getDisplayFromId(modeledEl, id);
            const value = `${stringifyValue(
              display.description,
              true
            )} ${stringifyValue(display.timing, true)}`;
            displayAttributes.push({
              name: path,
              title: _.startCase(path),
              value: value,
            });
          } else if (modeledEl[path] instanceof cqmModels.CQL.Code) {
            const value = modeledEl[path];
            value.title = codeSystemMap[value.system].code_system_name;
            codesChips.push({
              name: path,
              title: _.startCase(path),
              value: stringifyValue(modeledEl[path], true),
            });
          } else {
            displayAttributes.push({
              name: path,
              title: _.startCase(path),
              value: stringifyValue(modeledEl[path], true),
            });
          }
        }
      });
      setDisplayAttributes(displayAttributes);
      setCodesChips(codesChips);
    }
  }, [localSelectedDataElement, !!codeSystemMap]);
  // centralize state one level up so we can conditionally render our child component
  return (
    <div className="data-elements-card" data-testid="data-element-card">
      <div className="heading-row">
        <div className="text-container">
          <div className="title">
            {localSelectedDataElement.qdmStatus
              ? _.capitalize(localSelectedDataElement.qdmStatus)
              : localSelectedDataElement.qdmTitle}
            :&nbsp;
          </div>
          <div className="sub-text">
            {localSelectedDataElement.description.substring(
              localSelectedDataElement.description.indexOf(":") + 2,
              localSelectedDataElement.description.length
            )}
          </div>
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
        <h4>Timing</h4>
      </div>
      {/* Govern our navigation for codes/att/negation */}
      <SubNavigationTabs
        negationRationale={negationRationale}
        activeTab={cardActiveTab}
        setActiveTab={setCardActiveTab}
      />
      {cardActiveTab === "codes" && <Codes attributeChipList={codesChips} />}
      {cardActiveTab === "attributes" && (
        <AttributeSection
          attributeChipList={displayAttributes}
          selectedDataElement={localSelectedDataElement}
          onAddClicked={(attribute, type, attributeValue) => {
            const updatedDataElement = applyAttribute(
              attribute,
              type,
              attributeValue,
              localSelectedDataElement
            );
            setLocalSelectedDataElement(updatedDataElement);
          }}
        />
      )}
      {/* uncomment later when we do something with it */}
      {/* {activeTab === 'negation_rationale' && <NegationRationale />} */}
    </div>
  );
};
export default DataElementsCard;
