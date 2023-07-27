import React, { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DataElement } from "cqm-models";

import Codes from "./Codes/Codes";
import SubNavigationTabs from "./SubNavigationTabs";

import "./DataElementsCard.scss";
import * as _ from "lodash";
import AttributeSection from "./attributes/AttributeSection";

const applyAttribute = (attribute, type, attributeValue, dataElement) => {
  //TODO: Investigate if cloneDeep result is sufficient for execution (updating the field drops all the sets/gets from the dataElement)
  const updatedDataElement=_.cloneDeep(dataElement)
  updatedDataElement[_.camelCase(attribute)]= attributeValue
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
  const negationRationale =
    selectedDataElement?.hasOwnProperty("negationRationale");
  // https://ecqi.healthit.gov/mcw/2020/qdm-attribute/negationrationale.html  (list of all categories that use negation rationale)
  const [localDataElement, setLocalDataElement] = useState<DataElement>(selectedDataElement);
  useEffect(() => {
    setLocalDataElement(selectedDataElement)
  }, [selectedDataElement]);



  // centralize state one level up so we can conditionally render our child component
  return (
    <div className="data-elements-card" data-testid="data-element-card">
      <div className="heading-row">
        <div className="text-container">
          <div className="title">
            {localDataElement.qdmStatus
              ? _.capitalize(localDataElement.qdmStatus)
              : localDataElement.qdmTitle}
            :&nbsp;
          </div>
          <div className="sub-text">
            {localDataElement.description.substring(
              localDataElement.description.indexOf(":") + 2,
              localDataElement.description.length
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
      {cardActiveTab === "codes" && <Codes />}
      {cardActiveTab === "attributes" && (
        <AttributeSection
          selectedDataElement={localDataElement}
          onAddClicked={(attribute, type, attributeValue) => {
            const updatedDataElement = applyAttribute(attribute, type, attributeValue, localDataElement);
            setLocalDataElement(updatedDataElement)
          }}
        />
      )}
      {/* uncomment later when we do something with it */}
      {/* {activeTab === 'negation_rationale' && <NegationRationale />} */}
    </div>
  );
};
export default DataElementsCard;
