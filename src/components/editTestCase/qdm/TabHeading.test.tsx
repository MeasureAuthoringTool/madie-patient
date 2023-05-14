import * as React from "react";
import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import TabHeading from "./TabHeading";

const { findByText, findByTestId } = screen;

describe("TabHeadings", () => {
  test("TabHeading does in fact exist with specified text", async () => {
    const title = "FakeTitle";
    render(<TabHeading title={title} />);
    const foundTitle = await findByText(title);
    expect(foundTitle).toBeInTheDocument();
  });
  test("Tab Headings display descriptions when clicked on, hides after", async () => {
    const title = "evenMoreFakeTitle";
    const expectedId = `qdm-header-content-${title}`;
    render(<TabHeading title={title} />);
    const foundTitle = await findByText(title);
    // open
    expect(foundTitle).toBeInTheDocument();
    act(() => {
      fireEvent.click(foundTitle);
    });
    const foundBody = await findByTestId(expectedId);
    expect(foundBody).toBeInTheDocument();
    // close
    act(() => {
      fireEvent.click(foundTitle);
    });
    expect(foundBody).not.toBeInTheDocument();
  });
});
