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

export const applyAttribute = (
  attribute,
  type,
  attributeValue,
  dataElement
) => {
  const modelClass = getDataElementClass(dataElement);
  console.log("model class: ", modelClass);
  const updatedDataElement = new modelClass(dataElement);
  const attributePath = _.camelCase(attribute);
  console.log("schema: ", updatedDataElement.schema);
  console.log("schema.paths: ", updatedDataElement.schema.paths);

  // console.log("updatedDataElement: ", JSON.stringify(updatedDataElement, null, 2));
  const pathInfo = updatedDataElement.schema.paths[attributePath];
  console.log(`pathInfo for attributePath [${attributePath}]: `, pathInfo);
  if (_.upperCase(pathInfo.instance) === "ARRAY") {
    if (_.isNil(updatedDataElement[attributePath])) {
      console.log(`landed here 1, updating attributePath: ${attributePath}`, attributeValue);
      updatedDataElement[attributePath] = new Array(attributeValue);
      // } else if (_.isEmpty(updatedDataElement[attributePath])) {
      //   console.log("landed here 1, updating attributePath: ", attributePath);
      //   updatedDataElement[attributePath] = [attributeValue];
    } else {
      console.log(`landed here 2, updating attributePath: ${attributePath}`, attributeValue);
      updatedDataElement[attributePath].push(attributeValue);
    }
  } else {
    updatedDataElement[_.camelCase(attribute)] = attributeValue;
  }
  console.log("updatedDataElement", updatedDataElement);
  return updatedDataElement;
};

const DataElementsCard = (props: {
  cardActiveTab: string;
  setCardActiveTab: Function;
  selectedDataElement: DataElement;
  setSelectedDataElement: Function;
  onChange?: (changedDataElement: DataElement) => void;
}) => {
  const {
    cardActiveTab,
    setCardActiveTab,
    selectedDataElement,
    setSelectedDataElement,
    onChange,
  } = props;
  const [codeSystemMap, setCodeSystemMap] = useState(null);
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

  const handleCodeChange = (selectedCode) => {
    // eslint-disable-next-line no-console
    console.log("selectedCode => ", selectedCode);
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
        <Timing canEdit={true} selectedDataElement={localSelectedDataElement} />
      </div>
      {/* Govern our navigation for codes/att/negation */}
      <SubNavigationTabs
        negationRationale={negationRationale}
        activeTab={cardActiveTab}
        setActiveTab={setCardActiveTab}
      />
      {/*Todo Call OnChange with new DataElement info
      How to get CodeSystem and Codes info ?*/}
      {cardActiveTab === "codes" && (
        <Codes
          attributeChipList={[]}
          handleChange={handleCodeChange}
          cqmMeasure={cqmMeasure}
          selectedDataElement={selectedDataElement}
        />
      )}
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
            if (onChange) {
              onChange(updatedDataElement);
            }
          }}
        />
      )}
      {/* uncomment later when we do something with it */}
      {/* {activeTab === 'negation_rationale' && <NegationRationale />} */}
    </div>
  );
};
export default DataElementsCard;
