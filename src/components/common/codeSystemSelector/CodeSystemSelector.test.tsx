import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import CodeSystemSelector from "./CodeSystemSelector";
import userEvent from "@testing-library/user-event";

const options = [
  {
    display_name: "Encounter Inpatient",
    version: "2023-03",
    concepts: [
      {
        code: "183452005",
        code_system_name: "SNOMEDCT",
        code_system_oid: "1.2.3",
        code_system_version: "2023-03",
        display_name: "Snomed Emergency hospital admission (procedure)",
      },
      {
        code: "183452005",
        code_system_name: "SNOMEDCT",
        code_system_oid: "1.2.3",
        code_system_version: "2023-03",
        display_name: "Snomed Emergency hospital admission (procedure)",
      },
      {
        code: "183452005",
        code_system_name: "IONIC",
        code_system_oid: "1.2.3",
        code_system_version: "2023-03",
        display_name: "Snomed Emergency hospital admission (procedure)",
      },
    ],
    oid: "1.2.3",
  },
  {
    display_name: "Diabetes",
    version: "2023-03",
    concepts: [
      {
        code: "183452005",
        code_system_name: "SNOMEDCT",
        code_system_oid: "1.2.3",
        code_system_version: "2023-03",
        display_name: "Snomed Emergency hospital admission (procedure)",
      },
      {
        code: "183452005",
        code_system_name: "SNOMEDCT",
        code_system_oid: "1.2.3",
        code_system_version: "2023-03",
        display_name: "Snomed Emergency hospital admission (procedure)",
      },
      {
        code: "183452005",
        code_system_name: "IONIC",
        code_system_oid: "1.2.3",
        code_system_version: "2023-03",
        display_name: "Snomed Emergency hospital admission (procedure)",
      },
    ],
    oid: "1.2.3",
  },
  {
    system: "Custom",
    version: "Custom",
    concept: [{ code: "Custom", display: "Custom" }],
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
    expect(codeSystemSelectInput.value).toBe("SNOMEDCT");

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
    userEvent.click(renderedOptionsForCode[1]);

    const codeSelect = screen.getByTestId("code-select");
    const codeSelectDropdown = within(codeSelect).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(codeSelectDropdown);

    const renderedOptionsForCodeSystem = await screen.findAllByRole("option");
    expect(renderedOptionsForCodeSystem).toHaveLength(3); // including '-'
  });

  it("Should render custom options when custom is selected", async () => {
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
    userEvent.click(renderedOptionsForCode[3]);

    const codeCustom = screen.getByTestId("custom-input-code");
    expect(codeCustom).toBeInTheDocument();

    const codeSystemCustom = screen.getByTestId("custom-input-code-system");
    expect(codeSystemCustom).toBeInTheDocument();
  });

  it("Should render disabled state of child components", async () => {
    render(
      <CodeSystemSelector
        canEdit={false}
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
