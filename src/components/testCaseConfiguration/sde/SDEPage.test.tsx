import * as React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import SDEPage from "./SDEPage";
import { Measure } from "@madie/madie-models";
import userEvent from "@testing-library/user-event";
import useMeasureServiceApi, {
  MeasureServiceApi,
} from "../../../api/useMeasureServiceApi";
import { MemoryRouter } from "react-router-dom";
import { ApiContextProvider, ServiceConfig } from "../../../api/ServiceContext";
import { QdmExecutionContextProvider } from "../../routes/qdm/QdmExecutionContext";
import TestCaseLandingWrapper from "../../testCaseLanding/common/TestCaseLandingWrapper";

const measure = {
  id: "test measure",
  measureName: "the measure for testing",
  cqlLibraryName: "TestCqlLibraryName",
  ecqmTitle: "ecqmTitle",
  measurementPeriodStart: "01/01/2022",
  measurementPeriodEnd: "12/02/2022",
  createdBy: "john doe",
  measureSetId: "testMeasureId",
  acls: [{ userId: "othertestuser@example.com", roles: ["SHARED_WITH"] }], //#nosec
} as unknown as Measure;

jest.mock("../../../api/useMeasureServiceApi");
const useMeasureServiceApiMock =
  useMeasureServiceApi as jest.Mock<MeasureServiceApi>;
let serviceApiMock: MeasureServiceApi;

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
  useFeatureFlags: jest.fn(() => {
    return {
      applyDefaults: false,
      disableRunTestCaseWithObservStrat: true,
      qdmHideJson: false,
      qdmHighlightingTabs: true,
    };
  }),
}));

const serviceConfig: ServiceConfig = {
  measureService: {
    baseUrl: "measureService.url",
  },
  testCaseService: {
    baseUrl: "testCaseService.url",
  },
  terminologyService: {
    baseUrl: "terminologyService.url",
  },
  elmTranslationService: {
    baseUrl: "elmTranslationService.url",
  },
};

const setExecutionContextReady = jest.fn();
function renderSdePageComponent() {
  return render(
    <MemoryRouter>
      <ApiContextProvider value={serviceConfig}>
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
          <TestCaseLandingWrapper qdm children={<SDEPage />} />
        </QdmExecutionContextProvider>
      </ApiContextProvider>
    </MemoryRouter>
  );
}

describe("SDEPage component", () => {
  const { getByTestId, findByTestId, getByText, getByLabelText } = screen;

  test("Changes to Test Case Configuration enables Save button and saving successfully displays success message", async () => {
    serviceApiMock = {
      updateMeasure: jest.fn().mockResolvedValueOnce({ status: 200 }),
    } as unknown as MeasureServiceApi;
    useMeasureServiceApiMock.mockImplementation(() => serviceApiMock);

    renderSdePageComponent();

    userEvent.click(getByLabelText("Yes"));

    const saveButton = getByTestId("sde-save");
    expect(saveButton).toBeInTheDocument();
    await waitFor(() => expect(saveButton).toBeEnabled());
    fireEvent.click(saveButton);
    await waitFor(() =>
      expect(serviceApiMock.updateMeasure).toBeCalledWith({
        ...measure,
        testCaseConfiguration: {
          sdeIncluded: true,
        },
      })
    );

    expect(
      getByText("Test Case Configuration Updated Successfully")
    ).toBeInTheDocument();

    const toastCloseButton = await findByTestId("close-error-button");
    expect(toastCloseButton).toBeInTheDocument();
    fireEvent.click(toastCloseButton);
    await waitFor(() => {
      expect(toastCloseButton).not.toBeInTheDocument();
    });
  });

  test("Change of Test Configuration enables Discard button and click Discard resets the form", async () => {
    renderSdePageComponent();

    const sdeOptionYes = screen.getByRole("radio", { name: "Yes" });
    const sdeOptionNo = screen.getByRole("radio", { name: "No" });
    userEvent.click(getByLabelText("Yes"));

    const cancelButton = getByTestId("cancel-button");
    expect(cancelButton).toBeInTheDocument();
    await waitFor(() => expect(cancelButton).toBeEnabled());
    act(() => {
      fireEvent.click(cancelButton);
    });

    const discardDialog = getByTestId("discard-dialog");
    expect(discardDialog).toBeInTheDocument();
    const continueButton = getByTestId("discard-dialog-continue-button");
    expect(continueButton).toBeInTheDocument();
    fireEvent.click(continueButton);
    await waitFor(() => {
      expect(sdeOptionYes).not.toBeChecked();
      expect(sdeOptionNo).toBeChecked();
    });
  });

  test("Discard change then click Keep Working", async () => {
    renderSdePageComponent();

    const sdeOptionYes = screen.getByRole("radio", { name: "Yes" });
    const sdeOptionNo = screen.getByRole("radio", { name: "No" });
    userEvent.click(getByLabelText("Yes"));

    const cancelButton = getByTestId("cancel-button");
    expect(cancelButton).toBeInTheDocument();
    await waitFor(() => expect(cancelButton).toBeEnabled());
    act(() => {
      fireEvent.click(cancelButton);
    });

    const discardDialog = getByTestId("discard-dialog");
    expect(discardDialog).toBeInTheDocument();
    const discardCancelButton = getByTestId("discard-dialog-cancel-button");
    expect(discardCancelButton).toBeInTheDocument();
    fireEvent.click(discardCancelButton);
    await waitFor(() => {
      expect(sdeOptionYes).toBeChecked();
      expect(sdeOptionNo).not.toBeChecked();
    });
  });
});
