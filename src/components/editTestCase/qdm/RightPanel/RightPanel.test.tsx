import React from "react";

import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

import RightPanel from "./RightPanel";

describe("RightPanel", () => {
  const { findByText } = screen;
  test("RightPanel navigation works as expected.", async () => {
    render(<RightPanel />);
    const highlighting = await findByText("Highlighting");
    const expectedActual = await findByText("Expected / Actual");
    const details = await findByText("Details");

    act(() => {
      fireEvent.click(highlighting);
    });
    await waitFor(() => {
      expect(highlighting).toHaveAttribute("aria-selected", "true");
    });

    act(() => {
      fireEvent.click(expectedActual);
    });
    await waitFor(() => {
      expect(expectedActual).toHaveAttribute("aria-selected", "true");
    });

    act(() => {
      fireEvent.click(details);
    });
    await waitFor(() => {
      expect(details).toHaveAttribute("aria-selected", "true");
    });
  });
});
