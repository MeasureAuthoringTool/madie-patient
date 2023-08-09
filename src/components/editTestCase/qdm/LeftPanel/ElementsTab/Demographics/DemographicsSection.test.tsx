import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DemographicsSection from "./DemographicsSection";
import { FormikProvider, FormikContextType } from "formik";

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

describe("DemographicsSection", () => {
  it("should handle birth date time change", () => {
    render(
      <FormikProvider value={mockFormik}>
        <DemographicsSection canEdit={true} />
      </FormikProvider>
    );

    expect(screen.getByText("Date of Birth")).toBeInTheDocument();

    const birthdateInputs = screen.getAllByPlaceholderText(
      "MM/DD/YYYY"
    ) as HTMLInputElement[];
    expect(birthdateInputs.length).toBe(1);
    const birthtimeInputs = screen.getAllByPlaceholderText(
      "hh:mm aa"
    ) as HTMLInputElement[];
    expect(birthtimeInputs.length).toBe(1);

    fireEvent.change(birthdateInputs[0], {
      target: { value: "08/02/2023" },
    });
    expect(birthdateInputs[0].value).toBe("08/02/2023");

    fireEvent.change(birthtimeInputs[0], {
      target: { value: "02:24 PM" },
    });
    expect(birthtimeInputs[0].value).toBe("02:24 PM");
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
});
