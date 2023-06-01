import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import AttributeSelector from "./AttributeSelector";
import userEvent from "@testing-library/user-event";

const options = ["option 1", "option 2", "option 3"];

describe("AttributeSelector Component", () => {
  it("Should render child components with appropriate data", async () => {
    render(
      <AttributeSelector
        canEdit={true}
        attributeProps={{
          label: "test Attribute",
          options: options,
          required: false,
          error: false,
          helperText: "",
          value: options[0],
        }}
        attributeTypeProps={{
          label: "test Type",
          options: options,
          required: false,
          error: false,
          helperText: "",
          value: options[2],
        }}
      />
    );

    const AttributeSelectInput = screen.getByTestId(
      "test-attribute-select-input"
    ) as HTMLInputElement;

    expect(AttributeSelectInput.value).toBe("option 1");

    const attributeSelect = screen.getByTestId("test-attribute-select");
    const attributeSelectDropdown = within(attributeSelect).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(attributeSelectDropdown);

    const renderedOptionsForAttribute = await screen.findAllByRole("option");
    expect(renderedOptionsForAttribute).toHaveLength(4); // including '-'

    // This click will not update the value as onChange is not handled, but it helps in closing the Meunitems
    userEvent.click(renderedOptionsForAttribute[1]);

    const AttributeTypeSelectInput = screen.getByTestId(
      "test-type-select-input"
    ) as HTMLInputElement;

    expect(AttributeTypeSelectInput.value).toBe("option 3");

    const attributeTypeSelect = screen.getByTestId("test-type-select");
    const attributeTypeSelectDropdown = within(attributeTypeSelect).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(attributeTypeSelectDropdown);

    const renderedOptionsForType = await screen.findAllByRole("option");
    expect(renderedOptionsForType).toHaveLength(4); // including '-'
  });

  it("Should render child components as required", async () => {
    render(
      <AttributeSelector
        canEdit={true}
        attributeProps={{
          label: "test Attribute",
          options: options,
          required: true,
          error: false,
          helperText: "",
          value: options[0],
        }}
        attributeTypeProps={{
          label: "test Type",
          options: options,
          required: true,
          error: false,
          helperText: "",
          value: options[2],
        }}
      />
    );

    const attributeSelect = screen.getByTestId("test-attribute-select");
    const attributeSelectDropdown = within(attributeSelect).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(attributeSelectDropdown);

    const renderedOptionsForAttribute = await screen.findAllByRole("option");
    expect(renderedOptionsForAttribute).toHaveLength(3); // including '-'

    // This click will not update the value as onChange is not handled, but it helps in closing the Meunitems
    userEvent.click(renderedOptionsForAttribute[1]);

    const attributeTypeSelect = screen.getByTestId("test-type-select");
    const attributeTypeSelectDropdown = within(attributeTypeSelect).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(attributeTypeSelectDropdown);

    const renderedOptionsForType = await screen.findAllByRole("option");
    expect(renderedOptionsForType).toHaveLength(3); // including '-'
  });

  it("Should render disabled state of child components", async () => {
    render(
      <AttributeSelector
        canEdit={false}
        attributeProps={{
          label: "test Attribute",
          options: options,
          required: true,
          error: false,
          helperText: "",
          value: options[0],
        }}
        attributeTypeProps={{
          label: "test Type",
          options: options,
          required: true,
          error: false,
          helperText: "",
          value: options[2],
        }}
      />
    );

    const AttributeSelectInput = screen.getByTestId(
      "test-attribute-select-input"
    ) as HTMLInputElement;

    expect(AttributeSelectInput).toBeDisabled();

    const AttributeTypeSelectInput = screen.getByTestId(
      "test-type-select-input"
    ) as HTMLInputElement;

    expect(AttributeTypeSelectInput).toBeDisabled();
  });
});
