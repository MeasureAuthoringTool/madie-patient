import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import CodeSystemSelector from "./CodeSystemSelector";
import userEvent from "@testing-library/user-event";

const options = [
  {
    system: "http://snomed.info/sct",
    version: "2023-03",
    concept: [
      {
        code: "183452005",
        display: "Snomed Emergency hospital admission (procedure)",
      },
      {
        code: "32485007",
        display: "Snomed Hospital admission (procedure)",
      },
    ],
  },
  {
    system: "http://ionic.info/sct",
    version: "2023-03",
    concept: [
      {
        code: "183452005",
        display: "Ionic Emergency hospital admission (procedure)",
      },
      {
        code: "32485007",
        display: "Ionic Hospital admission (procedure)",
      },
      {
        code: "8715000",
        display: "Ionic Hospital admission, elective (procedure)",
      },
    ],
  },
];

describe("CodeSystemSelector Component", () => {
  it("Should render child components with appropriate data", async () => {
    render(
      <CodeSystemSelector
        canEdit={true}
        codeSystemProps={{
          label: "Code System",
          options: options,
          required: false,
          error: false,
          helperText: "",
        }}
        codeProps={{
          label: "Code",
          required: false,
          error: false,
          helperText: "",
        }}
      />
    );

    const codeSystemSelectInput = screen.getByTestId(
      "code-system-select-input"
    ) as HTMLInputElement;

    expect(codeSystemSelectInput.value).toBe("");

    const codeSystemSelect = screen.getByTestId("code-system-select");
    const codeSystemSelectDropdown = within(codeSystemSelect).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(codeSystemSelectDropdown);

    const renderedOptionsForCodeSystem = await screen.findAllByRole("option");
    expect(renderedOptionsForCodeSystem).toHaveLength(3); // including '-'

    // This click will not update the value as onChange is not handled, but it helps in closing the Meunitems
    userEvent.click(renderedOptionsForCodeSystem[1]);
    expect(codeSystemSelectInput.value).toBe("http://snomed.info/sct");

    const codeSelect = screen.getByTestId("code-select");
    const codeSelectDropdown = within(codeSelect).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(codeSelectDropdown);

    const renderedOptionsForCode = await screen.findAllByRole("option");
    expect(renderedOptionsForCode).toHaveLength(3); // including '-'

    const codeSelectInput = screen.getByTestId(
      "code-select-input"
    ) as HTMLInputElement;

    userEvent.click(renderedOptionsForCode[1]);
    expect(codeSelectInput.value).toBe(
      "183452005 (Snomed Emergency hospital admission (procedure))"
    );
  });

  it("Should render code options based on the value selected in codesystem", async () => {
    render(
      <CodeSystemSelector
        canEdit={true}
        codeSystemProps={{
          label: "Code System",
          options: options,
          required: false,
          error: false,
          helperText: "",
        }}
        codeProps={{
          label: "Code",
          required: false,
          error: false,
          helperText: "",
        }}
      />
    );

    const codeSystemSelect = screen.getByTestId("code-system-select");
    const codeSystemSelectDropdown = within(codeSystemSelect).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(codeSystemSelectDropdown);

    const renderedOptionsForCode = await screen.findAllByRole("option");
    expect(renderedOptionsForCode).toHaveLength(3); // including '-'

    // This click will not update the value as onChange is not handled, but it helps in closing the Meunitems
    userEvent.click(renderedOptionsForCode[2]);

    const codeSelect = screen.getByTestId("code-select");
    const codeSelectDropdown = within(codeSelect).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(codeSelectDropdown);

    const renderedOptionsForCodeSystem = await screen.findAllByRole("option");
    expect(renderedOptionsForCodeSystem).toHaveLength(4); // including '-'
  });

  it("Should render disabled state of child components", async () => {
    render(
      <CodeSystemSelector
        canEdit={false}
        codeProps={{
          label: "Code",
          required: true,
          error: false,
          helperText: "",
        }}
        codeSystemProps={{
          label: "Code System",
          options: options,
          required: true,
          error: false,
          helperText: "",
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
