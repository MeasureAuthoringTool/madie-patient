import * as React from "react";
import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { MemoryRouter } from "react-router-dom";
import EditTestCaseBreadCrumbs from "./EditTestCaseBreadCrumbs";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

const { getByText } = screen;

describe("EditTestCaseBreadCrumbs", () => {
  test("routes to a new route, and navigates back.", async () => {
    render(
      <MemoryRouter>
        <EditTestCaseBreadCrumbs
          testCaseTitle="title"
          testCaseId="4321"
          measureId="unknown"
        />
      </MemoryRouter>
    );
    fireEvent.click(getByText("Test Cases"));
    await waitFor(() => {
      expect(screen.getByText("Test Cases")).toHaveClass("madie-link active");
    });

    fireEvent.click(getByText("title"));
    await waitFor(() => {
      expect(screen.getByText("title")).toHaveClass("madie-link active");
    });
  });
});
