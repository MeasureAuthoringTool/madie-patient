import * as React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { act, Simulate } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import CreateNewTestCaseDialog from "./CreateNewTestCaseDialog";
import { Measure } from "@madie/madie-models";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const MEASURE_CREATEDBY = "testuser";
jest.mock("@madie/madie-util", () => ({
  useOktaTokens: () => ({
    getAccessToken: () => "test.jwt",
  }),
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
}));

const formikInfo = {
  title: "test case 1",
  description: "test case description",
  series: "test case series",
};

describe("Create New Test Case Dialog", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render all the fields in the test case creation form", async () => {
    await act(async () => {
      const { findByTestId } = await render(
        <CreateNewTestCaseDialog open={true} onClose={undefined} />
      );

      expect(await findByTestId("create-test-case-title")).toBeInTheDocument();
      expect(
        await findByTestId("create-test-case-description")
      ).toBeInTheDocument();
      expect(await findByTestId("test-case-series")).toBeInTheDocument();

      const cancelButton = await findByTestId("create-test-case-cancel-button");
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton).toBeEnabled();

      const saveButton = await findByTestId("create-test-case-save-button");
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeDisabled();
    });
  });

  test("Save button should not be enabled when required field is empty", async () => {
    await act(async () => {
      const { getByTestId } = await render(
        <CreateNewTestCaseDialog open={true} onClose={undefined} />
      );

      const titleInput = await getByTestId("create-test-case-title-input");
      userEvent.type(titleInput, "");
      expect(titleInput.value).toBe("");
      Simulate.change(titleInput);

      const descriptonInput = await getByTestId(
        "create-test-case-description-input"
      );
      userEvent.type(descriptonInput, "");
      expect(descriptonInput.value).toBe("");
      Simulate.change(titleInput);

      expect(getByTestId("create-test-case-save-button")).toBeDisabled();
    });
  });

  test("should save test case inputs as expected", async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        id: "testID",
        createdBy: MEASURE_CREATEDBY,
        description: formikInfo.description,
        title: formikInfo.title,
        series: formikInfo.series,
      },
    });

    await act(async () => {
      const { getByRole, getByTestId, getByText, queryByTestId } = await render(
        <CreateNewTestCaseDialog open={true} onClose={jest.fn()} />
      );

      const titleInput = await getByTestId("create-test-case-title-input");
      userEvent.type(titleInput, formikInfo.title);
      expect(titleInput.value).toBe(formikInfo.title);
      Simulate.change(titleInput);

      const descriptionInput = await getByTestId(
        "create-test-case-description-input"
      );
      userEvent.type(descriptionInput, formikInfo.description);
      expect(descriptionInput.value).toBe(formikInfo.description);
      Simulate.change(descriptionInput);

      screen.debug(undefined, 20000);

      const seriesInput = getByRole("combobox");
      userEvent.type(seriesInput, formikInfo.series);
      const seriesOption = getByText('Add "test case series"');
      expect(
        getByTestId('Add "test case series"-aa-option')
      ).toBeInTheDocument();
      expect(seriesOption).toBeInTheDocument();
      userEvent.click(seriesOption);
      expect(seriesInput).toHaveValue(formikInfo.series);

      const saveButton = await getByTestId("create-test-case-save-button");
      expect(saveButton).not.toBeDisabled();
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(queryByTestId("server-error-alerts")).not.toBeInTheDocument();
      });
    });
  }, 10000);

  test("should render errors when saving test case inputs failed", async () => {
    mockedAxios.post.mockRejectedValue({
      data: {
        error: { message: "server error" },
      },
    });

    await act(async () => {
      const { getByRole, getByTestId, getByText, queryByTestId } = await render(
        <CreateNewTestCaseDialog open={true} onClose={jest.fn()} />
      );

      const titleInput = await getByTestId("create-test-case-title-input");
      userEvent.type(titleInput, formikInfo.title);
      expect(titleInput.value).toBe(formikInfo.title);
      Simulate.change(titleInput);

      const descriptionInput = await getByTestId(
        "create-test-case-description-input"
      );
      userEvent.type(descriptionInput, formikInfo.description);
      expect(descriptionInput.value).toBe(formikInfo.description);
      Simulate.change(descriptionInput);

      const seriesInput = getByRole("combobox");
      userEvent.type(seriesInput, formikInfo.series);
      const seriesOption = getByText('Add "test case series"');
      expect(
        getByTestId('Add "test case series"-aa-option')
      ).toBeInTheDocument();
      expect(seriesOption).toBeInTheDocument();
      userEvent.click(seriesOption);
      expect(seriesInput).toHaveValue(formikInfo.series);

      const saveButton = await getByTestId("create-test-case-save-button");
      expect(saveButton).not.toBeDisabled();
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.findByTestId("server-error-alerts")).toBeTruthy();
        expect(
          screen.findByText(
            "An error occurred while creating the test case: Unable to create new test case"
          )
        ).toBeTruthy();
        expect(screen.findByTestId("close-error-button")).toBeTruthy();
      });
    });
  });
});
