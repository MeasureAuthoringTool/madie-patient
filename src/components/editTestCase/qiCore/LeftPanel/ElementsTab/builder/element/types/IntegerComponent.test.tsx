import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import IntegerComponent from "./IntegerComponent";
import userEvent from "@testing-library/user-event";

describe("IntegerComponent", () => {
  describe("Unsigned IntegerComponent", () => {
    test("Should render Unsigned IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={-1}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          unsignedInt={true}
        />
      );

      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("-1");
      expect(
        screen.getByText("Unsigned integer range is [0 to 2147483647]")
      ).toBeInTheDocument();
    });

    test("Should validate Unsigned IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={1}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          unsignedInt={true}
        />
      );

      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("1");

      fireEvent.change(integerFieldInput, { target: { value: "2147483647" } });
      expect(
        screen.queryByText("Unsigned integer range is [0 to 2147483647]")
      ).not.toBeInTheDocument();

      fireEvent.change(integerFieldInput, { target: { value: "-10" } });
      expect(
        screen.getByText("Unsigned integer range is [0 to 2147483647]")
      ).toBeInTheDocument();
    });

    test("should ignore . and - keys", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={null}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          unsignedInt={true}
        />
      );
      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("");
      userEvent.type(integerFieldInput, "-");
      expect(screen.getByText("Invalid format")).toBeInTheDocument();
      userEvent.type(integerFieldInput, "1");
      expect(
        screen.getByText("Unsigned integer range is [0 to 2147483647]")
      ).toBeInTheDocument();
    });

    test("Test on key press of negative sign causes prevent default for Unsigned IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={null}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          unsignedInt={true}
        />
      );
      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("");
      fireEvent.keyPress(integerFieldInput, { key: "-", charCode: 173 });
      expect(integerFieldInput.value).toBe("");
    });

    test("Test on key press of reaching maximum causes prevent default for Unsigned IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={null}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          unsignedInt={true}
        />
      );
      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("");

      fireEvent.change(integerFieldInput, { target: { value: "214748364" } });
      expect(integerFieldInput.value).toBe("214748364");
      fireEvent.keyPress(integerFieldInput, { key: "8", charCode: 56 });
      expect(integerFieldInput.value).toBe("214748364");
    });

    test("Test on key press of number reaching maximum causes prevent default for Unsigned IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={null}
          label="Unsigned"
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
        />
      );
      const integerField = screen.getByTestId("integer-field-Unsigned");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId(
        "integer-field-input-Unsigned"
      );
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("");

      fireEvent.change(integerFieldInput, { target: { value: "214748364" } });
      expect(integerFieldInput.value).toBe("214748364");

      fireEvent.keyPress(integerFieldInput, { key: "8", charCode: 56 });
      expect(integerFieldInput.value).toBe("214748364");
    });

    test("Test on key press of number reaching minimum causes prevent default for Unsigned IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={null}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
        />
      );
      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("");

      fireEvent.change(integerFieldInput, { target: { value: "0" } });
      expect(integerFieldInput.value).toBe("0");

      fireEvent.keyPress(integerFieldInput, { key: "-", charCode: 173 });
      expect(integerFieldInput.value).toBe("0");
    });
  });

  describe("PositiveInt IntegerComponent", () => {
    test("Should render PositiveInt IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={2147483647}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          unsignedInt={false}
        />
      );

      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("2147483647");
    });

    test("Should validate PositiveInt IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={1}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          unsignedInt={false}
        />
      );
      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("1");

      fireEvent.change(integerFieldInput, { target: { value: "10" } });
      expect(
        screen.queryByText("Positive integer range is [1 to 2147483647]")
      ).not.toBeInTheDocument();

      fireEvent.change(integerFieldInput, { target: { value: "2147483648" } });
      expect(
        screen.getByText("Positive integer range is [1 to 2147483647]")
      ).toBeInTheDocument();

      fireEvent.change(integerFieldInput, { target: { value: "0" } });
      expect(
        screen.getByText("Positive integer range is [1 to 2147483647]")
      ).toBeInTheDocument();
    });

    test("Test 1 on key press of non-numeric causes prevent default for PositiveInt IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={null}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          unsignedInt={false}
        />
      );
      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("");

      fireEvent.keyPress(integerFieldInput, { key: "a", charCode: 97 });
      expect(integerFieldInput.value).toBe("");
    });

    test("Test 2 on key press of duplicate minus signs causes prevent default for PositiveInt IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={null}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          unsignedInt={false}
        />
      );
      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("");

      fireEvent.keyPress(integerFieldInput, { key: "a", charCode: 97 });
      expect(integerFieldInput.value).toBe("");

      fireEvent.change(integerFieldInput, { target: { value: "-1" } });
      expect(integerFieldInput.value).toBe("-1");
      fireEvent.keyPress(integerFieldInput, { key: "-", charCode: 173 });
      expect(integerFieldInput.value).toBe("-1");
      expect(
        screen.getByText("Positive integer range is [1 to 2147483647]")
      ).toBeInTheDocument();
    });

    test("Test 3 on key press of minus sign with a positive number causes prevent default for PositiveInt IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={null}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          unsignedInt={false}
        />
      );
      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("");

      fireEvent.change(integerFieldInput, { target: { value: "1" } });
      expect(integerFieldInput.value).toBe("1");
      fireEvent.keyPress(integerFieldInput, { key: "-", charCode: 173 });
      expect(integerFieldInput.value).toBe("1");
    });
  });

  test("Test 4 on key press of reaching maximum umber causes prevent default for PositiveInt IntegerComponent", () => {
    const handleChange = jest.fn();
    render(
      <IntegerComponent
        value={null}
        label=""
        canEdit={true}
        fieldRequired={false}
        onChange={handleChange}
        structureDefinition={null}
        unsignedInt={false}
      />
    );
    const integerField = screen.getByTestId("integer-field-");
    expect(integerField).toBeInTheDocument();
    const integerFieldInput = screen.getByTestId("integer-field-input-");
    expect(integerFieldInput).toBeInTheDocument();
    expect(integerFieldInput.value).toBe("");

    fireEvent.change(integerFieldInput, { target: { value: "214748364" } });
    expect(integerFieldInput.value).toBe("214748364");
    fireEvent.keyPress(integerFieldInput, { key: "8", charCode: 56 });
    expect(integerFieldInput.value).toBe("214748364");
  });
});
