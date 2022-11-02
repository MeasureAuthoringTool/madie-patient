import * as React from "react";
import { render, screen } from "@testing-library/react";
import CalculationResults from "./CalculationResults";
import { DetailedPopulationGroupResult } from "fqm-execution/build/types/Calculator";
describe("CalculationResults", () => {
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

  test("display info message when test case has not been ran yet", () => {
    render(
      <CalculationResults
        calculationResults={undefined}
        calculationErrors={undefined}
      />
    );
    expect(
      screen.getByText("To see the logic highlights, click 'Run Test'")
    ).toBeInTheDocument();
  });
  test("render calculation results", () => {
    render(
      <CalculationResults
        calculationResults={calculationResults}
        calculationErrors={undefined}
      />
    );
    expect(screen.getByText("Population Criteria 1")).toBeInTheDocument();

    expect(screen.getByText("Population Criteria 2")).toBeInTheDocument();
  });

  test("render calculation errors if any", () => {
    const errorMessage = "Something is not right";
    render(
      <CalculationResults
        calculationResults={[]}
        calculationErrors={{ status: "error", message: errorMessage }}
      />
    );
    expect(screen.getByText(`${errorMessage}`)).toBeInTheDocument();
    expect(screen.getByTestId("calculation-results").innerHTML).toEqual("");
  });

  test("render highlighting if calculation results not have coverage html", () => {
    // no coverage html present in results
    calculationResults[0].html = undefined;
    calculationResults[1].html = undefined;
    render(
      <CalculationResults
        calculationResults={[]}
        calculationErrors={undefined}
      />
    );
    expect(screen.getByTestId("calculation-results").innerHTML).toEqual("");
  });
});
