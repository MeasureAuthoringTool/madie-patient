import * as React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import CalculationResults from "./CalculationResults";
import { GroupPopulation } from "@madie/madie-models";
import userEvent from "@testing-library/user-event";
import { measureCql } from "../../../groupCoverage/_mocks_/QdmMeasureCql";
import QdmGroupCoverage from "../../../groupCoverage/QdmGroupCoverage";
import useCqlParsingService, {
  CqlParsingService,
} from "../../../../../api/useCqlParsingService";
import { qdmCallStack } from "../../../groupCoverage/_mocks_/QdmCallStack";

jest.mock("../../../../../api/useCqlParsingService");
const useCqlParsingServiceMock =
  useCqlParsingService as jest.Mock<CqlParsingService>;

const useCqlParsingServiceMockResolved = {
  getDefinitionCallstacks: jest.fn().mockResolvedValue(qdmCallStack),
} as unknown as CqlParsingService;
import { calculationResults } from "../../../groupCoverage/_mocks_/QdmCalculationResults";

const groups = [
  {
    groupId: "64ef",
    populationValues: [
      {
        id: "914d",
        name: "initialPopulation",
      },
      {
        id: "19c0",
        name: "denominator",
      },
      {
        id: "3fdd",
        name: "numerator",
      },
    ],
  },
  {
    groupId: "64ec",
    populationValues: [
      {
        id: "914a",
        name: "initialPopulation",
      },
      {
        id: "19cb",
        name: "denominator",
      },
      {
        id: "3fdc",
        name: "numerator",
      },
    ],
  },
] as Array<GroupPopulation>;

const measureGroups = [
  {
    id: "64ef",
    scoring: "Ratio",
    populations: [
      {
        id: "914d",
        name: "initialPopulation",
        definition: "Initial Population",
        associationType: null,
        description: "",
      },
      {
        id: "19c0",
        name: "denominator",
        definition: "Denominator",
        associationType: null,
        description: "",
      },
      {
        id: "3fdd",
        name: "numerator",
        definition: "Numerator",
        associationType: null,
        description: "",
      },
    ],
    measureObservations: [],
    groupDescription: "",
    improvementNotation: "",
    rateAggregation: "",
    measureGroupTypes: null,
    scoringUnit: "",
    stratifications: [],
    populationBasis: "false",
  },
  {
    id: "64ec",
    scoring: "Ratio",
    populations: [
      {
        id: "914a",
        name: "initialPopulation",
        definition: "Initial Population",
        description: "",
      },
      {
        id: "19cb",
        name: "denominator",
        definition: "Qualifying Encounters",
        description: "",
      },
      {
        id: "3fdc",
        name: "numerator",
        definition: "Numerator",
        associationType: null,
        description: "",
      },
    ],
    measureObservations: [],
    groupDescription: "",
    improvementNotation: "",
    rateAggregation: "",
    measureGroupTypes: null,
    scoringUnit: "",
    stratifications: [],
    populationBasis: "false",
  },
];

const getTab = (name) => screen.findByRole("tab", { name: name });
const getCriteriaOptions = () => {
  const criteriaSelector = screen.getByTestId("population-criterion-selector");
  const criteriaDropdown = within(criteriaSelector).getByRole(
    "button"
  ) as HTMLInputElement;
  userEvent.click(criteriaDropdown);
  return screen.findAllByRole("option");
};

const assertPopulationTabs = async () => {
  const ip = await getTab("IP");
  const denom = await getTab("DENOM");
  const numer = await getTab("NUMER");
  // check tabs are rendered for all populations of a group
  expect(ip).toBeInTheDocument();
  expect(denom).toBeInTheDocument();
  expect(numer).toBeInTheDocument();
  // IP is the default selected tab
  expect(ip.getAttribute("aria-selected")).toEqual("true");
  expect(denom.getAttribute("aria-selected")).toEqual("false");
  expect(numer.getAttribute("aria-selected")).toEqual("false");
};

const renderCoverageComponent = (
  groupCoverageResult = calculationResults,
  calculationErrors = undefined
) => {
  render(
    <CalculationResults
      groupCoverageResult={groupCoverageResult}
      testCaseGroups={groups}
      measureGroups={measureGroups}
      calculationErrors={calculationErrors}
      measureCql={measureCql}
    />
  );
};

describe("CalculationResults with tabbed highlighting layout off", () => {
  beforeEach(() => {
    useCqlParsingServiceMock.mockImplementation(() => {
      return useCqlParsingServiceMockResolved;
    });
  });
  test("display info message when test case has not been ran yet", () => {
    render(
      <CalculationResults
        groupCoverageResult={null}
        testCaseGroups={groups}
        measureGroups={measureGroups}
        calculationErrors={null}
        measureCql={measureCql}
      />
    );
    expect(
      screen.getByText("To see the logic highlights, click 'Run Test'")
    ).toBeInTheDocument();
    expect(screen.getByText("Population Criteria 1")).toBeInTheDocument();
  });
});

