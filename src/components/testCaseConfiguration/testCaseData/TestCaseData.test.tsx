import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ApiContextProvider, ServiceConfig } from "../../../api/ServiceContext";
import { QdmExecutionContextProvider } from "../../routes/qdm/QdmExecutionContext";
import TestCaseData from "./TestCaseData";
import { Measure } from "@madie/madie-models";
// @ts-ignore
import { checkUserCanEdit, measureStore } from "@madie/madie-util";
import userEvent from "@testing-library/user-event";

const mockServiceConfig: ServiceConfig = {
  measureService: { baseUrl: "measure.url" },
  testCaseService: { baseUrl: "testcase.url" },
  terminologyService: { baseUrl: "terminology.url" },
  qdmElmTranslationService: { baseUrl: "qdm-translator.url" },
  fhirElmTranslationService: { baseUrl: "fhir-translator.url" },
  excelExportService: { baseUrl: "excel-export.com" },
};

const measure = {
  id: "m1234",
  measureName: "the measure for testing",
  cqlLibraryName: "TestCqlLibraryName",
  ecqmTitle: "ecqmTitle",
  measurementPeriodStart: "01/01/2022",
  measurementPeriodEnd: "12/02/2022",
  createdBy: "john doe",
  measureSetId: "testMeasureId",
  acls: [{ userId: "othertestuser@example.com", roles: ["SHARED_WITH"] }],
  testCases: [{}],
} as unknown as Measure;

jest.mock("@madie/madie-util", () => ({
  measureStore: {
    updateMeasure: jest.fn((measure) => measure),
    state: jest.fn().mockImplementation(() => measure),
    initialState: jest.fn().mockImplementation(() => measure),
    subscribe: () => {
      return { unsubscribe: () => null };
    },
  },
  routeHandlerStore: {
    subscribe: (set) => {
      set();
      return { unsubscribe: () => null };
    },
    updateRouteHandlerState: () => null,
    state: { canTravel: true, pendingPath: "" },
    initialState: { canTravel: true, pendingPath: "" },
  },
  checkUserCanEdit: jest.fn().mockImplementation(() => true),
  useOktaTokens: () => ({
    getAccessToken: () => "test.jwt",
  }),
}));

const setExecutionContextReady = jest.fn();

