import React from "react";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DataElement } from "cqm-models";

import Codes from "./Codes/Codes";
import SubNavigationTabs from "./SubNavigationTabs";
import { useQdmExecutionContext } from "../../../../../../routes/qdm/QdmExecutionContext";

import "./DataElementsCard.scss";
import * as _ from "lodash";
import CodeSystemSelector from "../../../../../../common/codeSystemSelector/CodeSystemSelector";

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

  // centralize state one level up so we can conditionally render our child component
  // const { cqmMeasureState } = useQdmExecutionContext();

  // const [cqmMeasure] = cqmMeasureState;

  // const valueSetForSelectedDataElement = (cqmMeasureValueSets) => {
  //   return cqmMeasureValueSets.filter(
  //     (valueSet) => valueSet.display_name === "Diabetes"
  //   );
  // };

  return (
    <div className="data-elements-card" data-testid="data-element-card">
      <div className="heading-row">
        <div className="text-container">
          <div className="title">
            {selectedDataElement.qdmStatus
              ? _.capitalize(selectedDataElement.qdmStatus)
              : selectedDataElement.qdmTitle}
            :&nbsp;
          </div>
          <div className="sub-text">
            {selectedDataElement.description.substring(
              selectedDataElement.description.indexOf(":") + 2,
              selectedDataElement.description.length
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
      {/* uncomment later when we do something with it */}
      {/* {activeTab === 'attributes' && <Attributes />} */}
      {/* {activeTab === 'negation_rationale' && <NegationRationale />} */}

      {/* <CodeSystemSelector
        canEdit={true}
        codeSystemProps={{
          label: "Code System",
          options: valueSetForSelectedDataElement(cqmMeasure.value_sets),
          required: false,
          error: false,
          helperText: "",
        }}
      /> */}
    </div>
  );
};
export default DataElementsCard;
