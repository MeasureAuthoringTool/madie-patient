import * as React from "react";
import CodeCoverageHighlighting from "./CodeCoverageHighlighting";
import { render, screen } from "@testing-library/react";

describe("CodeCoverageHighlighting", () => {
  it("displays coverage highlighting", () => {
    render(
      <CodeCoverageHighlighting coverageHTML={"<div>100% coverage</div>"} />
    );
    expect(screen.getByTestId("code-coverage-highlighting")).toHaveTextContent(
      "100% coverage"
    );
  });

  it("displays no coverage highlighting if not available", () => {
    render(<CodeCoverageHighlighting coverageHTML={undefined} />);
    expect(
      screen.getByTestId("code-coverage-highlighting")
    ).toBeEmptyDOMElement();
  });
});
