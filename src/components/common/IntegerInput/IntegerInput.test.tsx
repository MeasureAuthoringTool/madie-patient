import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import IntegerInput from "./IntegerInput";
import userEvent from "@testing-library/user-event";

describe("IntegerInput Component", () => {
  test("Should render IntegerInput component", () => {
    const handleChange = jest.fn();
    render(
      <IntegerInput
        intValue={0}
        canEdit={true}
        handleChange={handleChange}
        label="Int"
      />
    );

    const integerField = screen.getByTestId("integer-field-Int");
    expect(integerField).toBeInTheDocument();
    const integerFieldInput = screen.getByTestId("integer-input-field-Int");
    expect(integerFieldInput).toBeInTheDocument();
  });

  test("Test change of value", () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <IntegerInput
        intValue={0}
        canEdit={true}
        handleChange={handleChange}
        label="Int"
      />
    );

    const integerField = screen.getByTestId("integer-field-Int");
    expect(integerField).toBeInTheDocument();
    const integerFieldInput = screen.getByTestId(
      "integer-input-field-Int"
    ) as HTMLInputElement;
    expect(integerFieldInput).toBeInTheDocument();
    expect(integerFieldInput.value).toBe("0");
    fireEvent.change(integerFieldInput, { target: { value: "10" } });
    rerender(
      <IntegerInput
        intValue={10}
        canEdit={true}
        handleChange={handleChange}
        label="Int"
      />
    );
    expect(integerFieldInput.value).toBe("10");
  });

  test("should ignore . and - keys", async () => {
    //ignores keypresses by not running handleChange on non-number keys

    const handleChange = jest.fn();
    render(
      <IntegerInput
        intValue={0}
        canEdit={true}
        handleChange={handleChange}
        label="Int"
      />
    );
    const integerField = screen.getByTestId("integer-field-Int");
    expect(integerField).toBeInTheDocument();
    const integerFieldInput = screen.getByTestId(
      "integer-input-field-Int"
    ) as HTMLInputElement;
    expect(integerFieldInput).toBeInTheDocument();
    expect(integerFieldInput.value).toBe("0");
    userEvent.type(integerFieldInput, "-");
    expect(handleChange).not.toBeCalled();
    userEvent.type(integerFieldInput, "{backspace}");
    userEvent.type(integerFieldInput, "1");
    //due to the nature of jest and the component, the 0 will be in the front
    await expect(handleChange).toHaveBeenNthCalledWith(2, "01");
    userEvent.type(integerFieldInput, "-");
    await expect(handleChange).not.toHaveBeenCalledTimes(3);
    userEvent.type(integerFieldInput, "1");
    await expect(handleChange).toHaveBeenNthCalledWith(3, "01");
    userEvent.type(integerFieldInput, ".");
    await expect(handleChange).not.toHaveBeenCalledTimes(4);
    userEvent.type(integerFieldInput, "a");
    await expect(handleChange).not.toHaveBeenCalledTimes(4);
  });
});
