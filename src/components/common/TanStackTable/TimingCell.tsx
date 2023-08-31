import React from "react";
import { DataElement } from "cqm-models";
import { stringifyValue } from "../../../util/QdmAttributeHelpers";
import TimingRow from "./TimingRow";

const TimingCell = ({ element }: { element: DataElement }) => {
  // Periods
  // relevantPeriod - relP
  const relevantPeriod = element?.get("relevantPeriod");
  // prevalencePeriod - prevP
  const prevalencePeriod = element?.get("prevalencePeriod");
  // participationPeriod - partP
  const participationPeriod = element?.get("participationPeriod");
  // locationPeriod - locP
  const locationPeriod = element?.get("locationPeriod");
  // Date & Time
  // relevant dateTime - reldT
  const relevantDatetime = element?.get("relevantDatetime");
  // author dateTime - authdT
  const authorDatetime = element?.get("authorDatetime");
  // sent dateTime - sentdT
  const sentDatetime = element?.get("sentDatetime");
  // received dateTime - recdT
  const receivedDatetime = element?.get("receivedDatetime");
  // result dateTime - resdT
  const resultDatetime = element?.get("resultDatetime");
  // active dateTime - actdT
  const activeDatetime = element?.get("activeDatetime");
  // birth dateTime - bdT
  const birthDatetime = element?.get("birthDatetime");
  // expired dateTime - expdT
  const expiredDatetime = element?.get("expiredDatetime");
  // incision dateTime -incdT
  const incisionDatetime = element?.get("incisionDatetime");
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
      {relevantDatetime && (
        <TimingRow abbr="reldT" val={stringifyValue(relevantDatetime)} />
      )}
      {authorDatetime && (
        <TimingRow abbr="authdT" val={stringifyValue(authorDatetime)} />
      )}
      {sentDatetime && (
        <TimingRow abbr="sentdT" val={stringifyValue(sentDatetime)} />
      )}
      {receivedDatetime && (
        <TimingRow abbr="recdT" val={stringifyValue(receivedDatetime)} />
      )}
      {resultDatetime && (
        <TimingRow abbr="resdT" val={stringifyValue(resultDatetime)} />
      )}
      {activeDatetime && (
        <TimingRow abbr="actdT" val={stringifyValue(activeDatetime)} />
      )}
      {birthDatetime && (
        <TimingRow abbr="bdT" val={stringifyValue(birthDatetime)} />
      )}
      {expiredDatetime && (
        <TimingRow abbr="expdT" val={stringifyValue(expiredDatetime)} />
      )}
      {incisionDatetime && (
        <TimingRow abbr="incdT" val={stringifyValue(incisionDatetime)} />
      )}
    </div>
  );
};

export default TimingCell;
