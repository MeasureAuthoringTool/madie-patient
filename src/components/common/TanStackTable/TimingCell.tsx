import React from "react";
import { DataElement } from "cqm-models";
import { stringifyValue } from "../../../util/QdmAttributeHelpers";
import TimingRow from "./TimingRow";

const TimingCell = ({ element }: { element: DataElement }) => {
  // Periods
  // relevantPeriod - relP
  const relevantPeriod = element.get("relevantPeriod");
  // prevalencePeriod - prevP
  const prevalencePeriod = element.get("prevalencePeriod");
  // participationPeriod - partP
  const participationPeriod = element.get("participationPeriod");
  // locationPeriod - locP
  const locationPeriod = element.get("locationPeriod");
  // Date & Time
  // relevant dateTime - reldT
  const relevantDateTime = element.get("relevantDateTime");
  // author dateTime - authdT
  const authorDateTime = element.get("authorDateTime");
  // sent dateTime - sentdT
  const sentDateTime = element.get("sentDateTime");
  // received dateTime - recdT
  const receivedDateTime = element.get("receivedDateTime");
  // result dateTime - resdT
  const resultDateTime = element.get("resultDateTime");
  // active dateTime - actdT
  const activeDateTime = element.get("activeDateTime");
  // birth dateTime - bdT
  const birthDateTime = element.get("birthDateTime");
  // expired dateTime - expdT
  const expiredDateTime = element.get("expiredDateTime");
  // incision dateTime -incdT
  const incisionDateTime = element.get("incisionDateTime");
  // Date
  // statusDate - statD
  return (
    <div className="timing-cell-container">
      {relevantPeriod && (
        <TimingRow abbr="relP" val={stringifyValue(relevantPeriod)} />
      )}
      {prevalencePeriod && (
        <TimingRow abbr="prevP" val={stringifyValue(prevalencePeriod)} />
      )}
      {participationPeriod && (
        <TimingRow abbr="PartP" val={stringifyValue(participationPeriod)} />
      )}
      {locationPeriod && (
        <TimingRow abbr="LocP" val={stringifyValue(locationPeriod)} />
      )}
      {relevantDateTime && (
        <TimingRow abbr="reldT" val={stringifyValue(relevantDateTime)} />
      )}
      {authorDateTime && (
        <TimingRow abbr="authdT" val={stringifyValue(authorDateTime)} />
      )}
      {sentDateTime && (
        <TimingRow abbr="sentdT" val={stringifyValue(sentDateTime)} />
      )}
      {receivedDateTime && (
        <TimingRow abbr="recdT" val={stringifyValue(receivedDateTime)} />
      )}
      {resultDateTime && (
        <TimingRow abbr="resdT" val={stringifyValue(resultDateTime)} />
      )}
      {activeDateTime && (
        <TimingRow abbr="actdT" val={stringifyValue(activeDateTime)} />
      )}
      {birthDateTime && (
        <TimingRow abbr="bdT" val={stringifyValue(birthDateTime)} />
      )}
      {expiredDateTime && (
        <TimingRow abbr="expdT" val={stringifyValue(expiredDateTime)} />
      )}
      {incisionDateTime && (
        <TimingRow abbr="incdT" val={stringifyValue(incisionDateTime)} />
      )}
    </div>
  );
};

export default TimingCell;
