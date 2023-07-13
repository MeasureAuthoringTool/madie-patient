import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import DecimalInput from "./DecimalInput";
import userEvent from "@testing-library/user-event";

describe("DecimalInput Component", () => {
  test("Should render DecimalInput component", () => {
    const handleChange = jest.fn();
    render(
      <DecimalInput
        value={0}
        canEdit={true}
        handleChange={handleChange}
        label="Dec"
      />
    );

    const DecimalField = screen.getByTestId("decimal-field-Dec");
    expect(DecimalField).toBeInTheDocument();
    const DecimalFieldInput = screen.getByTestId("decimal-input-field-Dec");
    expect(DecimalFieldInput).toBeInTheDocument();
  });

  test("Test change of value", () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <DecimalInput
        value={0}
        canEdit={true}
        handleChange={handleChange}
        label="Dec"
      />
    );

    const DecimalField = screen.getByTestId("decimal-field-Dec");
    expect(DecimalField).toBeInTheDocument();
    const DecimalFieldInput = screen.getByTestId(
      "decimal-input-field-Dec"
    ) as HTMLInputElement;
    expect(DecimalFieldInput).toBeInTheDocument();
    expect(DecimalFieldInput.value).toBe("0");
    fireEvent.change(DecimalFieldInput, { target: { value: "10" } });
    rerender(
      <DecimalInput
        value={10}
        canEdit={true}
        handleChange={handleChange}
        label="Dec"
      />
    );
    expect(DecimalFieldInput.value).toBe("10");
  });

  test("should ignore - and non-number keys", async () => {
    //ignores keypresses by not running handleChange on non-number keys

    const handleChange = jest.fn();
    render(
      <DecimalInput value={0} canEdit={true} handleChange={handleChange} />
    );
    const DecimalField = screen.getByTestId("decimal-field-Decimal");
    expect(DecimalField).toBeInTheDocument();
    const DecimalFieldInput = screen.getByTestId(
      "decimal-input-field-Decimal"
    ) as HTMLInputElement;
    expect(DecimalFieldInput).toBeInTheDocument();
    expect(DecimalFieldInput.value).toBe("0");
    userEvent.type(DecimalFieldInput, "-");
    expect(handleChange).not.toBeCalled();
    userEvent.type(DecimalFieldInput, "{backspace}");
    userEvent.type(DecimalFieldInput, "1");
    //due to the nature of jest and the component, the 0 will be in the front
    await expect(handleChange).toHaveBeenNthCalledWith(2, "01");
    userEvent.type(DecimalFieldInput, "-");
    await expect(handleChange).not.toHaveBeenCalledTimes(3);
    userEvent.type(DecimalFieldInput, "1");
    await expect(handleChange).toHaveBeenNthCalledWith(3, "01");
    userEvent.type(DecimalFieldInput, ".");
    await expect(handleChange).not.toHaveBeenCalledTimes(4);
    userEvent.type(DecimalFieldInput, "a");
    await expect(handleChange).not.toHaveBeenCalledTimes(4);
  });
});
