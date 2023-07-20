import React, { useState, useEffect } from "react";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DataElement, QDMPatient, CQL } from "cqm-models";

import Codes from "./Codes/Codes";
import SubNavigationTabs from "./SubNavigationTabs";

import "./DataElementsCard.scss";
import * as _ from "lodash";
import AttributeSection from "./attributes/AttributeSection";

import Timing from "./Timing";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useFormikContext } from "formik";

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
  dayjs.extend(utc);
  dayjs.utc().format(); // utc format
  const formik: any = useFormikContext();
  const [qdmPatient, setQdmPatient] = useState<QDMPatient>();
  const [startDate, setStartDate] = useState<CQL.DateTime>(null);
  const [endDate, setEndDate] = useState<CQL.DateTime>(null);

  const negationRationale =
    selectedDataElement?.hasOwnProperty("negationRationale");
  // https://ecqi.healthit.gov/mcw/2020/qdm-attribute/negationrationale.html  (list of all categories that use negation rationale)

  useEffect(() => {
    let patient: QDMPatient = null;
    if (formik.values?.json) {
      patient = JSON.parse(formik.values.json);
    }
    if (patient) {
      setQdmPatient(patient);
    }
  }, [formik.values?.json]);

  const generateNewQdmPatient = (newElement: DataElement) => {
    const patient: QDMPatient = new QDMPatient();
    if (qdmPatient?.birthDatetime) {
      patient.birthDatetime = qdmPatient.birthDatetime;
    }
    let dataElements: DataElement[] = [];
    qdmPatient?.dataElements?.forEach((element) => {
      if (
        element.qdmCategory !== newElement.qdmCategory &&
        element.qdmStatus !== newElement.qdmStatus
      ) {
        dataElements.push(element);
      }
    });
    dataElements.push(newElement);
    patient.dataElements = dataElements;
    return patient;
  };

  const getCQLDateTime = (value) => {
    const newDateTime = dayjs.utc(value);
    const newCQLDateTime: CQL.DateTime = new CQL.DateTime(
      newDateTime.year(),
      newDateTime.month() + 1,
      newDateTime.date(),
      newDateTime.hour(),
      newDateTime.minute(),
      newDateTime.second(),
      0,
      0
    );
    return newCQLDateTime;
  };
  const handleStartDateTimeChange = (newValue) => {
    const newStartDate: CQL.DateTime = getCQLDateTime(newValue);
    setStartDate(newStartDate);
    const relevantPeriod: CQL.Interval = new CQL.Interval(
      newStartDate,
      endDate
    );
    selectedDataElement.relevantPeriod = relevantPeriod;
    setSelectedDataElement(selectedDataElement);

    const patient: QDMPatient = generateNewQdmPatient(selectedDataElement);
    setQdmPatient(patient);
    formik.setFieldValue("json", JSON.stringify(patient));
  };

  const handleEndDateTimeChange = (newValue) => {
    const newEndDate: CQL.DateTime = getCQLDateTime(newValue);
    setEndDate(newEndDate);
    const relevantPeriod: CQL.Interval = new CQL.Interval(
      startDate,
      newEndDate
    );
    selectedDataElement.relevantPeriod = relevantPeriod;
    setSelectedDataElement(selectedDataElement);

    const patient: QDMPatient = generateNewQdmPatient(selectedDataElement);
    setQdmPatient(patient);
    formik.setFieldValue("json", JSON.stringify(patient));
  };

  const handleAuthorDateTimeChange = (newValue) => {
    const formatted = dayjs.utc(newValue).format();
    selectedDataElement.authorDatetime = formatted;
    setSelectedDataElement(selectedDataElement);

    const patient: QDMPatient = generateNewQdmPatient(selectedDataElement);
    setQdmPatient(patient);
    formik.setFieldValue("json", JSON.stringify(patient));
  };

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

      {(selectedDataElement.qdmCategory === "encounter" ||
        selectedDataElement.qdmCategory === "assessment") &&
        selectedDataElement.qdmStatus === "performed" && (
          <Timing
            canEdit={true}
            label="Relevant Period"
            handleStartDateTimeChange={handleStartDateTimeChange}
            startDateTime=""
            handleEndDateTimeChange={handleEndDateTimeChange}
            endDateTime=""
            handleAuthorDateTimeChange={handleAuthorDateTimeChange}
            authorDateTime=""
          ></Timing>
        )}
      {/* Govern our navigation for codes/att/negation */}
      <SubNavigationTabs
        negationRationale={negationRationale}
        activeTab={cardActiveTab}
        setActiveTab={setCardActiveTab}
      />
      {cardActiveTab === "codes" && <Codes />}
      {cardActiveTab === "attributes" && (
        <AttributeSection
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
