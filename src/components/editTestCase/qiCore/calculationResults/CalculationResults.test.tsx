import * as React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import CalculationResults from "./CalculationResults";
import { DetailedPopulationGroupResult } from "fqm-execution/build/types/Calculator";
import { GroupPopulation } from "@madie/madie-models";
// @ts-ignore
import { useFeatureFlags } from "@madie/madie-util";
import { FinalResult, PopulationType, Relevance } from "fqm-execution";
import userEvent from "@testing-library/user-event";

jest.mock("@madie/madie-util", () => {
  return {
    useFeatureFlags: jest.fn(),
  };
});

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

const renderCoverageComponent = (
  calculationResults = undefined,
  calculationErrors = undefined
) => {
  render(
    <CalculationResults
      groupPopulations={groups}
      calculationResults={calculationResults}
      calculationErrors={calculationErrors}
    />
  );
};

describe("CalculationResults with tabbed highlighting layout off", () => {
  const calculationResults: DetailedPopulationGroupResult[] = [
    {
      clauseResults: [],
      episodeResults: undefined,
      groupId: "630fbc7cfcfab9623214ccca",
      populationResults: [],
      statementResults: [],
      stratifierResults: undefined,
      html: '<div><h2>Population Group: 630fbc7cfcfab9623214ccca</h2><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">\n<code>\n<span data-ref-id="16" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>define &quot;ipp&quot;:\n  </span><span data-ref-id="15" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>exists </span><span data-ref-id="14" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span><span data-ref-id="8" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="7" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="7" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>[&quot;Encounter&quot;: </span><span><span>&quot;Office Visit&quot;</span></span><span>]</span></span></span><span> E</span></span></span><span> </span><span data-ref-id="13" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>where </span><span data-ref-id="13" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="11" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="10" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="9" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>E</span></span><span>.</span><span data-ref-id="10" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>period</span></span></span><span>.</span><span data-ref-id="11" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>start</span></span></span><span data-ref-id="13" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"> during </span><span data-ref-id="12" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>&quot;Measurement Period&quot;</span></span></span></span></span></span></span></code>\n</pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">\n<code>\n<span data-ref-id="1096" style=""><span>define function &quot;ToDateTime&quot;(value </span><span data-ref-id="1093" style=""><span>dateTime</span></span><span> ):\n  </span><span data-ref-id="1095" style=""><span data-ref-id="1095" style=""><span data-ref-id="1094" style=""><span>value</span></span><span>.</span><span data-ref-id="1095" style=""><span>value</span></span></span></span></span></code>\n</pre></div>',
    },
    {
      clauseResults: [],
      episodeResults: undefined,
      groupId: "6317bfd19f07ac6229ffceb2",
      populationResults: [],
      statementResults: [],
      stratifierResults: undefined,
      html: '<div><h2>Population Group: 6317bfd19f07ac6229ffceb2</h2><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">\n<code>\n<span data-ref-id="16" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>define &quot;ipp&quot;:\n  </span><span data-ref-id="15" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>exists </span><span data-ref-id="14" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span><span data-ref-id="8" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="7" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="7" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>[&quot;Encounter&quot;: </span><span><span>&quot;Office Visit&quot;</span></span><span>]</span></span></span><span> E</span></span></span><span> </span><span data-ref-id="13" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>where </span><span data-ref-id="13" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="11" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="10" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="9" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>E</span></span><span>.</span><span data-ref-id="10" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>period</span></span></span><span>.</span><span data-ref-id="11" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>start</span></span></span><span data-ref-id="13" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"> during </span><span data-ref-id="12" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>&quot;Measurement Period&quot;</span></span></span></span></span></span></span></code>\n</pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">\n<code>\n<span data-ref-id="1096" style=""><span>define function &quot;ToDateTime&quot;(value </span><span data-ref-id="1093" style=""><span>dateTime</span></span><span> ):\n  </span><span data-ref-id="1095" style=""><span data-ref-id="1095" style=""><span data-ref-id="1094" style=""><span>value</span></span><span>.</span><span data-ref-id="1095" style=""><span>value</span></span></span></span></span></code>\n</pre></div>',
    },
  ];

  beforeEach(() => {
    useFeatureFlags.mockReturnValue({ highlightingTabs: false });
  });

  test("display info message when test case has not been ran yet", () => {
    renderCoverageComponent();
    expect(
      screen.getByText("To see the logic highlights, click 'Run Test'")
    ).toBeInTheDocument();
  });

  test("render calculation results", () => {
    renderCoverageComponent(calculationResults);
    expect(screen.getByText("Population Criteria 1")).toBeInTheDocument();
    expect(screen.getByText("Population Criteria 2")).toBeInTheDocument();
  });

  test("render calculation errors if any", () => {
    const errorMessage = "Something is not right";
    renderCoverageComponent([], { status: "error", message: errorMessage });
    expect(screen.getByText(`${errorMessage}`)).toBeInTheDocument();
    expect(screen.getByTestId("calculation-results").innerHTML).toEqual("");
  });
});

