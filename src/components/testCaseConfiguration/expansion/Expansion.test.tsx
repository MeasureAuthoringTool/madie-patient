import * as React from "react";
import { screen, render, waitFor } from "@testing-library/react";
import { Measure } from "@madie/madie-models";
import userEvent from "@testing-library/user-event";
import useMeasureServiceApi, {
  MeasureServiceApi,
} from "../../../api/useMeasureServiceApi";
// @ts-ignore
import { checkUserCanEdit, measureStore } from "@madie/madie-util";
import Expansion from "./Expansion";
import { QdmExecutionContextProvider } from "../../routes/qdm/QdmExecutionContext";
import { ApiContextProvider, ServiceConfig } from "../../../api/ServiceContext";
import axios from "axios";

const mockServiceConfig: ServiceConfig = {
  measureService: { baseUrl: "measure.url" },
  testCaseService: { baseUrl: "testcase.url" },
  terminologyService: { baseUrl: "terminology.url" },
  elmTranslationService: { baseUrl: "translator.url" },
  excelExportService: {
    baseUrl: "excelexport.com",
  },
};

const mockManifestList = [
  {
    fullUrl:
      "https://cts.nlm.nih.gov/fhir/Library/cms-pre-rulemaking-ecqm-2019-08-30",
    id: "cms-pre-rulemaking-ecqm-2019-08-30",
  },
  {
    fullUrl: "https://cts.nlm.nih.gov/fhir/Library/mu2-update-2012-10-25",
    id: "mu2-update-2012-10-25",
  },
  {
    fullUrl: "https://cts.nlm.nih.gov/fhir/Library/mu2-update-2012-12-21",
    id: "mu2-update-2012-12-21",
  },
];

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
} as unknown as Measure;

const measureWithTestCaseConfiguration = {
  ...measure,
  testCaseConfiguration: {
    id: "test-case-config-id",
    sdeIncluded: false,
    manifestExpansion: {
      fullUrl: "https://cts.nlm.nih.gov/fhir/Library/ecqm-update-4q2017-eh",
      id: "ecqm-update-4q2017-eh",
    },
  },
};

jest.mock("../../../api/useMeasureServiceApi");
const useMeasureServiceApiMock =
  useMeasureServiceApi as jest.Mock<MeasureServiceApi>;
const measureServiceApiMock = {
  updateMeasure: jest.fn().mockResolvedValue({ status: 200, data: measure }),
} as unknown as MeasureServiceApi;
useMeasureServiceApiMock.mockImplementation(() => measureServiceApiMock);

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

function renderExpansionComponent() {
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
        <Expansion />
      </QdmExecutionContextProvider>
    </ApiContextProvider>
  );
}

