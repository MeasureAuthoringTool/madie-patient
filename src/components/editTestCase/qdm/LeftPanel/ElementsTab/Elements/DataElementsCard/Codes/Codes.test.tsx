import React from "react";
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Codes from "./Codes";

describe("Codes section", () => {
  const { findByText, getByTestId } = screen;
  test("Codes section renders with default props", () => {
    render(<Codes />);
    expect(getByTestId("codes-section")).toBeInTheDocument();
  });
  test("Codes section should display a basic list of Code chips with no functionality", async () => {
    render(
      <Codes
        attributeChipList={[
          { title: "code1", name: "code1", value: "codesystem1 codevalue1" },
          { title: "code2", name: "code2", value: "codesystem2 codevalue2" },
        ]}
      />
    );
    const chip1 = await findByText("code1: codesystem1 codevalue1");
    expect(chip1).toBeInTheDocument();
    const chip2 = await findByText("code2: codesystem2 codevalue2");
    expect(chip2).toBeInTheDocument();
  });
});
