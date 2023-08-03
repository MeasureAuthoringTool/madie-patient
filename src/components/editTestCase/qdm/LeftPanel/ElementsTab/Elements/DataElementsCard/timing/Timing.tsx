import React, { useState } from "react";
import { DateTimeField } from "@madie/madie-design-system/dist/react";
import DateTimeInterval from "../../../../../../../common/dateTimeInterval/DateTimeInterval";
import { CQL } from "cqm-models";
import "./Timing.scss";

const Timing = ({ canEdit, selectedDataElement }) => {
  const [currentRelevantPeriod, setCurrentRelevantPeriod] =
    useState<CQL.DateTimeInterval>();
  const [currentPrevalencePeriod, setCurrentPrevalencePeriod] =
    useState<CQL.DateTimeInterval>();
  const [currentParticipationPeriod, setCurrentParticipationPeriod] =
    useState<CQL.DateTimeInterval>();

  const handleRelevantPeriodChange = (newValue) => {
    setCurrentRelevantPeriod(newValue);
  };

  const handlePrevalencePeriodChange = (newValue) => {
    setCurrentPrevalencePeriod(newValue);
  };

  const handleParticipationPeriodChange = (newValue) => {
    setCurrentParticipationPeriod(newValue);
  };

  const handleRelevantDateTimeChange = (newValue) => {};

  const handleAuthorDateTimeChange = (newValue) => {};

  const handleResultDateTimeChange = (newValue) => {};

  const displayTiming = () => {
    const displayTimingArray = [];

    if (selectedDataElement?.schema?.paths?.relevantPeriod) {
      displayTimingArray.push(
        <div style={{ paddingRight: "24px" }}>
          <DateTimeInterval
            label="Relevant Period"
            dateTimeInterval={currentRelevantPeriod}
            onDateTimeIntervalChange={handleRelevantPeriodChange}
            canEdit={canEdit}
          ></DateTimeInterval>
        </div>
      );
    }

    if (selectedDataElement?.schema?.paths?.authorDatetime) {
      displayTimingArray.push(
        <div style={{ paddingRight: "24px" }}>
          <DateTimeField
            disabled={!canEdit}
            label={`Author Date/Time`}
            handleDateTimeChange={handleAuthorDateTimeChange}
            dateTimeValue=""
          ></DateTimeField>
        </div>
      );
    }

    if (selectedDataElement?.schema?.paths?.relevantDatetime) {
      displayTimingArray.push(
        <div style={{ paddingTop: "12px", paddingRight: "24px" }}>
          <DateTimeField
            disabled={!canEdit}
            label={`Relevant Date/Time`}
            handleDateTimeChange={handleRelevantDateTimeChange}
            dateTimeValue=""
          ></DateTimeField>
        </div>
      );
    }

    if (selectedDataElement?.schema?.paths?.resultDatetime) {
      displayTimingArray.push(
        <div style={{ paddingTop: "12px", paddingRight: "24px" }}>
          <DateTimeField
            disabled={!canEdit}
            label={`Result Date/Time`}
            handleDateTimeChange={handleResultDateTimeChange}
            dateTimeValue=""
          ></DateTimeField>
        </div>
      );
    }

    if (selectedDataElement?.schema?.paths?.prevalencePeriod) {
      displayTimingArray.push(
        <div style={{ paddingRight: "24px" }}>
          <DateTimeInterval
            label="Prevalence Period"
            dateTimeInterval={currentPrevalencePeriod}
            onDateTimeIntervalChange={handlePrevalencePeriodChange}
            canEdit={canEdit}
          ></DateTimeInterval>
        </div>
      );
    }

    if (selectedDataElement?.schema?.paths?.participationPeriod) {
      displayTimingArray.push(
        <DateTimeInterval
          label="Participation Period"
          dateTimeInterval={currentParticipationPeriod}
          onDateTimeIntervalChange={handleParticipationPeriodChange}
          canEdit={canEdit}
        ></DateTimeInterval>
      );
    }

    return displayTimingArray;
  };

  return (
    <>
      <h4>Timing</h4>
      <div className="box">{displayTiming()}</div>
    </>
  );
};

export default Timing;
