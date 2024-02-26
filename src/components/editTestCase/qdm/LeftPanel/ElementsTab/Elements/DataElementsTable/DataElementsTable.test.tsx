import * as React from "react";
import { Measure } from "@madie/madie-models";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, within } from "@testing-library/react";
import DataElementsTable from "./DataElementsTable";
import DataTypeCell from "./DataTypeCell";
import TimingRow from "./TimingRow";
import TimingCell from "./TimingCell";
import {
  dataEl,
  testValueSets,
} from "../DataElementsCard/DataElementsCard.test";
import { QdmExecutionContextProvider } from "../../../../../../routes/qdm/QdmExecutionContext";
import { QdmPatientProvider } from "../../../../../../../util/QdmPatientContext";

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
  CareGoal,
  CQL,
} from "cqm-models";
import { QDMPatient } from "cqm-models/app/assets/javascripts/QDMPatient";

const { DateTime, Code } = CQL;
const { findByText, getByTestId, queryByText, queryAllByText } = screen;

const dataElements = [
  {
    dataElementCodes: [],
    _id: "65006e928a89e50000b674c8",
    recorder: [],
    qdmTitle: "Diagnosis",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.110",
    qrdaOid: "2.16.840.1.113883.10.20.24.3.135",
    qdmCategory: "condition",
    qdmVersion: "5.6",
    _type: "QDM::Diagnosis",
    id: "65006e928a89e50000b674c8",
    codeListId: "2.16.840.1.113762.1.4.1095.55",
    description: "Diagnosis: Malnutrition Diagnosis",
    anatomicalLocationSite: {
      code: "110468005",
      system: "2.16.840.1.113883.6.96",
      version: null,
      display: "Ambulatory surgery (procedure)",
    },
    severity: {
      code: "4525004",
      system: "2.16.840.1.113883.6.96",
      version: null,
      display: "Emergency department patient visit (procedure)",
    },
  },
  {
    dataElementCodes: [],
    _id: "650322990cc70300007fe993",
    recorder: [],
    qdmTitle: "Diagnosis",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.110",
    qrdaOid: "2.16.840.1.113883.10.20.24.3.135",
    qdmCategory: "condition",
    qdmVersion: "5.6",
    _type: "QDM::Diagnosis",
    id: "650322990cc70300007fe993",
    codeListId: "2.16.840.1.113762.1.4.1095.55",
    description: "Diagnosis: Malnutrition Diagnosis",
    anatomicalLocationSite: {
      code: "238111008",
      system: "2.16.840.1.113883.6.96",
      version: null,
      display: "Deficiency of micronutrients (disorder)",
    },
  },
  {
    dataElementCodes: [],
    _id: "6507127337d9a10000ed4409",
    participant: [
      {
        qdmVersion: "5.6",
        _type: "QDM::PatientEntity",
        _id: "6507127f37d9a10000ed4480",
        hqmfOid: "2.16.840.1.113883.10.20.28.4.136",
        qrdaOid: "2.16.840.1.113883.10.20.24.3.161",
        id: "1234",
        identifier: {
          qdmVersion: "5.6",
          _type: "QDM::Identifier",
          namingSystem: "ValueSet",
          value: "Kg",
        },
      },
      {
        qdmVersion: "5.6",
        _type: "QDM::Organization",
        _id: "65087971c035e2000099cdb3",
        hqmfOid: "2.16.840.1.113883.10.20.28.4.135",
        qrdaOid: "2.16.840.1.113883.10.20.24.3.163",
        id: "this is id",
        identifier: {
          qdmVersion: "5.6",
          _type: "QDM::Identifier",
          namingSystem: "ValueSet for Org",
          value: "Value",
        },
      },
    ],
    relatedTo: ["related to a different DataElement"],
    qdmTitle: "Encounter, Performed",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
    qdmCategory: "encounter",
    qdmStatus: "performed",
    qdmVersion: "5.6",
    _type: "QDM::EncounterPerformed",
    id: "6507127337d9a10000ed4409",
    facilityLocations: [],
    diagnoses: [],
    codeListId: "2.16.840.1.113883.3.666.5.307",
    description: "Encounter, Performed: Encounter Inpatient",
    priority: {
      code: "709063003",
      system: "2.16.840.1.113883.6.96",
      version: null,
      display: "Admission to same day surgery center (procedure)",
    },
  },
];

const allowedTypes = {
  "QDM::EncounterPerformed": true,
  "QDM::Diagnosis": true,
};

