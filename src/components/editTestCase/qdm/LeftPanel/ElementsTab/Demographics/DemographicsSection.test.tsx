import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DemographicsSection from "./DemographicsSection";
import { FormikProvider, FormikContextType } from "formik";
import {
  PatientActionType,
  useQdmPatient,
} from "../../../../../../util/QdmPatientContext";
import {
  QDMPatient,
  PatientCharacteristicEthnicity,
  PatientCharacteristicExpired,
  DataElementCode,
} from "cqm-models";

const emptyPatient = new QDMPatient();
jest.mock("../../../../../../util/QdmPatientContext", () => ({
  useQdmPatient: jest.fn(),
  PatientActionType: jest.requireActual(
    "../../../../../../util/QdmPatientContext"
  ).PatientActionType,
}));

const testCaseJson = {
  qdmVersion: "5.6",
  dataElements: [],
  _id: "64b979eacfaef90000434099",
  birthDatetime: "2023-01-31T19:16:21.063+00:00",
};

//@ts-ignore
const mockFormik: FormikContextType<any> = {
  values: {
    json: JSON.stringify(testCaseJson),
  },
  setFieldValue: jest.fn(),
};

const mockUseQdmPatientDispatch = jest.fn();

describe("DemographicsSection", () => {
  beforeEach(() => {
    mockUseQdmPatientDispatch.mockClear();
    (useQdmPatient as jest.Mock).mockImplementation(() => ({
      state: { patient: emptyPatient },
      dispatch: mockUseQdmPatientDispatch,
    }));
  });

  it("should handle birth date time change", async () => {
    render(
      <FormikProvider value={mockFormik}>
        <DemographicsSection canEdit={true} />
      </FormikProvider>
    );

    expect(screen.getByText("Date of Birth")).toBeInTheDocument();

    const birthdateTimeInputs = screen.getAllByLabelText(
      "Date of Birth"
    ) as HTMLInputElement[];
    expect(birthdateTimeInputs.length).toBe(1);

    fireEvent.change(birthdateTimeInputs[0], {
      target: { value: "08/02/2023 11:00 AM" },
    });
    expect(birthdateTimeInputs[0].value).toBe("08/02/2023 11:00 AM");
    await waitFor(() => {
      expect(mockUseQdmPatientDispatch).toHaveBeenLastCalledWith({
        type: PatientActionType.SET_BIRTHDATETIME,
        payload: expect.anything(),
      });
    });
  });

  it("should handle expired date time change", async () => {
    render(
      <FormikProvider value={mockFormik}>
        <DemographicsSection canEdit={true} />
      </FormikProvider>
    );

    expect(screen.getByText("Living Status")).toBeInTheDocument();
    const livingStatusInput = screen.getByTestId(
      "demographics-living-status-input"
    ) as HTMLInputElement;
    expect(livingStatusInput).toBeInTheDocument();
    expect(livingStatusInput.value).toBe("Living");

    fireEvent.change(livingStatusInput, {
      target: { value: "Expired" },
    });
    expect(livingStatusInput.value).toBe("Expired");

    expect(screen.getByText("Date/Time Expiration")).toBeInTheDocument();

    const dateTimeExpiration = screen.getAllByLabelText(
      "Date/Time Expiration"
    ) as HTMLInputElement[];
    expect(dateTimeExpiration.length).toBe(1);
    // start date
    fireEvent.change(dateTimeExpiration[0], {
      target: { value: "08/02/2023 07:49 AM" },
    });

    expect(dateTimeExpiration[0].value).toBe("08/02/2023 07:49 AM");
  });

  it("should handle Living Status change", () => {
    render(
      <FormikProvider value={mockFormik}>
        <DemographicsSection canEdit={true} />
      </FormikProvider>
    );

    expect(screen.getByText("Living Status")).toBeInTheDocument();
    const livingStatusInput = screen.getByTestId(
      "demographics-living-status-input"
    ) as HTMLInputElement;
    expect(livingStatusInput).toBeInTheDocument();
    expect(livingStatusInput.value).toBe("Living");

    fireEvent.change(livingStatusInput, {
      target: { value: "Expired" },
    });
    expect(livingStatusInput.value).toBe("Expired");

    fireEvent.change(livingStatusInput, {
      target: { value: "Living" },
    });
    expect(livingStatusInput.value).toBe("Living");
  });

  it("should handle Ethnicity change", () => {
    const qdmPatient = new QDMPatient();
    const ethnicityElement = new PatientCharacteristicEthnicity();
    const newCode: DataElementCode = {
      code: "2135-2",
      display: "Hispanic or Latino",
      version: "1.2",
      system: "2.16.840.1.113883.6.238",
    };
    ethnicityElement.dataElementCodes = [newCode];
    qdmPatient.dataElements.push(ethnicityElement);
    (useQdmPatient as jest.Mock).mockImplementation(() => ({
      state: { patient: qdmPatient },
      dispatch: mockUseQdmPatientDispatch,
    }));
    render(
      <FormikProvider value={mockFormik}>
        <DemographicsSection canEdit={true} />
      </FormikProvider>
    );

    expect(screen.getByText("Ethnicity")).toBeInTheDocument();
    const ethnicityInput = screen.getByTestId(
      "demographics-ethnicity-input"
    ) as HTMLInputElement;
    expect(ethnicityInput).toBeInTheDocument();
    expect(ethnicityInput.value).toBe("Hispanic or Latino");

    fireEvent.change(ethnicityInput, {
      target: { value: "Not Hispanic or Latino" },
    });
    expect(ethnicityInput.value).toBe("Not Hispanic or Latino");
  });

  it("should render expired on load", async () => {
    const qdmPatient = new QDMPatient();
    const expiredElement = new PatientCharacteristicExpired();
    expiredElement.dataElementCodes = [];
    qdmPatient.dataElements.push(expiredElement);
    (useQdmPatient as jest.Mock).mockImplementation(() => ({
      state: { patient: qdmPatient },
      dispatch: mockUseQdmPatientDispatch,
    }));
    render(
      <FormikProvider value={mockFormik}>
        <DemographicsSection canEdit={true} />
      </FormikProvider>
    );

    expect(screen.getByText("Living Status")).toBeInTheDocument();
    const livingStatusInput = screen.getByTestId(
      "demographics-living-status-input"
    ) as HTMLInputElement;
    expect(livingStatusInput).toBeInTheDocument();
    expect(livingStatusInput.value).toBe("Expired");

    fireEvent.change(livingStatusInput, {
      target: { value: "Living" },
    });
    expect(livingStatusInput.value).toBe("Living");
    await waitFor(() => {
      expect(mockUseQdmPatientDispatch).toHaveBeenCalledWith({
        type: PatientActionType.REMOVE_DATA_ELEMENT,
        payload: expect.anything(),
      });
    });
  });
});