describe("Expansion component", () => {
  it("Should display radio buttons for expansion type selection and display manifest dropdown as needed", async () => {
    mockedAxios.get.mockImplementation((args) => {
      if (
        args &&
        args.startsWith(mockServiceConfig.terminologyService.baseUrl)
      ) {
        return Promise.resolve({
          data: mockManifestList,
          status: 200,
        });
      }
    });
    renderExpansionComponent();

    const latestRadioInput = screen.getByLabelText(
      "Latest"
    ) as HTMLInputElement;
    const manifestRadioInput = screen.getByLabelText(
      "Manifest"
    ) as HTMLInputElement;

    // Verify default selection
    expect(latestRadioInput).toBeChecked();
    expect(manifestRadioInput).not.toBeChecked();

    const saveButton = screen.getByRole("button", { name: "Save" });
    const discardButton = screen.getByRole("button", {
      name: "Discard Changes",
    });
    expect(saveButton).toBeDisabled();
    expect(discardButton).toBeDisabled();

    // Update form
    userEvent.click(manifestRadioInput);
    const manifestSelectWrapperDiv = await screen.findByTestId(
      "manifest-select"
    );
    const manifestSelect = manifestSelectWrapperDiv.children[0];
    userEvent.click(manifestSelect);
    const manifestOptions = screen.getAllByRole("option");
    expect(manifestOptions).toHaveLength(3);
    userEvent.click(manifestOptions[0]);
    await waitFor(() => {
      const manifestSelectInput = screen.getByTestId("manifest-select-input");
      expect(manifestSelectInput).toHaveValue(
        "cms-pre-rulemaking-ecqm-2019-08-30"
      );
      expect(saveButton).toBeEnabled();
      userEvent.click(saveButton);
    });
    expect(
      screen.getByTestId("manifest-expansion-success-text")
    ).toHaveTextContent("Expansion details Updated Successfully");
    expect(measureServiceApiMock.updateMeasure).toHaveBeenCalledWith({
      ...measure,
      testCaseConfiguration: {
        manifestExpansion: {
          fullUrl:
            "https://cts.nlm.nih.gov/fhir/Library/cms-pre-rulemaking-ecqm-2019-08-30",
          id: "cms-pre-rulemaking-ecqm-2019-08-30",
        },
      },
    });
  });

  it("Should throw a toast error when we are unable to fetch manifest list from service", async () => {
    mockedAxios.get.mockImplementation((args) => {
      if (
        args &&
        args.startsWith(mockServiceConfig.terminologyService.baseUrl)
      ) {
        return Promise.reject({
          response: {
            data: {
              message:
                "401 Unauthorized from GET https://uat-cts.nlm.nih.gov/fhir/Library",
            },
            status: 401,
          },
        });
      }
    });
    renderExpansionComponent();

    const latestRadioInput = screen.getByLabelText(
      "Latest"
    ) as HTMLInputElement;
    const manifestRadioInput = screen.getByLabelText(
      "Manifest"
    ) as HTMLInputElement;

    // Verify default selection
    expect(latestRadioInput).toBeChecked();
    expect(manifestRadioInput).not.toBeChecked();

    const saveButton = screen.getByRole("button", { name: "Save" });
    const discardButton = screen.getByRole("button", {
      name: "Discard Changes",
    });
    expect(saveButton).toBeDisabled();
    expect(discardButton).toBeDisabled();

    // Update form
    userEvent.click(manifestRadioInput);
    expect(
      await screen.findByTestId("manifest-expansion-generic-error-text")
    ).toHaveTextContent(
      "Error fetching Manifest options : 401 Unauthorized from GET https://uat-cts.nlm.nih.gov/fhir/Library"
    );
  });

  it("Should display previously selected values from measure store", () => {
    measureStore.state.mockImplementation(
      () => measureWithTestCaseConfiguration
    );

    renderExpansionComponent();
    const latestRadioInput = screen.getByLabelText(
      "Latest"
    ) as HTMLInputElement;
    const manifestRadioInput = screen.getByLabelText(
      "Manifest"
    ) as HTMLInputElement;

    expect(latestRadioInput).not.toBeChecked();
    expect(manifestRadioInput).toBeChecked();

    const manifestSelectInput = screen.getByTestId("manifest-select-input");
    expect(manifestSelectInput).toHaveValue("ecqm-update-4q2017-eh");
  });

  it("Should discard changes", async () => {
    measureStore.state.mockImplementation(() => measure);
    renderExpansionComponent();

    const latestRadioInput = screen.getByLabelText(
      "Latest"
    ) as HTMLInputElement;
    const manifestRadioInput = screen.getByLabelText(
      "Manifest"
    ) as HTMLInputElement;

    // Verify default selection
    expect(latestRadioInput).toBeChecked();
    expect(manifestRadioInput).not.toBeChecked();

    const saveButton = screen.getByRole("button", { name: "Save" });
    const discardButton = screen.getByRole("button", {
      name: "Discard Changes",
    });
    expect(saveButton).toBeDisabled();
    expect(discardButton).toBeDisabled();

    // Update form
    userEvent.click(manifestRadioInput);
    const manifestSelect = await screen.findByTestId("manifest-select");
    expect(manifestSelect).toBeInTheDocument();

    expect(latestRadioInput).not.toBeChecked();
    expect(manifestRadioInput).toBeChecked();

    // Save button is still disabled because custom expansion is not selected
    expect(saveButton).toBeDisabled();
    expect(discardButton).toBeEnabled();
    userEvent.click(discardButton);
    const continueButtonInDiscardDialog = await screen.findByRole("button", {
      name: "Yes, Discard All Changes",
    });
    userEvent.click(continueButtonInDiscardDialog);

    // radio group input selection reverted
    expect(latestRadioInput).toBeChecked();
    expect(manifestRadioInput).not.toBeChecked();
    expect(saveButton).toBeDisabled();
    expect(discardButton).toBeDisabled();
  });

  it("Should display input fields and action buttons for a non-owner but the form is disabled", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => {
      return false;
    });
    measureStore.state.mockImplementation(
      () => measureWithTestCaseConfiguration
    );
    renderExpansionComponent();

    const latestRadioInput = screen.getByLabelText(
      "Latest"
    ) as HTMLInputElement;
    const manifestRadioInput = screen.getByLabelText(
      "Manifest"
    ) as HTMLInputElement;

    expect(latestRadioInput).not.toBeChecked();
    expect(latestRadioInput).toBeDisabled();
    expect(manifestRadioInput).toBeChecked();
    expect(manifestRadioInput).toBeDisabled();
    expect(screen.getByTestId("manifest-select-input")).toBeDisabled();

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(
      screen.getByRole("button", {
        name: "Discard Changes",
      })
    ).toBeDisabled();
  });
});