const mockOnView = jest.fn();
const mockOnDelete = jest.fn();
const mockOnClone = jest.fn();

const renderDataElementsTable = (dataElements, onDelete, onView) => {
  return render(
    <QdmExecutionContextProvider
      value={{
        measureState: [{} as Measure, jest.fn],
        cqmMeasureState: [{ value_sets: testValueSets }, jest.fn],
        executionContextReady: true,
        executing: false,
        setExecuting: jest.fn(),
        contextFailure: false,
      }}
    >
      <QdmPatientProvider>
        <DataElementsTable
          dataElements={dataElements}
          onDelete={onDelete}
          onView={onView}
          allowedTypes={allowedTypes}
          canEdit={true}
          onClone={mockOnClone}
        />
      </QdmPatientProvider>
    </QdmExecutionContextProvider>
  );
};

describe("DataTypeCell", () => {
  test("DataType cell renders with a code", async () => {
    const dataEl = new AssessmentPerformed();
    const testCode = new Code("code", "system", "version", "display");
    const codeSystemMap = {
      system: "DISPLAY",
    };
    dataEl.set("dataElementCodes", [testCode]);
    render(<DataTypeCell element={dataEl} codeSystemMap={codeSystemMap} />);
    const foundCode = await findByText("DISPLAY: code");
    expect(foundCode).toBeInTheDocument();
  });
});

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
  test("Timing Cell component renders for Participation", async () => {
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
  test("Timing Cell component renders for Care Goal, StatusDate", async () => {
    const el11 = new CareGoal();
    const statusDate = new DateTime(2010, 1, 15, 5, 0, 0, 0, 0);
    el11.set("statusDate", statusDate);
    render(<TimingCell element={el11} />);
    const foundStatusDate = await findByText("01/15/2010");
    expect(foundStatusDate).toBeInTheDocument();
  });
});

const checkRowContent = (row, title, timing, attributes) => {
  const columns = within(row).getAllByRole("cell");
  expect(columns).toHaveLength(6);
  expect(columns[0]).toHaveTextContent(title);
  expect(columns[1]).toHaveTextContent(timing);
  expect(columns[2]).toHaveTextContent(attributes[0]);
  expect(columns[3]).toHaveTextContent(attributes[1]);
  expect(columns[4]).toHaveTextContent(attributes[2]);
};

describe("Data Elements Table", () => {
  test("emtpy table renders", async () => {
    renderDataElementsTable(null, mockOnDelete, mockOnView);
    expect(getByTestId("empty-table")).toBeInTheDocument();
  });

  it("Should render all required columns as per mock data", () => {
    // Includes rendering of dynamic columns for Attributes
    renderDataElementsTable(dataElements, mockOnDelete, mockOnView);
    expect(
      screen.getByRole("columnheader", {
        name: "Datatype, Value Set & Code",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: "Timing",
      })
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("columnheader", { name: /Attribute/i }).length
    ).toBe(3);
    expect(
      screen.getByRole("columnheader", {
        name: "Actions",
      })
    ).toBeInTheDocument();
  });

  it("Should render data in respective columns as per mock data", () => {
    renderDataElementsTable(dataElements, mockOnDelete, mockOnView);
    const table = screen.getByRole("table");
    const tbody = within(table).getAllByRole("rowgroup")[1];
    const rows = within(tbody).getAllByRole("row");
    checkRowContent(rows[0], "Condition, Diagnosis", "", [
      "Anatomical Location Site",
      "Severity",
      "",
    ]);
    checkRowContent(rows[1], "Condition, Diagnosis", "", [
      "Anatomical Location Site",
      "",
      "",
    ]);
    // is there is a better way to verify Complex attribute display text
    // revisit once the actual values of attributes are displayed
    checkRowContent(rows[2], /Encounter, Performed/i, "", [
      "Priority",
      "Participant",
      "Related To",
    ]);
  });

  test("delete data element action", async () => {
    renderDataElementsTable([dataEl[0], dataEl[1]], mockOnDelete, mockOnView);
    expect(queryAllByText("Emergency Department Visit").length).toEqual(2);
    // click action button
    userEvent.click(screen.getByTestId(`view-element-btn-${dataEl[0].id}`));
    expect(getByTestId("popover-content")).toBeInTheDocument();
    // click delete action
    userEvent.click(screen.getByTestId(`delete-element-${dataEl[0].id}`));
    expect(mockOnDelete).toHaveBeenCalledWith(dataEl[0].id);
  });
});
