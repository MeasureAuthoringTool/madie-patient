import React from "react";

import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import TimingRow from "./TimingRow";
import TimingCell from "./TimingCell";

import {
  AssessmentPerformed,
  Participation,
  Symptom,
  CommunicationPerformed,
  ProcedurePerformed,
  FacilityLocation,
  PatientCharacteristicExpired,
  ImmunizationOrder,
  DiagnosticStudyPerformed,
  CQL,
} from "cqm-models";

import { QDMPatient } from "cqm-models/app/assets/javascripts/QDMPatient";

const { DateTime } = CQL;
const { findByText } = screen;

describe("timingRow component", () => {
  test("TimingRow component renders", async () => {
    render(<TimingRow abbr="abbr" val="value" />);
    const value = await findByText("value");
    expect(value).toBeInTheDocument();
  });
});

describe("Timing Cell component", () => {
  test("Timing Cell component renders for AssessmentPerformed", async () => {
    const el1 = new AssessmentPerformed();
    const relevantPeriod = {
      low: new DateTime(2022, 4, 5, 8, 0, 0, 0, 0),
      high: new DateTime(2023, 4, 5, 8, 15, 0, 0, 0),
      lowClosed: true,
      highClosed: true,
    };
    const relevantDatetime = new DateTime(2022, 1, 19, 12, 0, 0, 0, 0);
    const authorDatetime = new DateTime(2022, 1, 19, 13, 0, 0, 0, 0);
    el1.set("authorDatetime", authorDatetime);
    el1.set("relevantDatetime", relevantDatetime);
    el1.set("relevantPeriod", relevantPeriod);
    render(<TimingCell element={el1} />);
    const foundRelevantPeriod = await findByText(
      "04/05/2022 8:00 AM - 04/05/2023 8:15 AM"
    );
    expect(foundRelevantPeriod).toBeInTheDocument();
    const foundAuthorDateTime = await findByText("01/19/2022 12:00 PM");
    expect(foundAuthorDateTime).toBeInTheDocument();
    const foundRelevantDateTime = await findByText("01/19/2022 1:00 PM");
    expect(foundRelevantDateTime).toBeInTheDocument();
  });
  test("Timing Cell component renders for Partcipation", async () => {
    const el2 = new Participation();
    const participationPeriod = {
      low: new DateTime(2022, 4, 5, 8, 0, 0, 0, 0),
      high: new DateTime(2023, 4, 5, 8, 15, 0, 0, 0),
      lowClosed: true,
      highClosed: true,
    };
    el2.set("participationPeriod", participationPeriod);
    render(<TimingCell element={el2} />);
    const foundParticipationPeriod = await findByText(
      "04/05/2022 8:00 AM - 04/05/2023 8:15 AM"
    );
    expect(foundParticipationPeriod).toBeInTheDocument();
  });
  test("Timing Cell component renders for Symptom", async () => {
    const el3 = new Symptom();
    const prevalencePeriod = {
      low: "2000-04-05T08:00:00.000+0000",
      high: "2003-04-05T08:15:00.000+0000",
      lowClosed: true,
      highClosed: true,
    };
    el3.set("prevalencePeriod", prevalencePeriod);
    render(<TimingCell element={el3} />);
    const foundprevalencePeriod = await findByText(
      "04/05/2000 8:00 AM - 04/05/2003 8:15 AM"
    );
    expect(foundprevalencePeriod).toBeInTheDocument();
  });
  test("Timing Cell component renders for Communication Performed", async () => {
    const el4 = new CommunicationPerformed();
    const sentDatetime = new DateTime(2009, 8, 14, 5, 0, 0, 0, 0);
    const receivedDatetime = new DateTime(2010, 1, 15, 5, 0, 0, 0, 0);
    el4.set("receivedDatetime", receivedDatetime);
    el4.set("sentDatetime", sentDatetime);
    render(<TimingCell element={el4} />);
    const foundSentDatetime = await findByText("08/14/2009 5:00 AM");
    expect(foundSentDatetime).toBeInTheDocument();
    const foundReceivedDatetim = await findByText("01/15/2010 5:00 AM");
    expect(foundReceivedDatetim).toBeInTheDocument();
  });

  test("Timing Cell component renders for Procedure Performed", async () => {
    const el5 = new ProcedurePerformed();
    const incisionDatetime = new DateTime(2013, 8, 14, 5, 0, 0, 0, 0);
    el5.set("incisionDatetime", incisionDatetime);
    render(<TimingCell element={el5} />);
    const foundIncisionTime = await findByText("08/14/2013 5:00 AM");
    expect(foundIncisionTime).toBeInTheDocument();
  });

  test("Timing Cell component renders for Facility Location", async () => {
    const el6 = new FacilityLocation();
    const locationPeriod = {
      low: "2007-04-05T08:00:00.000+0000",
      high: "2008-04-05T08:15:00.000+0000",
      lowClosed: true,
      highClosed: true,
    };
    el6.set("locationPeriod", locationPeriod);
    render(<TimingCell element={el6} />);
    const foundLocationPeriod = await findByText(
      "04/05/2007 8:00 AM - 04/05/2008 8:15 AM"
    );
    expect(foundLocationPeriod).toBeInTheDocument();
  });

  test("Timing Cell component renders for QDMPatient", async () => {
    const el7 = new QDMPatient();
    const birthDatetime = new DateTime(2010, 1, 15, 5, 0, 0, 0, 0);
    el7.set("birthDatetime", birthDatetime);
    render(<TimingCell element={el7} />);
    const foundBirthDateTime = await findByText("01/15/2010 5:00 AM");
    expect(foundBirthDateTime).toBeInTheDocument();
  });

  test("Timing Cell component renders for Patient Characteristic", async () => {
    const el8 = new PatientCharacteristicExpired();
    const expiredDatetime = new DateTime(2010, 1, 15, 5, 0, 0, 0, 0);
    el8.set("expiredDatetime", expiredDatetime);
    render(<TimingCell element={el8} />);
    const foundExpiredDateTime = await findByText("01/15/2010 5:00 AM");
    expect(foundExpiredDateTime).toBeInTheDocument();
  });
  test("Timing Cell component renders for Diagnostic Study Performed", async () => {
    const el9 = new DiagnosticStudyPerformed();
    const resultDatetime = new DateTime(2010, 1, 15, 5, 0, 0, 0, 0);
    el9.set("resultDatetime", resultDatetime);
    render(<TimingCell element={el9} />);
    const foundExpiredDateTime = await findByText("01/15/2010 5:00 AM");
    expect(foundExpiredDateTime).toBeInTheDocument();
  });
  test("Timing Cell component renders for Immunization Order", async () => {
    const el10 = new ImmunizationOrder();
    const activeDatetime = new DateTime(2010, 1, 15, 5, 0, 0, 0, 0);
    el10.set("activeDatetime", activeDatetime);
    render(<TimingCell element={el10} />);
    const foundActiveDatetime = await findByText("01/15/2010 5:00 AM");
    expect(foundActiveDatetime).toBeInTheDocument();
  });
});