describe("CalculationResults with new tabbed highlighting layout on", () => {
  const calculationResults: DetailedPopulationGroupResult[] = [
    {
      groupId: "64ef",
      html: "<div><h2>Population Group: 64ef</h2></div>",
      populationRelevance: [
        {
          criteriaExpression: "Initial Population 1",
          populationType: PopulationType.IPP,
          result: true,
          populationId: "914d",
        },
        {
          criteriaExpression: "Denominator 1",
          populationType: PopulationType.DENOM,
          result: true,
          populationId: "19c0",
        },
        {
          criteriaExpression: undefined,
          populationType: PopulationType.DENEX,
          result: false,
        },
        {
          criteriaExpression: "Numerator 1",
          populationType: PopulationType.NUMER,
          result: false,
          populationId: "3fdd",
        },
        {
          criteriaExpression: undefined,
          populationType: PopulationType.NUMEX,
          result: false,
        },
        {
          criteriaExpression: undefined,
          populationType: PopulationType.DENEXCEP,
          result: false,
        },
      ],
      statementResults: [
        {
          libraryName: "OncologyMeasureTest",
          statementName: "Initial Population 1",
          localId: "90",
          final: FinalResult.TRUE,
          relevance: Relevance.TRUE,
          isFunction: false,
          pretty:
            "[Encounter\nID: 123\nPERIOD: 03/02/2024 9:00:00 AM - 03/02/2024 9:00:00 AM\nTYPE: [CPT 99213]]",
          statementLevelHTML: "<pre>IP 1 Covered</pre>",
        },
        {
          libraryName: "OncologyMeasureTest",
          statementName: "Denominator 1",
          localId: "92",
          final: FinalResult.TRUE,
          relevance: Relevance.TRUE,
          isFunction: false,
          pretty:
            "[Encounter\nID: 5ca52604b8484613a555a8f8\nPERIOD: 03/02/2024 9:00:00 AM - 03/02/2024 9:00:00 AM\nTYPE: [CPT 99213]]",
          statementLevelHTML: "<pre>DENOM 1 Covered</pre>",
        },
        {
          libraryName: "OncologyMeasureTest",
          statementName: "Numerator 1",
          localId: "140",
          final: FinalResult.FALSE,
          relevance: Relevance.TRUE,
          raw: [],
          isFunction: false,
          pretty: "FALSE ([])",
          statementLevelHTML: "<pre>NUMER 1 Partially Covered</pre>",
        },
        {
          libraryName: "FHIRHelpers",
          statementName: "ToCalendarUnit",
          localId: "54",
          final: FinalResult.FALSE,
          relevance: Relevance.TRUE,
          isFunction: true,
          pretty: "FUNCTION",
          statementLevelHTML: "<pre>ToCalendarUnit Function Covered</pre>",
        },
      ],
    },
    {
      groupId: "64ec",
      html: "<div><h2>Population Group: 64ec</h2></div>",
      populationRelevance: [
        {
          criteriaExpression: "Initial Population 2",
          populationType: PopulationType.IPP,
          result: true,
          populationId: "914a",
        },
        {
          criteriaExpression: "Initial Population 2-1",
          populationType: PopulationType.IPP,
          result: true,
          populationId: "915a",
        },
        {
          criteriaExpression: "Denominator 2",
          populationType: PopulationType.DENOM,
          result: true,
          populationId: "19cb",
        },
        {
          criteriaExpression: undefined,
          populationType: PopulationType.DENEX,
          result: false,
        },
        {
          criteriaExpression: "Numerator 2",
          populationType: PopulationType.NUMER,
          result: false,
          populationId: "3fdc",
        },
        {
          criteriaExpression: undefined,
          populationType: PopulationType.NUMEX,
          result: false,
        },
        {
          criteriaExpression: undefined,
          populationType: PopulationType.DENEXCEP,
          result: false,
        },
      ],
      statementResults: [
        {
          libraryName: "OncologyMeasureTest",
          statementName: "Initial Population 2",
          localId: "116",
          final: FinalResult.FALSE,
          relevance: Relevance.TRUE,
          raw: [],
          isFunction: false,
          pretty: "FALSE ([])",
          statementLevelHTML: "<pre>IP 2 Not Covered</pre>",
        },
        {
          libraryName: "OncologyMeasureTest",
          statementName: "Denominator 2",
          localId: "118",
          final: FinalResult.UNHIT,
          relevance: Relevance.FALSE,
          raw: [],
          isFunction: false,
          pretty: "UNHIT",
          statementLevelHTML: "<pre>DENOM 2 Not Relevant</pre>",
        },
        {
          libraryName: "OncologyMeasureTest",
          statementName: "Numerator 2",
          localId: "180",
          final: FinalResult.UNHIT,
          relevance: Relevance.FALSE,
          raw: [],
          isFunction: false,
          pretty: "UNHIT",
          statementLevelHTML: "<pre>NUMER 2 Not Relevant</pre>",
        },
      ],
    },
  ];

  beforeEach(() => {
    useFeatureFlags.mockReturnValue({ highlightingTabs: true });
  });

  const getByRole = (name) => screen.findByRole("tab", { name: name });
  const getCriteriaOptions = () => {
    const criteriaSelector = screen.getByTestId(
      "population-criterion-selector"
    );
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

  // TODO: this scenario needs to be run by UI/UX
  test("highlighting tab if no groups available", () => {
    render(
      <CalculationResults
        groupPopulations={[]}
        calculationResults={undefined}
        calculationErrors={undefined}
      />
    );
    expect(
      screen.getByText("To see the logic highlights, click 'Run Test'")
    ).toBeInTheDocument();
  });

  test("render default highlighting view", async () => {
    renderCoverageComponent();
    expect(screen.getByText("Population Criteria 1")).toBeInTheDocument();
    expect(screen.getByText("No results available")).toBeInTheDocument();
    expect(screen.getByText("Definitions")).toBeInTheDocument();
    expect(screen.getByText("No results available")).toBeInTheDocument();
    expect(screen.getByText("Unused")).toBeInTheDocument();
    expect(screen.getByText("No results available")).toBeInTheDocument();
    expect(screen.getByText("Functions")).toBeInTheDocument();
    expect(screen.getByText("No results available")).toBeInTheDocument();

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
    renderCoverageComponent(calculationResults);
    await assertPopulationTabs();
    expect(screen.getByTestId("IP-highlighting")).toHaveTextContent(
      "IP 1 Covered"
    );
    expect(screen.getByTestId("results-section")).toHaveTextContent(
      `[Encounter ID: 123 PERIOD: 03/02/2024 9:00:00 AM - 03/02/2024 9:00:00 AM TYPE: [CPT 99213]]`
    );
    // switch to denominator tab
    const denom = await getByRole("DENOM");
    userEvent.click(denom);
    expect(screen.getByTestId("DENOM-highlighting")).toHaveTextContent(
      "DENOM 1 Covered"
    );
    expect(screen.getByTestId("results-section")).toHaveTextContent(
      `[Encounter ID: 5ca52604b8484613a555a8f8 PERIOD: 03/02/2024 9:00:00 AM - 03/02/2024 9:00:00 AM TYPE: [CPT 99213]]`
    );

    // switch to numerator tab
    const numer = await getByRole("NUMER");
    userEvent.click(numer);
    expect(screen.getByTestId("NUMER-highlighting")).toHaveTextContent(
      "NUMER 1 Partially Covered"
    );
    expect(screen.getByTestId("results-section")).toHaveTextContent(
      `FALSE ([])`
    );

    const functions = await getByRole("Functions");
    userEvent.click(functions);
    expect(screen.getByTestId("functions-highlighting")).toHaveTextContent(
      "ToCalendarUnit Function Covered"
    );

    // select population criteria 2
    const criteriaOptions = await getCriteriaOptions();
    userEvent.click(criteriaOptions[1]);
    await waitFor(() => {
      expect(screen.getByText("Population Criteria 2")).toBeInTheDocument();
    });
    expect(screen.getByTestId("IP-highlighting")).toHaveTextContent(
      "IP 2 Not Covered"
    );

    const definitions = await getByRole("Definitions");
    userEvent.click(definitions);
    expect(screen.getByText("IP 2 Not Covered")).toBeInTheDocument();
    expect(screen.getAllByText("UNHIT").length).toEqual(2);
  });
});
