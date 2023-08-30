import React from "react";

import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import TimingRow from "./TimingRow";
import TimingCell from "./TimingCell";
import { AssessmentPerformed } from "cqm-models";

const { findByText } = screen;

describe("timingRow component", () => {
  test("TimingRow component renders", async () => {
    render(<TimingRow abbr="abbr" val="value" />);
    const value = await findByText("value");
    expect(value).toBeInTheDocument();
  });
});

describe("Timing Cell component", () => {
  test("Timing Cell component renders", async () => {
    const relevantPeriod = {
      low: "2021-04-05T08:00:00.000",
      high: "2023-04-05T08:15:00.000",
      lowClosed: true,
      highClosed: true,
    };
    const prevalencePeriod = {
      low: "2000-04-05T08:00:00.000",
      high: "201-04-05T08:15:00.000",
      lowClosed: true,
      highClosed: true,
    };
    const participationPeriod = {
      low: "2020-04-05T08:00:00.000",
      high: "2023-04-05T08:15:00.000",
      lowClosed: true,
      highClosed: true,
    };
    const locationPeriod = {
      low: "207-04-05T08:00:00.000",
      high: "2008-04-05T08:15:00.000",
      lowClosed: true,
      highClosed: true,
    };
    const relevantDateTime = "2012-04-05T08:00:00.000";
    const authorDateTime = "2012-04-05T08:00:00.000";
    const sentDateTime = "2012-04-05T08:00:00.000";
    const receivedDateTime = "2012-04-05T08:00:00.000";
    const resultDateTime = "2012-04-05T08:00:00.000";
    const activeDateTime = "2012-04-05T08:00:00.000";
    const birthDateTime = "2012-04-05T08:00:00.000";
    const expiredDateTime = "2012-04-05T08:00:00.000";
    const incisionDateTime = "2012-04-05T08:00:00.000";
    const el = new AssessmentPerformed();
    el.set("relevantPeriod", relevantPeriod);
    el.set("prevalencePeriod", prevalencePeriod);
    el.set("participationPeriod", participationPeriod);
    el.set("locationPeriod", locationPeriod);

    el.set("relevvantDateTime", relevantDateTime);
    el.set("authorDateTime", authorDateTime);
    el.set("sentDateTime", sentDateTime);
    el.set("receivedDateTime", receivedDateTime);
    el.set("resultDateTime", resultDateTime);
    el.set("activeDateTime", activeDateTime);
    el.set("birthDateTime", birthDateTime);
    el.set("expiredDateTime", expiredDateTime);
    el.set("incisionDateTime", incisionDateTime);
    render(<TimingCell element={el} />);

    const foundRelevantPeriod = await findByText(
      "04/05/2021 8:00 AM - 04/05/2023 8:15 AM"
    );
    expect(foundRelevantPeriod).toBeInTheDocument();
  });
});
