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
import Timing from "./timing/Timing";
import { useFormikContext } from "formik";
import Button from "@mui/material/Button";

function getDataElementClass(dataElement) {
  const qdmType = dataElement?._type; // match against for attributes
  const model = qdmType.split("QDM::")[1];
  return cqmModels[model];
}

export const applyAttribute = (
  attribute,
  type,
  attributeValue,
  dataElement
) => {
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
  // from here we know the type, we need to go through the dataElements to matchTypes
  // attributes section
  // codes section
  const [localSelectedDataElement, setLocalSelectedDataElement] =
    useState(null);
  const [displayAttributes, setDisplayAttributes] = useState([]);
  const [codesChips, setCodesChips] = useState([]);
  const [dataElements, setDataElements] = useState([]);
  const formik: any = useFormikContext();
  // data elements are required for relatedTo.
  useEffect(() => {
    let patient = null;
    if (formik.values?.json) {
      patient = JSON.parse(formik.values.json);
      console.log("got patient: ", patient);
      setDataElements(patient.dataElements);
    } else {
      console.log("no json!");
    }
  }, [formik.values.json]);
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
      const codesChips = [];
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
          } else if (
            localSelectedDataElement[path] instanceof cqmModels.CQL.Code
          ) {
            codesChips.push({
              name: path,
              title: _.startCase(path),
              value: stringifyValue(
                localSelectedDataElement[path],
                true,
                codeSystemMap
              ),
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
      setCodesChips(codesChips);
    } else {
      console.log("landed here...something is missing...");
      console.log("localSelectedDataElement: ", localSelectedDataElement);
      console.log("codeSystemMap: ", codeSystemMap);
      console.log("dataElements: ", dataElements);
    }
  }, [localSelectedDataElement, codeSystemMap, dataElements]);
  // centralize state one level up so we can conditionally render our child component
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
          canEdit={true}
          selectedDataElement={localSelectedDataElement}
        ></Timing>
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
            console.log(`attribute [${attribute}];; type [${type}];; attributeValue: `, attributeValue);
            const updatedDataElement = applyAttribute(
              attribute,
              type,
              attributeValue,
              localSelectedDataElement
            );
            console.log("updatedDataElement: ", updatedDataElement);
            setLocalSelectedDataElement(updatedDataElement);
            if (onChange) {
              onChange(updatedDataElement);
            }
          }}
        />
      )}
      {/* uncomment later when we do something with it */}
      {/* {activeTab === 'negation_rationale' && <NegationRationale />} */}
      <Button onClick={() => {
        console.log("cqmMeasureState: ",  cqmMeasureState);
        console.log("formik.values: ", formik.values);
      }}>Debug</Button>
    </div>
  );
};
export default DataElementsCard;
