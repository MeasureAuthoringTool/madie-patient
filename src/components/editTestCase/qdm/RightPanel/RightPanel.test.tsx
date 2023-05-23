import * as React from "react";

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";

import RightPanel from "./RightPanel";
import userEvent from "@testing-library/user-event";

describe("RightPanel", () => {
  test("RightPanel navigation works as expected.", async () => {
    render(
      <RightPanel
        canEdit={true}
        groupPopulations={[]}
        onChange={jest.fn()}
        errors={jest.fn()}
      />
    );
    const highlighting = screen.getByRole("tab", {
      name: "Highlighting tab panel",
    });
    const expectedActual = screen.getByRole("tab", {
      name: "Expected or Actual tab panel",
    });
    const details = screen.getByRole("tab", { name: "Details tab panel" });

    userEvent.click(highlighting);
    await waitFor(() => {
      expect(highlighting).toHaveAttribute("aria-selected", "true");
    });

    userEvent.click(expectedActual);
    await waitFor(() => {
      expect(expectedActual).toHaveAttribute("aria-selected", "true");
    });

    userEvent.click(details);
    await waitFor(() => {
      expect(details).toHaveAttribute("aria-selected", "true");
    });
  });
});
