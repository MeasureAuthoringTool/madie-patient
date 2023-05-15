import React from "react";
import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

import LeftPanel from "./LeftPanel";

describe("LeftPanel", () => {
  const { findByTestId, findByText } = screen;
  test("LeftPanel navigation works as expected.", async () => {
    await render(<LeftPanel />);
    const json = await findByText("JSON");
    // const elements = await findByText("Elements"); // this doesn't work?
    const elements = await findByTestId("json-tab");

    act(() => {
      fireEvent.click(elements);
    });
    await waitFor(() => {
      expect(elements).toHaveAttribute("aria-selected", "true");
    });

    act(() => {
      fireEvent.click(json);
    });
    await waitFor(() => {
      expect(json).toHaveAttribute("aria-selected", "true");
    });
  });
});
