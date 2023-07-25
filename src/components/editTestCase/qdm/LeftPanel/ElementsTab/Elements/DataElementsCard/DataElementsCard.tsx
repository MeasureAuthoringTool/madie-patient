import React, { useState, useEffect } from "react";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useFormikContext } from "formik";
import {
  SKIP_ATTRIBUTES,
  getDisplayFromId,
  stringifyValue,
  PRIMARY_TIMING_ATTRIBUTES,
} from "../../../../../../../util/QdmAttributeHelpers";
import Codes from "./Codes/Codes";
import { useQdmExecutionContext } from "../../../../../../routes/qdm/QdmExecutionContext";
import SubNavigationTabs from "./SubNavigationTabs";
import cqmModels, { DataElement } from "cqm-models";
import "./DataElementsCard.scss";
import * as _ from "lodash";
import AttributeSection from "./attributes/AttributeSection";

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
  const formik: any = useFormikContext();
  // from here we know the type, we need to go through the dataElements to matchTypes
  const { cqmMeasureState } = useQdmExecutionContext();
  // attributes section
  const [displayAttributes, setDisplayAttributes] = useState([]);
  // codes section
  const [codesChips, setCodesChips] = useState([]);
  useEffect(() => {
    if (formik.values?.json && selectedDataElement && cqmMeasureState?.[0]) {
      const codesChips = [];
      const { source_data_criteria } = cqmMeasureState[0];
      let patient = null;
      patient = JSON.parse(formik.values.json);
      const displayAttributes = [];
      const qdmType = selectedDataElement?._type; // match against for attributes
      const model = qdmType.split("QDM::")[1];
      const getModel = cqmModels[model];
      const dataElements = patient.dataElements; //
      const matchingDataElements = dataElements.filter(
        (el) => el._type === qdmType
      );
      const dataElementModels = source_data_criteria.filter(
        (dataElement) => dataElement.id !== selectedDataElement.id
      );
      source_data_criteria.models = dataElementModels;
      const mappedEls = matchingDataElements.map((el) => new getModel(el));
      mappedEls.forEach((el) => {
        const primaryTimingAttributes = [];
        PRIMARY_TIMING_ATTRIBUTES.forEach((attribute) => {
          if (el[attribute]) {
            primaryTimingAttributes.push(attribute);
          }
        });
        // find primary timing attribute
        el.schema.eachPath((path, info) => {
          if (!SKIP_ATTRIBUTES.includes(path) && el[path]) {
            if (info.instance === "Array") {
              el[path].forEach((elem, index) => {
                if (path == "relatedTo") {
                  let id = elem;
                  const display = getDisplayFromId(dataElements, id);
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
                    value: stringifyValue(el[path], true),
                    isArrayValue: true,
                    index: index,
                  });
                }
              });
            } else if (path === "relatedTo") {
              const id = el[path];
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
            } else if (el[path] instanceof cqmModels.CQL.Code) {
              codesChips.push({
                name: path,
                title: _.startCase(path),
                value: stringifyValue(el[path], true),
              });
            } else {
              displayAttributes.push({
                name: path,
                title: _.startCase(path),
                value: stringifyValue(el[path], true),
              });
            }
          }
        });
      });
      setDisplayAttributes(displayAttributes);
      setCodesChips(codesChips);
    } else {
      setCodesChips([]);
      setDisplayAttributes([]);
    }
  }, [formik.values.json, selectedDataElement, cqmMeasureState]);
  // centralize state one level up so we can conditionally render our child component
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
      {cardActiveTab === "codes" && <Codes attributeChipList={codesChips} />}
      {cardActiveTab === "attributes" && (
        <AttributeSection
          attributeChipList={displayAttributes}
          selectedDataElement={selectedDataElement}
          onAddClicked={(attribute, type) => {
            // Todo: update the Patient with the selected attribute data
          }}
        />
      )}
      {/* uncomment later when we do something with it */}
      {/* {activeTab === 'negation_rationale' && <NegationRationale />} */}
    </div>
  );
};
export default DataElementsCard;