describe("CalculationResults with new tabbed highlighting layout on", () => {
  beforeEach(() => {
    useCqlParsingServiceMock.mockImplementation(() => {
      return useCqlParsingServiceMockResolved;
    });
  });
  test("highlighting tab if no groups available", () => {
    render(
      <CalculationResults
        groupCoverageResult={null}
        testCaseGroups={groups}
        measureGroups={measureGroups}
        calculationErrors={null}
        measureCql={measureCql}
      />
    );
    expect(
      screen.getByText("To see the logic highlights, click 'Run Test'")
    ).toBeInTheDocument();
  });

  test("render default highlighting view", async () => {
    renderCoverageComponent();
    expect(screen.getByText("Population Criteria 1")).toBeInTheDocument();

    await assertPopulationTabs();

    // switch population criteria/group
    const criteriaOptions = await getCriteriaOptions();
    // options to select groups
    expect(criteriaOptions).toHaveLength(2);
    userEvent.click(criteriaOptions[1]);
    // check tabs are rendered for all populations of a group
    expect(await getTab("IP")).toBeInTheDocument();
    expect(await getTab("DENOM")).toBeInTheDocument();
    expect(await getTab("NUMER")).toBeInTheDocument();
    expect(screen.getByText("Definitions")).toBeInTheDocument();
    expect(screen.getByText("Unused")).toBeInTheDocument();
    expect(screen.getByText("Functions")).toBeInTheDocument();
  });

  test("render highlighting view with coverage results for 2 groups", async () => {
    renderCoverageComponent();
    await assertPopulationTabs();
    expect(screen.getByTestId("cql-highlighting")).toHaveTextContent(
      `define "Initial Population": "Qualifying Encounters" Results[Encounter, Performed: Encounter Inpatient START: 01/09/2020 12:00 AM STOP: 01/10/2020 12:00 AM CODE: SNOMEDCT 183452005]`
    );

    // switch to denominator tab
    const denom = await getTab("DENOM");
    userEvent.click(denom);
    expect(screen.getByTestId("cql-highlighting")).toHaveTextContent(
      `define "Denominator": "Initial Population" Results[Encounter, Performed: Encounter Inpatient START: 01/09/2020 12:00 AM STOP: 01/10/2020 12:00 AM CODE: SNOMEDCT 183452005]`
    );

    // switch to numerator tab
    const numer = await getTab("NUMER");
    userEvent.click(numer);
    expect(screen.getByTestId("cql-highlighting")).toHaveTextContent(
      `define "Numerator": "Qualifying Encounters" Enc where Enc.lengthOfStay > 1 day`
    );

    const definitionsUsedResult = await screen.findByTestId(
      "definitions-used-section"
    );
    expect(definitionsUsedResult).toBeInTheDocument();

    // switch to function tab
    const functions = await getTab("Functions");
    userEvent.click(functions);
    expect(screen.getByTestId("cql-highlighting")).toHaveTextContent(
      `/** * Test comment 1 * another comment. */ define function "Denominator Observations"(QualifyingEncounter "Encounter, Performed"): duration in days of QualifyingEncounter.relevantPeriod ResultsNA`
    );
    // switch to Definitions tab
    const definitions = await getTab("Definitions");
    userEvent.click(definitions);
    const usedDefinitions = screen.getByTestId("cql-highlighting");
    expect(usedDefinitions).toHaveTextContent(`define "Initial Population"`);
    expect(usedDefinitions).toHaveTextContent(`define "Denominator"`);
    expect(usedDefinitions).toHaveTextContent(`define "Numerator"`);
    expect(usedDefinitions).toHaveTextContent(`define "Qualifying Encounters"`);

    const unused = await getTab("Unused");
    userEvent.click(unused);
    expect(screen.getByTestId("cql-highlighting")).toHaveTextContent(
      `define "Unused Encounters"`
    );

    // select population criteria 2
    const criteriaOptions = await getCriteriaOptions();
    userEvent.click(criteriaOptions[1]);
    await waitFor(() => {
      expect(screen.getByText("Population Criteria 2")).toBeInTheDocument();
    });
    expect(screen.getByTestId("cql-highlighting")).toHaveTextContent(
      `define "Initial Population": "Qualifying Encounters"`
    );
  });

  it("displays calculation results after test case execution", async () => {
    renderCoverageComponent();
    await assertPopulationTabs(); //ensures we're on the Initial Population tab

    // Check for 'Results' button on IP population tab
    const results = await screen.findByRole("button", { name: "Results" });
    await waitFor(() => {
      expect(results).toBeInTheDocument();
    });

    // Check for Initial Population result value
    const result = await screen.findByTestId("results-section");
    expect(result).toHaveTextContent(
      "[Encounter, Performed: Encounter Inpatient START: 01/09/2020 12:00 AM STOP: 01/10/2020 12:00 AM CODE: SNOMEDCT 183452005]"
    );

    // Check for Initial Population definitions used
    const definitionsUsedResult = await screen.findByTestId(
      "definitions-used-section"
    );
    expect(definitionsUsedResult).toBeInTheDocument();

    // Move to Definitions tab
    const definitions = await getTab("Definitions");
    userEvent.click(definitions);

    // Check how many 'Results' are present
    const definitionResults = await screen.findAllByRole("button", {
      name: "Results",
    });
    expect(definitionResults).toHaveLength(4);
  });
});
