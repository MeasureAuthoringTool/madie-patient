import React, { useState } from "react";
import DateTimeInput from "../../../../../../../common/dateTimeInput/DateTimeInput";
import DateTimeInterval from "../../../../../../../common/dateTimeInterval/DateTimeInterval";
import { CQL } from "cqm-models";
import "./Timing.scss";
import { PRIMARY_TIMING_ATTRIBUTES } from "../../../../../../../../util/QdmAttributeHelpers";
import * as _ from "lodash";

const Timing = ({ canEdit, updatedDataElement, selectedDataElement }) => {
  const [currentInterval, setCurrentInterval] =
    useState<CQL.DateTimeInterval>(null);

  const handleChange = (newValue, attributeName) => {
    if (attributeName.includes("Period")) {
      setCurrentInterval(newValue);
    }
    selectedDataElement[attributeName] = newValue;
    updatedDataElement(selectedDataElement);
  };

  const displayTiming = () => {
    const displayTimingArray = [];

    for (const attr of PRIMARY_TIMING_ATTRIBUTES) {
      const timingAttr = selectedDataElement?.schema?.paths?.[attr];
      if (timingAttr) {
        if (timingAttr.instance == "Interval") {
          displayTimingArray.push(
            <div style={{ paddingRight: "30px", paddingBottom: "12px" }}>
              <DateTimeInterval
                label={_.startCase(timingAttr.path)}
                dateTimeInterval={currentInterval}
                onDateTimeIntervalChange={handleChange}
                canEdit={canEdit}
                attributeName={timingAttr.path}
              />
            </div>
          );
        } else if (timingAttr.instance == "DateTime") {
          displayTimingArray.push(
            <div style={{ paddingRight: "30px" }}>
              <DateTimeInput
                label={_.startCase(timingAttr.path)}
                canEdit={canEdit}
                dateTime={selectedDataElement.get(timingAttr.path)}
                onDateTimeChange={handleChange}
                attributeName={timingAttr.path}
              ></DateTimeInput>
            </div>
          );
        }
      }
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
