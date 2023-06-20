import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import CodeSystemSelector from "./CodeSystemSelector";
import userEvent from "@testing-library/user-event";

const options = ["option 1", "option 2", "option 3"];

describe("CodeSystemSelector Component", () => {
  it("Should render child components with appropriate data", async () => {
    render(
      <CodeSystemSelector
        canEdit={true}
        codeProps={{
          label: "Code",
          options: options,
          required: false,
          error: false,
          helperText: "",
          value: options[0],
        }}
        codeSystemProps={{
          label: "Code System",
          options: options,
          required: false,
          error: false,
          helperText: "",
          value: options[2],
        }}
      />
    );

    const codeSelectInput = screen.getByTestId(
      "code-select-input"
    ) as HTMLInputElement;

    expect(codeSelectInput.value).toBe("option 1");

    const codeSelect = screen.getByTestId("code-select");
    const codeSelectDropdown = within(codeSelect).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(codeSelectDropdown);

    const renderedOptionsForCode = await screen.findAllByRole("option");
    expect(renderedOptionsForCode).toHaveLength(4); // including '-'

    // This click will not update the value as onChange is not handled, but it helps in closing the Meunitems
    userEvent.click(renderedOptionsForCode[1]);

    const codeSystemSelectInput = screen.getByTestId(
      "code-system-select-input"
    ) as HTMLInputElement;

    expect(codeSystemSelectInput.value).toBe("option 3");

    const codeSystemSelect = screen.getByTestId("code-system-select");
    const codeSystemSelectDropdown = within(codeSystemSelect).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(codeSystemSelectDropdown);

    const renderedOptionsForCodeSystem = await screen.findAllByRole("option");
    expect(renderedOptionsForCodeSystem).toHaveLength(4); // including '-'
  });

  it("Should render child components as required", async () => {
    render(
      <CodeSystemSelector
        canEdit={true}
        codeProps={{
          label: "Code",
          options: options,
          required: true,
          error: false,
          helperText: "",
          value: options[0],
        }}
        codeSystemProps={{
          label: "Code System",
          options: options,
          required: true,
          error: false,
          helperText: "",
          value: options[2],
        }}
      />
    );

    const codeSelect = screen.getByTestId("code-select");
    const codeSelectDropdown = within(codeSelect).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(codeSelectDropdown);

    const renderedOptionsForCode = await screen.findAllByRole("option");
    expect(renderedOptionsForCode).toHaveLength(3); // including '-'

    // This click will not update the value as onChange is not handled, but it helps in closing the Meunitems
    userEvent.click(renderedOptionsForCode[1]);

    const codeSystemSelect = screen.getByTestId("code-select");
    const codeSystemSelectDropdown = within(codeSystemSelect).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(codeSystemSelectDropdown);

    const renderedOptionsForCodeSystem = await screen.findAllByRole("option");
    expect(renderedOptionsForCodeSystem).toHaveLength(3); // including '-'
  });

  it("Should render disabled state of child components", async () => {
    render(
      <CodeSystemSelector
        canEdit={false}
        codeProps={{
          label: "Code",
          options: options,
          required: true,
          error: false,
          helperText: "",
          value: options[0],
        }}
        codeSystemProps={{
          label: "Code System",
          options: options,
          required: true,
          error: false,
          helperText: "",
          value: options[2],
        }}
      />
    );

    const codeSelectInput = screen.getByTestId(
      "code-select-input"
    ) as HTMLInputElement;

    expect(codeSelectInput).toBeDisabled();

    const codeSystemSelectInput = screen.getByTestId(
      "code-system-select-input"
    ) as HTMLInputElement;

    expect(codeSystemSelectInput).toBeDisabled();
  });
});
