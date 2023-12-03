import * as React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import CalculationResults from "./CalculationResults";
import { GroupPopulation } from "@madie/madie-models";
import userEvent from "@testing-library/user-event";
import { measureCql } from "../../../groupCoverage/_mocks_/QdmMeasureCql";
import { qdmCallStack } from "../../../groupCoverage/_mocks_/QdmCallStack";
import { qdmCalculationResults } from "../../../groupCoverage/_mocks_/QdmCalculationResults";
import useCqlParsingService, {
  CqlParsingService,
} from "../../../../../api/useCqlParsingService";

jest.mock("@madie/madie-util", () => ({
  useOktaTokens: () => ({
    getAccessToken: () => "test.jwt",
  }),
}));

jest.mock("../../../../../api/useCqlParsingService");
const useCqlParsingServiceMock =
  useCqlParsingService as jest.Mock<CqlParsingService>;

const useCqlParsingServiceMockResolved = {
  getAllDefinitionsAndFunctions: jest.fn().mockResolvedValue(qdmCallStack),
} as unknown as CqlParsingService;

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
        id: "915a",
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
        definition: "Denominator",
        associationType: "Denominator",
        description: "",
      },
      {
        id: "19c0",
        name: "denominator",
        definition: "Initial Population",
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
        associationType: "Denominator",
        description: "",
      },
      {
        id: "915a",
        name: "initialPopulation",
        definition: "Denominator",
        associationType: "Numerator",
        description: "",
      },
      {
        id: "19cb",
        name: "denominator",
        definition: "Initial Population",
        associationType: null,
        description: "",
      },
      {
        id: "3fdc",
        name: "numerator",
        definition: "Initial Population",
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

const getByRole = (name) => screen.findByRole("tab", { name: name });
const getCriteriaOptions = () => {
  const criteriaSelector = screen.getByTestId("population-criterion-selector");
  const criteriaDropdown = within(criteriaSelector).getByRole(
    "button"
  ) as HTMLInputElement;
  userEvent.click(criteriaDropdown);
  return screen.findAllByRole("option");
};

const assertPopulationTabs = async () => {
  const ip = await getByRole("IP");
  const denom = await getByRole("DENOM");
  const numer = await getByRole("NUMER");
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
  calculationResults = { qdmCalculationResults },
  calculationErrors = undefined
) => {
  render(
    <CalculationResults
      calculationResults={calculationResults}
      testCaseGroups={groups}
      measureCql={measureCql}
      measureGroups={measureGroups}
      calculationErrors={calculationErrors}
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
        calculationResults={null}
        testCaseGroups={groups}
        measureCql={measureCql}
        measureGroups={measureGroups}
        calculationErrors={null}
      />
    );
    expect(
      screen.getByText("To see the logic highlights, click 'Run Test'")
    ).toBeInTheDocument();
  });

  test("render calculation results", () => {
    renderCoverageComponent();
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
        calculationResults={null}
        testCaseGroups={groups}
        measureCql={measureCql}
        measureGroups={measureGroups}
        calculationErrors={null}
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
    expect(await getByRole("IP 1")).toBeInTheDocument();
    expect(await getByRole("IP 2")).toBeInTheDocument();
    expect(await getByRole("DENOM")).toBeInTheDocument();
    expect(await getByRole("NUMER")).toBeInTheDocument();
  });

  test("render highlighting view with coverage results for 2 groups", async () => {
    renderCoverageComponent();
    await assertPopulationTabs();
    expect(screen.getByTestId("IP-highlighting")).toHaveTextContent(
      `define "Denominator": "Initial Population"`
    );

    // switch to denominator tab
    const denom = await getByRole("DENOM");
    userEvent.click(denom);
    expect(screen.getByTestId("DENOM-highlighting")).toHaveTextContent(
      `Initial Population": "Inpatient Encounters`
    );

    // switch to numerator tab
    const numer = await getByRole("NUMER");
    userEvent.click(numer);
    expect(screen.getByTestId("NUMER-highlighting")).toHaveTextContent(
      `define "Numerator": "Initial Population"`
    );

    // select population criteria 2
    const criteriaOptions = await getCriteriaOptions();
    userEvent.click(criteriaOptions[1]);
    await waitFor(() => {
      expect(screen.getByText("Population Criteria 2")).toBeInTheDocument();
    });
    expect(screen.getByTestId("IP-highlighting")).toHaveTextContent(
      `define "Denominator": "Initial Population"`
    );
  });
});
