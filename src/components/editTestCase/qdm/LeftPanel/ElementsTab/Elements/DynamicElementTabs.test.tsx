import * as React from "react";
import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import DynamicElementsTabs from "./DynamicElementTabs";

const testCategories = [
  "adverse_event",
  "allergy",
  "assessment",
  "condition",
  "device",
  "diagnostic_study",
  "encounter",
  "patient_characteristic",
];

const mockSetActiveTab = jest.fn();

describe("DynamicElementsTabs component", () => {
  test("should render DynamicElementsTabs", () => {
    render(
      <DynamicElementsTabs
        categories={testCategories}
        activeTab={"adverse_event"}
        setActiveTab={mockSetActiveTab}
      />
    );

    expect(
      screen.getByTestId("elements-tab-adverse_event")
    ).toBeInTheDocument();
    expect(screen.getByTestId("elements-tab-allergy")).toBeInTheDocument();
    expect(screen.getByTestId("elements-tab-assessment")).toBeInTheDocument();
    expect(screen.getByTestId("elements-tab-condition")).toBeInTheDocument();
    expect(
      screen.getByTestId("elements-tab-diagnostic_study")
    ).toBeInTheDocument();
    expect(screen.getByTestId("elements-tab-encounter")).toBeInTheDocument();
    expect(
      screen.getByTestId("elements-tab-patient_characteristic")
    ).toBeInTheDocument();
  });

  test("should display active tab and data type", () => {
    render(
      <DynamicElementsTabs
        categories={testCategories}
        activeTab={"adverse_event"}
        setActiveTab={mockSetActiveTab}
      />
    );
    const adverseEventTab = screen.getByTestId("elements-tab-adverse_event");
    expect(adverseEventTab).toBeInTheDocument();
    expect(adverseEventTab).toHaveAttribute("aria-selected", "true");
  });
});
