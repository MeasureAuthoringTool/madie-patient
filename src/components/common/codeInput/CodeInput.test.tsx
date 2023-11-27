import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CodeInput from "./CodeInput";

const valueSets = [
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
        code: "305686008",
        code_system_name: "SNOMEDCT",
        code_system_oid: "1.2.3",
        code_system_version: "2023-03",
        display_name: "Seen by palliative care physician (finding)",
      },
      {
        code: "Z51.5",
        code_system_name: "ICD10CM",
        code_system_oid: "4.5.6",
        code_system_version: "2023-03",
        display_name: "Encounter for palliative care",
      },
    ],
    oid: "1.2.3.4.5",
  },
  {
    display_name: "Palliative Care Intervention",
    version: "2023-03",
    concepts: [
      {
        code: "443761007",
        code_system_name: "SNOMEDCT",
        code_system_oid: "1.2.3",
        code_system_version: "2023-03",
        display_name: "Anticipatory palliative care (regime/therapy)",
      },
    ],
    oid: "7.8.9.10",
  },
];

jest.mock("@madie/madie-util", () => ({
  routeHandlerStore: {
    subscribe: (set) => {
      set();
      return { unsubscribe: () => null };
    },
    updateRouteHandlerState: () => null,
    state: { canTravel: true, pendingPath: "" },
    initialState: { canTravel: true, pendingPath: "" },
  },
}));

describe("CodeInput Component", () => {
  it("Should render Code Input component", async () => {
    render(
      <CodeInput
        canEdit={true}
        required={false}
        valueSets={valueSets}
        handleChange={jest.fn}
      />
    );

    const valueSetsInput = screen.getByTestId(
      "value-set-selector-input"
    ) as HTMLInputElement;
    expect(valueSetsInput.value).toBe("");
    const valueSetSelector = screen.getByTestId("value-set-selector");
    const valueSetDropdown = within(valueSetSelector).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(valueSetDropdown);

    const valueSetOptions = await screen.findAllByRole("option");
    expect(valueSetOptions).toHaveLength(3);
    // by default code system and code dropdown is not displayed unless user choose value set
    expect(
      screen.queryByTestId("code-system-selector")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("code-selector")).not.toBeInTheDocument();
    expect(screen.queryByTestId("custom-code-system")).not.toBeInTheDocument();
    expect(screen.queryByTestId("custom-code")).not.toBeInTheDocument();
  });

  it("Should allow user to choose existing code from one of the selected value sets", async () => {
    const verifyCqlCode = jest.fn((cqlCode) => {
      expect(cqlCode.code).toBe("183452005");
      expect(cqlCode.system).toBe("1.2.3");
      expect(cqlCode.display).toBe(
        "Snomed Emergency hospital admission (procedure)"
      );
    });
    render(
      <CodeInput
        canEdit={true}
        required={false}
        valueSets={valueSets}
        handleChange={(value) => verifyCqlCode(value)}
      />
    );

    // select the value set
    const valueSetSelector = screen.getByTestId("value-set-selector");
    const valueSetDropdown = within(valueSetSelector).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(valueSetDropdown);
    const valueSetOptions = await screen.findAllByRole("option");
    userEvent.click(valueSetOptions[1]);

    // select the code system
    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole("button");
    userEvent.click(codeSystemDropdown);
    const codeSystemOptions = await screen.findAllByRole("option");
    expect(codeSystemOptions[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptions[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptions[0]);
    expect(verifyCqlCode).toHaveBeenCalledTimes(0);

    // select the code
    const codeSelector = screen.getByTestId("code-selector");
    const codeDropdown = within(codeSelector).getByRole("button");
    userEvent.click(codeDropdown);
    const codeOptions = await screen.findAllByRole("option");
    expect(codeOptions).toHaveLength(2);
    expect(codeOptions[0]).toHaveTextContent(
      "183452005 - Snomed Emergency hospital admission (procedure)"
    );
    expect(codeOptions[1]).toHaveTextContent(
      "305686008 - Seen by palliative care physician (finding)"
    );
    userEvent.click(codeOptions[0]);
    expect(verifyCqlCode).toHaveBeenCalledTimes(1);
  });

  it("Should allow user to enter custom code system and code", async () => {
    const customCodeSystem = "X.12.34.1";
    const customCode = "X-11";
    const verifyCqlCode = jest.fn((cqlCode) => {
      expect(cqlCode.code).toBe(customCode);
      expect(cqlCode.system).toBe(customCodeSystem);
      expect(cqlCode.display).toBe(customCode);
    });

    render(
      <CodeInput
        canEdit={true}
        required={false}
        valueSets={valueSets}
        handleChange={verifyCqlCode}
      />
    );

    // select the value set
    const valueSetSelector = screen.getByTestId("value-set-selector");
    const valueSetDropdown = within(valueSetSelector).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(valueSetDropdown);
    const valueSetOptions = await screen.findAllByRole("option");
    userEvent.click(valueSetOptions[0]);
    const valueSetsInput = screen.getByTestId(
      "value-set-selector-input"
    ) as HTMLInputElement;
    expect(valueSetsInput.value).toBe("custom-vs");

    // type in code system
    const customCodeSystemInput = screen.getByTestId(
      "custom-code-system-input"
    );
    userEvent.type(customCodeSystemInput, customCodeSystem);
    expect(verifyCqlCode).toHaveBeenCalledTimes(0);

    // type in the code
    const customCodeInput = screen.getByTestId("custom-code-input");
    userEvent.type(customCodeInput, customCode);
    expect(verifyCqlCode).toHaveBeenCalledTimes(1);
  });
});