function renderTestCaseDataComponent() {
  return render(
    <ApiContextProvider value={mockServiceConfig}>
      <QdmExecutionContextProvider
        value={{
          measureState: [null, jest.fn()],
          cqmMeasureState: [null, jest.fn()],
          executionContextReady: true,
          setExecutionContextReady: setExecutionContextReady,
          executing: false,
          setExecuting: jest.fn(),
          contextFailure: false,
        }}
      >
        <TestCaseData />
      </QdmExecutionContextProvider>
    </ApiContextProvider>
  );
}
describe("TestCaseData", () => {
  it("should render Test Case Data component with action buttons", () => {
    renderTestCaseDataComponent();
    const shiftTestCaseDatesInput = screen.getByRole("spinbutton", {
      name: "Shift Test Case Dates",
    }) as HTMLInputElement;
    const saveButton = screen.getByRole("button", { name: "Save" });
    const discardButton = screen.getByRole("button", {
      name: "Discard Changes",
    });
    expect(shiftTestCaseDatesInput).not.toBeDisabled();
    expect(saveButton).toBeDisabled();
    expect(discardButton).toBeDisabled();

    userEvent.type(shiftTestCaseDatesInput, "3");
    expect(shiftTestCaseDatesInput.value).toBe("3");
    expect(saveButton).toBeEnabled();
    expect(discardButton).toBeEnabled();
  });

  // Unable to stimulate Down Arrow keyboard action
  it.skip("should update the input value by using arrow keys", async () => {
    renderTestCaseDataComponent();

    const shiftTestCaseDatesInput = screen.getByRole("spinbutton", {
      name: "Shift Test Case Dates",
    }) as HTMLInputElement;
    const saveButton = screen.getByRole("button", { name: "Save" });
    const discardButton = screen.getByRole("button", {
      name: "Discard Changes",
    });
    expect(shiftTestCaseDatesInput).not.toBeDisabled();
    expect(saveButton).toBeDisabled();
    expect(discardButton).toBeDisabled();

    // shiftTestCaseDatesInput.focus();
    // userEvent.keyboard("{ArrowDown}");
    // Simulate.keyDown(shiftTestCaseDatesInput, {
    //   key: "ArrowDown",
    //   // code: "ArrowDown",
    //   // keyCode: 40,
    // });
    // userEvent.keyboard("{arrowdown}");
    userEvent.type(shiftTestCaseDatesInput, "3");
    // await fireEvent.keyPress(shiftTestCaseDatesInput, { key: "ArrowDown" });
    expect(shiftTestCaseDatesInput.value).toBe("-1");
    expect(saveButton).toBeEnabled();
    expect(discardButton).toBeEnabled();
  });

  it("should allow negative numbers to be entered", () => {
    renderTestCaseDataComponent();
    const shiftTestCaseDatesInput = screen.getByRole("spinbutton", {
      name: "Shift Test Case Dates",
    }) as HTMLInputElement;
    const saveButton = screen.getByRole("button", { name: "Save" });
    const discardButton = screen.getByRole("button", {
      name: "Discard Changes",
    });
    expect(shiftTestCaseDatesInput).not.toBeDisabled();
    expect(saveButton).toBeDisabled();
    expect(discardButton).toBeDisabled();

    userEvent.type(shiftTestCaseDatesInput, "-3");
    expect(shiftTestCaseDatesInput.value).toBe("-3");
    expect(saveButton).toBeEnabled();
    expect(discardButton).toBeEnabled();
  });

  it("should display error message when a invalid integer is entered", async () => {
    renderTestCaseDataComponent();
    const shiftTestCaseDatesInput = screen.getByRole("spinbutton", {
      name: "Shift Test Case Dates",
    }) as HTMLInputElement;
    const saveButton = screen.getByRole("button", { name: "Save" });
    const discardButton = screen.getByRole("button", {
      name: "Discard Changes",
    });
    expect(shiftTestCaseDatesInput).not.toBeDisabled();
    expect(saveButton).toBeDisabled();
    expect(discardButton).toBeDisabled();

    userEvent.type(shiftTestCaseDatesInput, "-3-5");
    expect(shiftTestCaseDatesInput.value).toBe("");
    expect(saveButton).not.toBeEnabled();
    expect(discardButton).not.toBeEnabled();
    userEvent.tab();
    expect(
      await screen.findByTestId(
        "integer-field-shift-test-case-dates-helper-text"
      )
    ).toHaveTextContent("Must be a valid number of years");
  });

  it("should display discard dialog and clear out form when confirmed", () => {
    renderTestCaseDataComponent();
    const shiftTestCaseDatesInput = screen.getByRole("spinbutton", {
      name: "Shift Test Case Dates",
    }) as HTMLInputElement;
    const saveButton = screen.getByRole("button", { name: "Save" });
    const discardButton = screen.getByRole("button", {
      name: "Discard Changes",
    });
    expect(shiftTestCaseDatesInput).not.toBeDisabled();
    expect(saveButton).toBeDisabled();
    expect(discardButton).toBeDisabled();

    userEvent.type(shiftTestCaseDatesInput, "5");

    expect(shiftTestCaseDatesInput.value).toBe("5");
    expect(saveButton).toBeEnabled();
    expect(discardButton).toBeEnabled();

    userEvent.click(discardButton);

    const YesDiscardButton = screen.getByRole("button", {
      name: "Yes, Discard All Changes",
    });

    userEvent.click(YesDiscardButton);
    expect(shiftTestCaseDatesInput.value).toBe("");
  });

  it("should display discard dialog and does not clear out form when denied", () => {
    renderTestCaseDataComponent();
    const shiftTestCaseDatesInput = screen.getByRole("spinbutton", {
      name: "Shift Test Case Dates",
    }) as HTMLInputElement;
    const saveButton = screen.getByRole("button", { name: "Save" });
    const discardButton = screen.getByRole("button", {
      name: "Discard Changes",
    });
    expect(shiftTestCaseDatesInput).not.toBeDisabled();
    expect(saveButton).toBeDisabled();
    expect(discardButton).toBeDisabled();

    userEvent.type(shiftTestCaseDatesInput, "5");

    expect(shiftTestCaseDatesInput.value).toBe("5");
    expect(saveButton).toBeEnabled();
    expect(discardButton).toBeEnabled();

    userEvent.click(discardButton);

    const CancelDiscardButton = screen.getByRole("button", {
      name: "No, Keep Working",
    });

    userEvent.click(CancelDiscardButton);
    expect(shiftTestCaseDatesInput.value).toBe("5");
  });

  it("should display disabled state of the form when user doesn't have authorization to edit", () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => {
      return false;
    });
    renderTestCaseDataComponent();
    const shiftTestCaseDatesInput = screen.getByRole("spinbutton", {
      name: "Shift Test Case Dates",
    }) as HTMLInputElement;
    const saveButton = screen.getByRole("button", { name: "Save" });
    const discardButton = screen.getByRole("button", {
      name: "Discard Changes",
    });
    expect(shiftTestCaseDatesInput).toBeDisabled();
    expect(saveButton).toBeDisabled();
    expect(discardButton).toBeDisabled();
  });

  it("should display disabled state when no patient are found for the measure", () => {
    measureStore.state.mockImplementation(() => {
      return {
        ...measure,
        testCases: [],
      };
    });
    renderTestCaseDataComponent();
    const shiftTestCaseDatesInput = screen.getByRole("spinbutton", {
      name: "Shift Test Case Dates",
    }) as HTMLInputElement;
    const saveButton = screen.getByRole("button", { name: "Save" });
    const discardButton = screen.getByRole("button", {
      name: "Discard Changes",
    });
    expect(shiftTestCaseDatesInput).toBeDisabled();
    expect(saveButton).toBeDisabled();
    expect(discardButton).toBeDisabled();
  });

  it("should successfully update the test case dates and saves the measure", () => {});

  it("should display an error message when unable to shift test case dates", () => {});
});