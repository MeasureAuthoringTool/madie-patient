import * as React from "react";
import { describe, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Codes from "./Codes";

describe("Codes section", () => {
  const { queryByText, getByTestId } = screen;
  test("Codes section renders with default props", async () => {
    render(<Codes />);
    expect(getByTestId("codes-section")).toBeInTheDocument();
    const codes = await queryByText("Codes section coming soon!");
    expect(codes).toBeInTheDocument();
  });
});
