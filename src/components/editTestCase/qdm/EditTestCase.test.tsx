import * as React from "react";
import { render, screen } from "@testing-library/react";
import EditTestCase from "./EditTestCase";
import { Measure } from "@madie/madie-models";
import { MemoryRouter } from "react-router-dom";

let mockApplyDefaults = false;
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
jest.mock("@madie/madie-util", () => {
  return {
    useDocumentTitle: jest.fn(),
    useFeatureFlags: () => {
      return { applyDefaults: mockApplyDefaults };
    },
    measureStore: {
      updateMeasure: jest.fn((measure) => measure),
      state: null,
      initialState: null,
      subscribe: (set) => {
        set({} as Measure);
        return { unsubscribe: () => null };
      },
      unsubscribe: () => null,
    },
    useOktaTokens: jest.fn(() => ({
      getAccessToken: () => "test.jwt",
    })),
    checkUserCanEdit: jest.fn(() => {
      return true;
    }),
    routeHandlerStore: {
      subscribe: (set) => {
        return { unsubscribe: () => null };
      },
      updateRouteHandlerState: () => null,
      state: { canTravel: false, pendingPath: "" },
      initialState: { canTravel: false, pendingPath: "" },
    },
  };
});

describe("EditTestCase QDM Component", () => {
  it("should render qdm edit test case component along with run execution button", async () => {
    render(
      <MemoryRouter>
        <EditTestCase />
      </MemoryRouter>
    );
    const runTestCaseButton = await screen.getByRole("button", {
      name: "Run Test",
    });
    expect(runTestCaseButton).toBeInTheDocument();
  });
});
