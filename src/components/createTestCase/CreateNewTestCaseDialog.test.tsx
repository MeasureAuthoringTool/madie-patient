import * as React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { act, Simulate } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import CreateNewTestCaseDialog from "./CreateNewTestCaseDialog";
import { Measure } from "@madie/madie-models";
import axios from "../../api/axios-instance";
import { specialChars } from "../../util/checkSpecialCharacters";

jest.mock("../../api/axios-instance");
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

      const descriptonInput = await getByTestId("create-test-case-description");
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
    const measure: Measure = {
      model: "QDM",
    } as unknown as Measure;
    await act(async () => {
      const { getByRole, getByTestId, getByText, queryByTestId } = await render(
        <CreateNewTestCaseDialog
          open={true}
          onClose={jest.fn()}
          measure={measure}
        />
      );

      const titleInput = await getByTestId("create-test-case-title-input");
      userEvent.type(titleInput, formikInfo.title);
      expect(titleInput.value).toBe(formikInfo.title);
      Simulate.change(titleInput);

      const descriptionInput = await getByTestId(
        "create-test-case-description"
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
        expect(queryByTestId("server-error-alerts")).not.toBeVisible();
      });
    });
  }, 16000);

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
        "create-test-case-description"
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
        const closeErrorButton = screen.findByTestId("close-error-button");
        expect(closeErrorButton).toBeTruthy();
      });
      const closeErrorButton = await getByTestId("close-error-button");
      fireEvent.click(closeErrorButton);
      await waitFor(() => {
        expect(queryByTestId("server-error-alerts")).not.toBeVisible();
      });
    });
  });

  test("should not save test case as input has special characters for QDM measure", async () => {
    const measure: Measure = {
      model: "QDM v5.6",
    } as unknown as Measure;
    await act(async () => {
      const { getByRole, getByTestId, getByText, queryByTestId } = await render(
        <CreateNewTestCaseDialog
          open={true}
          onClose={jest.fn()}
          measure={measure}
        />
      );

      const titleInput = await getByTestId("create-test-case-title-input");
      userEvent.type(titleInput, formikInfo.title);
      expect(titleInput.value).toBe(formikInfo.title);
      fireEvent.change(titleInput, {
        target: { value: "invalid title ~!@#$" },
      });

      const descriptionInput = await getByTestId(
        "create-test-case-description"
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
        const serverErrorAlert = queryByTestId("server-error-alerts");
        expect(serverErrorAlert).toBeVisible();
        expect(serverErrorAlert).toHaveTextContent(
          "Test Case Title can not contain special characters: " + specialChars
        );
      });
    });
  }, 16000);
});
