import * as React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DiagnosisComponent from "./DiagnosisComponent";
import { CQL } from "cqm-models";

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

let handleDiagnosisChange = jest.fn();

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

describe("Diagnosis Component", () => {
  beforeEach(() => {
    handleDiagnosisChange = jest.fn((diagnoses) => {
      const cqlCode = new CQL.Code(
        "183452005",
        "1.2.3",
        null,
        "Snomed Emergency hospital admission (procedure)"
      );
      expect(diagnoses.code.code).toBe(cqlCode.code);
      expect(diagnoses.code.system).toBe(cqlCode.system);
      expect(diagnoses.code.version).toBe(cqlCode.version);
      expect(diagnoses.code.display).toBe(cqlCode.display);
    });
  });
  it("Should render DiagnosisComponent", async () => {
    render(
      <DiagnosisComponent
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

  it("test Present On Admission Indicator and value changes", async () => {
    render(
      <DiagnosisComponent
        canEdit={true}
        required={false}
        valueSets={valueSets}
        handleChange={jest.fn}
      />
    );
    //Present On Admission Indicator
    const presentOnAdmissionIndicatorInput = screen.getByTestId(
      "value-set-selector-input-present-on-admission-indicator"
    ) as HTMLInputElement;
    expect(presentOnAdmissionIndicatorInput.value).toBe("");
    const presentOnAdmissionIndicatorSelector = screen.getByTestId(
      "value-set-selector-present-on-admission-indicator"
    );
    const presentOnAdmissionIndicatorDropdown = within(
      presentOnAdmissionIndicatorSelector
    ).getByRole("button") as HTMLInputElement;
    userEvent.click(presentOnAdmissionIndicatorDropdown);

    const presentOnAdmissionIndicatorOptions = await screen.findAllByRole(
      "option"
    );
    expect(presentOnAdmissionIndicatorOptions).toHaveLength(3);

    // by default code system and code dropdown is not displayed unless user choose value set
    expect(
      screen.queryByTestId(
        "code-system-selector-present-on-admission-indicator"
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("code-selector-present-on-admission-indicator")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("custom-code-system-present-on-admission-indicator")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("custom-code-present-on-admission-indicator")
    ).not.toBeInTheDocument();

    //select value set
    userEvent.click(presentOnAdmissionIndicatorOptions[1]);

    // select the code system
    const codeSystemSelector = screen.getByTestId(
      "code-system-selector-present-on-admission-indicator"
    );
    const codeSystemDropdown = within(codeSystemSelector).getByRole("button");
    userEvent.click(codeSystemDropdown);
    const codeSystemOptions = await screen.findAllByRole("option");
    expect(codeSystemOptions[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptions[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptions[0]);

    // select the code
    const codeSelector = screen.getByTestId(
      "code-selector-present-on-admission-indicator"
    );
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
  });

  it("test Rank and changes", async () => {
    render(
      <DiagnosisComponent
        canEdit={true}
        required={false}
        valueSets={valueSets}
        handleChange={jest.fn}
      />
    );

    const rankInput = screen.getByTestId(
      "integer-input-field-Rank"
    ) as HTMLInputElement;
    expect(rankInput).toBeInTheDocument();
    expect(rankInput.value).toBe("");

    fireEvent.change(rankInput, { target: { value: "-1" } });
    expect(rankInput.value).toBe("-1");
  });

  it("Should allow user to choose existing code from one of the selected value sets", async () => {
    render(
      <DiagnosisComponent
        canEdit={true}
        required={false}
        valueSets={valueSets}
        handleChange={(value) => handleDiagnosisChange(value)}
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
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(0);

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
    //POA and Rank are optional
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(1);

    //Present On Admission Indicator
    const presentOnAdmissionIndicatorInput = screen.getByTestId(
      "value-set-selector-input-present-on-admission-indicator"
    ) as HTMLInputElement;
    expect(presentOnAdmissionIndicatorInput.value).toBe("");
    const presentOnAdmissionIndicatorSelector = screen.getByTestId(
      "value-set-selector-present-on-admission-indicator"
    );
    const presentOnAdmissionIndicatorDropdown = within(
      presentOnAdmissionIndicatorSelector
    ).getByRole("button") as HTMLInputElement;
    userEvent.click(presentOnAdmissionIndicatorDropdown);

    const presentOnAdmissionIndicatorOptions = await screen.findAllByRole(
      "option"
    );
    expect(presentOnAdmissionIndicatorOptions).toHaveLength(3);

    //select value set
    userEvent.click(presentOnAdmissionIndicatorOptions[1]);

    // select the code system
    const codeSystemSelectorPOAI = screen.getByTestId(
      "code-system-selector-present-on-admission-indicator"
    );
    const codeSystemDropdownPOAI = within(codeSystemSelectorPOAI).getByRole(
      "button"
    );
    userEvent.click(codeSystemDropdownPOAI);
    const codeSystemOptionsPOAI = await screen.findAllByRole("option");
    expect(codeSystemOptionsPOAI[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptionsPOAI[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptionsPOAI[0]);

    // select the code
    const codeSelectorPOAI = screen.getByTestId(
      "code-selector-present-on-admission-indicator"
    );
    const codeDropdownPOAI = within(codeSelectorPOAI).getByRole("button");
    userEvent.click(codeDropdownPOAI);
    const codeOptionsPOAI = await screen.findAllByRole("option");
    expect(codeOptionsPOAI).toHaveLength(2);
    expect(codeOptionsPOAI[0]).toHaveTextContent(
      "183452005 - Snomed Emergency hospital admission (procedure)"
    );
    expect(codeOptionsPOAI[1]).toHaveTextContent(
      "305686008 - Seen by palliative care physician (finding)"
    );
    userEvent.click(codeOptionsPOAI[0]);
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(2);

    const rankInput = screen.getByTestId(
      "integer-input-field-Rank"
    ) as HTMLInputElement;
    expect(rankInput).toBeInTheDocument();
    expect(rankInput.value).toBe("");

    fireEvent.change(rankInput, { target: { value: "1" } });
    expect(rankInput.value).toBe("1");
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(3);
  });

  it("Should allow user to enter custom code system and code", async () => {
    const customCodeSystem = "X.12.34.1";
    const customCode = "X-11";

    render(
      <DiagnosisComponent
        canEdit={true}
        required={false}
        valueSets={valueSets}
        handleChange={handleDiagnosisChange}
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
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(0);

    // type in the code
    const customCodeInput = screen.getByTestId("custom-code-input");
    userEvent.type(customCodeInput, customCode);
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(1);
  });

  it("Should allow user to enter custom code system and code for Present on Admission Indicator", async () => {
    const customCodeSystem = "X.12.34.1";
    const customCode = "X-11";

    render(
      <DiagnosisComponent
        canEdit={true}
        required={false}
        valueSets={valueSets}
        handleChange={handleDiagnosisChange}
      />
    );

    // select the value set
    const valueSetSelector = screen.getByTestId(
      "value-set-selector-present-on-admission-indicator"
    );
    const valueSetDropdown = within(valueSetSelector).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(valueSetDropdown);
    const valueSetOptions = await screen.findAllByRole("option");
    userEvent.click(valueSetOptions[0]);
    const valueSetsInput = screen.getByTestId(
      "value-set-selector-input-present-on-admission-indicator"
    ) as HTMLInputElement;
    expect(valueSetsInput.value).toBe(
      "custom-vs-present-on-admission-indicator"
    );

    // type in code system
    const customCodeSystemInput = screen.getByTestId(
      "custom-code-system-input-present-on-admission-indicator"
    );
    userEvent.type(customCodeSystemInput, customCodeSystem);
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(0);

    // type in the code
    const customCodeInput = screen.getByTestId(
      "custom-code-input-present-on-admission-indicator"
    );
    userEvent.type(customCodeInput, customCode);
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(0);
  });

  it("test handleValueSetChange calls handleChange", async () => {
    render(
      <DiagnosisComponent
        canEdit={true}
        required={false}
        valueSets={valueSets}
        handleChange={(value) => handleDiagnosisChange(value)}
      />
    );

    //Present On Admission Indicator
    const presentOnAdmissionIndicatorInput = screen.getByTestId(
      "value-set-selector-input-present-on-admission-indicator"
    ) as HTMLInputElement;
    expect(presentOnAdmissionIndicatorInput.value).toBe("");
    const presentOnAdmissionIndicatorSelector = screen.getByTestId(
      "value-set-selector-present-on-admission-indicator"
    );
    const presentOnAdmissionIndicatorDropdown = within(
      presentOnAdmissionIndicatorSelector
    ).getByRole("button") as HTMLInputElement;
    userEvent.click(presentOnAdmissionIndicatorDropdown);

    const presentOnAdmissionIndicatorOptions = await screen.findAllByRole(
      "option"
    );
    expect(presentOnAdmissionIndicatorOptions).toHaveLength(3);

    //select value set
    userEvent.click(presentOnAdmissionIndicatorOptions[1]);

    // select the code system
    const codeSystemSelectorPOAI = screen.getByTestId(
      "code-system-selector-present-on-admission-indicator"
    );
    const codeSystemDropdownPOAI = within(codeSystemSelectorPOAI).getByRole(
      "button"
    );
    userEvent.click(codeSystemDropdownPOAI);
    const codeSystemOptionsPOAI = await screen.findAllByRole("option");
    expect(codeSystemOptionsPOAI[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptionsPOAI[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptionsPOAI[0]);

    // select the code
    const codeSelectorPOAI = screen.getByTestId(
      "code-selector-present-on-admission-indicator"
    );
    const codeDropdownPOAI = within(codeSelectorPOAI).getByRole("button");
    userEvent.click(codeDropdownPOAI);
    const codeOptionsPOAI = await screen.findAllByRole("option");
    expect(codeOptionsPOAI).toHaveLength(2);
    expect(codeOptionsPOAI[0]).toHaveTextContent(
      "183452005 - Snomed Emergency hospital admission (procedure)"
    );
    expect(codeOptionsPOAI[1]).toHaveTextContent(
      "305686008 - Seen by palliative care physician (finding)"
    );
    userEvent.click(codeOptionsPOAI[0]);
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(0);

    const rankInput = screen.getByTestId(
      "integer-input-field-Rank"
    ) as HTMLInputElement;
    expect(rankInput).toBeInTheDocument();
    expect(rankInput.value).toBe("");

    fireEvent.change(rankInput, { target: { value: "1" } });
    expect(rankInput.value).toBe("1");
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(0);

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
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(0);

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
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(1);
  });

  it("test handleValueSetChangePOAI calls handleChange", async () => {
    render(
      <DiagnosisComponent
        canEdit={true}
        required={false}
        valueSets={valueSets}
        handleChange={(value) => handleDiagnosisChange(value)}
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
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(0);

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
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(1);

    const rankInput = screen.getByTestId(
      "integer-input-field-Rank"
    ) as HTMLInputElement;
    expect(rankInput).toBeInTheDocument();
    expect(rankInput.value).toBe("");

    fireEvent.change(rankInput, { target: { value: "1" } });
    expect(rankInput.value).toBe("1");
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(2);

    //Present On Admission Indicator
    const presentOnAdmissionIndicatorInput = screen.getByTestId(
      "value-set-selector-input-present-on-admission-indicator"
    ) as HTMLInputElement;
    expect(presentOnAdmissionIndicatorInput.value).toBe("");
    const presentOnAdmissionIndicatorSelector = screen.getByTestId(
      "value-set-selector-present-on-admission-indicator"
    );
    const presentOnAdmissionIndicatorDropdown = within(
      presentOnAdmissionIndicatorSelector
    ).getByRole("button") as HTMLInputElement;
    userEvent.click(presentOnAdmissionIndicatorDropdown);

    const presentOnAdmissionIndicatorOptions = await screen.findAllByRole(
      "option"
    );
    expect(presentOnAdmissionIndicatorOptions).toHaveLength(3);

    //select value set
    userEvent.click(presentOnAdmissionIndicatorOptions[1]);

    // select the code system
    const codeSystemSelectorPOAI = screen.getByTestId(
      "code-system-selector-present-on-admission-indicator"
    );
    const codeSystemDropdownPOAI = within(codeSystemSelectorPOAI).getByRole(
      "button"
    );
    userEvent.click(codeSystemDropdownPOAI);
    const codeSystemOptionsPOAI = await screen.findAllByRole("option");
    expect(codeSystemOptionsPOAI[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptionsPOAI[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptionsPOAI[0]);

    // select the code
    const codeSelectorPOAI = screen.getByTestId(
      "code-selector-present-on-admission-indicator"
    );
    const codeDropdownPOAI = within(codeSelectorPOAI).getByRole("button");
    userEvent.click(codeDropdownPOAI);
    const codeOptionsPOAI = await screen.findAllByRole("option");
    expect(codeOptionsPOAI).toHaveLength(2);
    expect(codeOptionsPOAI[0]).toHaveTextContent(
      "183452005 - Snomed Emergency hospital admission (procedure)"
    );
    expect(codeOptionsPOAI[1]).toHaveTextContent(
      "305686008 - Seen by palliative care physician (finding)"
    );
    userEvent.click(codeOptionsPOAI[0]);
    expect(handleDiagnosisChange).toHaveBeenCalledTimes(3);
  });
});
