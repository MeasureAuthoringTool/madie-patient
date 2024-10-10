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
          value={4294967295}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          signed={false}
        />
      );

      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("4294967295");
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
          signed={false}
        />
      );

      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("1");

      fireEvent.change(integerFieldInput, { target: { value: "10" } });
      expect(
        screen.queryByText("Unsigned integer range is [0 to 4294967295]")
      ).not.toBeInTheDocument();

      fireEvent.change(integerFieldInput, { target: { value: "-10" } });
      expect(
        screen.getByText("Unsigned integer range is [0 to 4294967295]")
      ).toBeInTheDocument();
    });

    //works but seems not needed
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
          signed={false}
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
        screen.getByText("Unsigned integer range is [0 to 4294967295]")
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
          signed={false}
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
          signed={false}
        />
      );
      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("");
      //   fireEvent.keyPress(integerFieldInput, { key: "4", charCode: 52 });
      //   fireEvent.keyPress(integerFieldInput, { key: "2", charCode: 50 });
      //   fireEvent.keyPress(integerFieldInput, { key: "9", charCode: 57 });
      //   fireEvent.keyPress(integerFieldInput, { key: "4", charCode: 52 });
      //   fireEvent.keyPress(integerFieldInput, { key: "9", charCode: 57 });
      //   fireEvent.keyPress(integerFieldInput, { key: "6", charCode: 54 });
      //   fireEvent.keyPress(integerFieldInput, { key: "7", charCode: 55 });
      //   fireEvent.keyPress(integerFieldInput, { key: "2", charCode: 50 });
      //   fireEvent.keyPress(integerFieldInput, { key: "9", charCode: 57 });
      //   fireEvent.keyPress(integerFieldInput, { key: "6", charCode: 54 });

      fireEvent.change(integerFieldInput, { target: { value: "429496729" } });
      expect(integerFieldInput.value).toBe("429496729");
      fireEvent.keyPress(integerFieldInput, { key: "6", charCode: 54 });
      expect(integerFieldInput.value).toBe("429496729");
    });
  });

  describe("Signed IntegerComponent", () => {
    test("Should render Signed IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={2147483647}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          signed={true}
        />
      );

      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("2147483647");
    });

    test("Should validate Signed IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={0}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          signed={true}
        />
      );
      const integerField = screen.getByTestId("integer-field-");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId("integer-field-input-");
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("");

      fireEvent.change(integerFieldInput, { target: { value: "10" } });
      expect(
        screen.queryByText(
          "Signed integer range is [-2147483648 to 2147483647]"
        )
      ).not.toBeInTheDocument();

      fireEvent.change(integerFieldInput, { target: { value: "2147483648" } });
      expect(
        screen.getByText("Signed integer range is [-2147483648 to 2147483647]")
      ).toBeInTheDocument();

      fireEvent.change(integerFieldInput, { target: { value: "-2147483649" } });
      expect(
        screen.getByText("Signed integer range is [-2147483648 to 2147483647]")
      ).toBeInTheDocument();
    });

    test("Test on key press of non-numeric causes prevent default for Signed IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={null}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          signed={true}
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

    test("Test on key press of duplicate minus signs causes prevent default for Signed IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={null}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          signed={true}
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
    });

    test("Test on key press of minus sign with a positive number causes prevent default for Signed IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={null}
          label=""
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
          signed={true}
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

    test("Test on key press of number reaching minimum causes prevent default for Signed IntegerComponent", () => {
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

      fireEvent.change(integerFieldInput, { target: { value: "-214748364" } });
      expect(integerFieldInput.value).toBe("-214748364");

      fireEvent.keyPress(integerFieldInput, { key: "9", charCode: 57 });
      expect(integerFieldInput.value).toBe("-214748364");
    });

    test("Test on key press of number reaching maximum causes prevent default for Signed IntegerComponent", () => {
      const handleChange = jest.fn();
      render(
        <IntegerComponent
          value={null}
          label="Signed"
          canEdit={true}
          fieldRequired={false}
          onChange={handleChange}
          structureDefinition={null}
        />
      );
      const integerField = screen.getByTestId("integer-field-Signed");
      expect(integerField).toBeInTheDocument();
      const integerFieldInput = screen.getByTestId(
        "integer-field-input-Signed"
      );
      expect(integerFieldInput).toBeInTheDocument();
      expect(integerFieldInput.value).toBe("");

      fireEvent.change(integerFieldInput, { target: { value: "214748364" } });
      expect(integerFieldInput.value).toBe("214748364");

      fireEvent.keyPress(integerFieldInput, { key: "8", charCode: 56 });
      expect(integerFieldInput.value).toBe("214748364");
    });
  });
});
