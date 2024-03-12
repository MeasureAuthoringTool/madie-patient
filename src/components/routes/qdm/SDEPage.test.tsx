import * as React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  within,
  getByRole,
} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import SDEPage from "./SDEPage";
import useMeasureServiceApi, {
  MeasureServiceApi,
} from "../../../api/useMeasureServiceApi";
import { Measure } from "@madie/madie-models";
import userEvent from "@testing-library/user-event";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock("../../../api/useMeasureServiceApi");
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

jest.mock("@madie/madie-editor", () => ({
  synchingEditorCqlContent: jest.fn().mockResolvedValue("modified cql"),
  parseContent: jest.fn(() => []),
  validateContent: jest.fn().mockResolvedValue({
    errors: [],
    translation: { library: "NewLibName" },
  }),
}));

jest.mock("@madie/madie-util", () => ({
  useOktaTokens: jest.fn(() => ({
    getAccessToken: () => "test.jwt",
  })),
  useKeyPress: jest.fn(() => false),
  measureStore: {
    updateMeasure: jest.fn(),
    state: measure,
    initialState: jest.fn(),
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

  checkUserCanEdit: jest.fn(() => {
    return true;
  }),
}));

const useMeasureServiceApiMock =
  useMeasureServiceApi as jest.Mock<MeasureServiceApi>;

let serviceApiMock: MeasureServiceApi;

describe("SDEPage component", () => {
  const {
    getByTestId,
    findByTestId,
    findAllByTestId,
    getByText,
    getByLabelText,
  } = screen;

  test("Changes to Test Case Configuration enables Save button and saving successfully displays success message", async () => {
    serviceApiMock = {
      updateMeasure: jest.fn().mockResolvedValueOnce({ status: 200 }),
    } as unknown as MeasureServiceApi;
    useMeasureServiceApiMock.mockImplementation(() => serviceApiMock);

    render(<SDEPage />);

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
      await getByText("Test Case Configuration Updated Successfully")
    ).toBeInTheDocument();

    const toastCloseButton = await findByTestId("close-error-button");
    expect(toastCloseButton).toBeInTheDocument();
    fireEvent.click(toastCloseButton);
    await waitFor(() => {
      expect(toastCloseButton).not.toBeInTheDocument();
    });
  });

  test("Change of Test Configuration enables Discard button and click Discard resets the form", async () => {
    const { getByRole } = render(<SDEPage />);

    const sdeOptionYes = getByRole("radio", { name: "Yes" });
    const sdeOptionNo = getByRole("radio", { name: "No" });
    userEvent.click(getByLabelText("Yes"));

    const cancelButton = getByTestId("cancel-button");
    expect(cancelButton).toBeInTheDocument();
    await waitFor(() => expect(cancelButton).toBeEnabled());
    act(() => {
      fireEvent.click(cancelButton);
    });

    const discardDialog = await getByTestId("discard-dialog");
    expect(discardDialog).toBeInTheDocument();
    const continueButton = await getByTestId("discard-dialog-continue-button");
    expect(continueButton).toBeInTheDocument();
    fireEvent.click(continueButton);
    await waitFor(() => {
      expect(sdeOptionYes).not.toBeChecked();
      expect(sdeOptionNo).toBeChecked();
    });
  });

  test("Discard change then click Keep Working", async () => {
    const { getByRole } = render(<SDEPage />);

    const sdeOptionYes = getByRole("radio", { name: "Yes" });
    const sdeOptionNo = getByRole("radio", { name: "No" });
    userEvent.click(getByLabelText("Yes"));

    const cancelButton = getByTestId("cancel-button");
    expect(cancelButton).toBeInTheDocument();
    await waitFor(() => expect(cancelButton).toBeEnabled());
    act(() => {
      fireEvent.click(cancelButton);
    });

    const discardDialog = await getByTestId("discard-dialog");
    expect(discardDialog).toBeInTheDocument();
    const discardCancelButton = await getByTestId(
      "discard-dialog-cancel-button"
    );
    expect(discardCancelButton).toBeInTheDocument();
    fireEvent.click(discardCancelButton);
    await waitFor(() => {
      expect(sdeOptionYes).toBeChecked();
      expect(sdeOptionNo).not.toBeChecked();
    });
  });
});
