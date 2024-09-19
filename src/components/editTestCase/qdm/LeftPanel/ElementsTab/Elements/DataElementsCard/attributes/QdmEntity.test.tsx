import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import {
  PatientEntity,
  CarePartner,
  Location,
  Practitioner,
  Organization,
} from "cqm-models";
import QdmEntity from "./QdmEntity";

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

describe("QdmEntity Component", () => {
  beforeEach(() => {});

  test("null attributeType", () => {
    const mockHandleChange = jest.fn();
    render(
      <QdmEntity
        attributeType={undefined}
        attributeValue={undefined}
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
      />
    );

    expect(
      screen.queryByRole("textbox", {
        name: "Value Set / Direct Reference Code",
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", {
        name: "Value",
      })
    ).not.toBeInTheDocument();
    expect(mockHandleChange).not.toHaveBeenCalled();
  });

  test("PatientEntity attributeType", () => {
    const mockHandleChange = jest.fn();
    render(
      <QdmEntity
        attributeType="PatientEntity"
        attributeValue=""
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(0);

    const namingSystemInput = screen.getByRole("textbox", {
      name: "Naming System",
    });
    userEvent.paste(namingSystemInput, "test naming system");
    const valueInput = screen.getByRole("textbox", {
      name: "Value",
    });
    userEvent.paste(valueInput, "test value");
    const idInput = screen.getByTestId("string-field-id-input");
    userEvent.paste(idInput, "test id");
    expect(
      mockHandleChange.mock.calls[0][0] instanceof PatientEntity
    ).toBeTruthy();
    expect(mockHandleChange.mock.calls[0][0]?.identifier?.namingSystem).toEqual(
      "test naming system"
    );
    expect(mockHandleChange.mock.calls[0][0]?.identifier?.value).toEqual(
      "test value"
    );
    expect(mockHandleChange.mock.calls[0][0]?.id).toEqual("test id");
    expect(mockHandleChange).toHaveBeenCalledTimes(1);

    userEvent.paste(valueInput, "test value2");
    expect(mockHandleChange).toHaveBeenCalledTimes(2);
  });

  test("Practitioner attributeType", async () => {
    const mockHandleChange = jest.fn();
    render(
      <QdmEntity
        attributeType="Practitioner"
        attributeValue=""
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(0);

    userEvent.paste(
      screen.getByRole("textbox", {
        name: "Naming System",
      }),
      "test naming system"
    );
    userEvent.paste(
      screen.getByRole("textbox", {
        name: "Value",
      }),
      "test value"
    );
    userEvent.paste(screen.getByTestId("string-field-id-input"), "test id");
    expect(mockHandleChange).toHaveBeenCalledTimes(0);

    //Role
    const valueSetsInputs = screen.getAllByTestId(
      "value-set-selector-input"
    ) as HTMLInputElement[];
    expect(valueSetsInputs[0].value).toBe("");
    const valueSetSelectors = screen.getAllByTestId("value-set-selector");
    const valueSetDropdown1 = within(valueSetSelectors[0]).getByRole(
      "combobox",
      { name: "Value Set / Direct Reference Code" }
    ) as HTMLInputElement;
    userEvent.click(valueSetDropdown1);

    const valueSetOptions = await screen.findAllByRole("option");
    expect(valueSetOptions).toHaveLength(3);
    // by default code system and code dropdown is not displayed unless user choose value set
    expect(
      screen.queryByTestId("code-system-selector")
    ).not.toBeInTheDocument();
    userEvent.click(valueSetOptions[1]);

    // select the code system
    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole(
      "combobox",
      { name: "Code System" }
    );
    userEvent.click(codeSystemDropdown);
    const codeSystemOptions = await screen.findAllByRole("option");
    expect(codeSystemOptions[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptions[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptions[0]);

    // select the code
    const codeSelector = screen.getByTestId("code-selector");
    const codeDropdown = within(codeSelector).getByRole("combobox", {
      name: "Code",
    });
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
    expect(mockHandleChange).toHaveBeenCalledTimes(0);

    //Specialty
    const valueSetDropdown2 = within(valueSetSelectors[1]).getByRole(
      "combobox",
      { name: "Value Set / Direct Reference Code" }
    ) as HTMLInputElement;
    userEvent.click(valueSetDropdown2);
    const valueSetOptions2 = await screen.findAllByRole("option");
    expect(valueSetOptions2).toHaveLength(3);
    userEvent.click(valueSetOptions2[1]);

    // select the code system
    const codeSystemSelector2 = screen.getAllByTestId("code-system-selector");
    const codeSystemDropdown2 = within(codeSystemSelector2[1]).getByRole(
      "combobox",
      { name: "Code System" }
    );
    userEvent.click(codeSystemDropdown2);
    const codeSystemOptions2 = await screen.findAllByRole("option");
    expect(codeSystemOptions2[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptions2[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptions2[0]);

    // select the code
    const codeSelector2 = screen.getAllByTestId("code-selector");
    const codeDropdown2 = within(codeSelector2[1]).getByRole("combobox", {
      name: "Code",
    });
    userEvent.click(codeDropdown2);
    const codeOptions2 = await screen.findAllByRole("option");
    expect(codeOptions2).toHaveLength(2);
    expect(codeOptions2[0]).toHaveTextContent(
      "183452005 - Snomed Emergency hospital admission (procedure)"
    );
    expect(codeOptions2[1]).toHaveTextContent(
      "305686008 - Seen by palliative care physician (finding)"
    );
    userEvent.click(codeOptions2[0]);
    expect(mockHandleChange).toHaveBeenCalledTimes(0);

    //Qualification
    const valueSetDropdown3 = within(valueSetSelectors[2]).getByRole(
      "combobox",
      { name: "Value Set / Direct Reference Code" }
    ) as HTMLInputElement;
    userEvent.click(valueSetDropdown3);
    const valueSetOptions3 = await screen.findAllByRole("option");
    expect(valueSetOptions3).toHaveLength(3);
    userEvent.click(valueSetOptions3[1]);

    // select the code system
    const codeSystemSelector3 = screen.getAllByTestId("code-system-selector");
    const codeSystemDropdown3 = within(codeSystemSelector3[2]).getByRole(
      "combobox",
      { name: "Code System" }
    );
    userEvent.click(codeSystemDropdown3);
    const codeSystemOptions3 = await screen.findAllByRole("option");
    expect(codeSystemOptions3[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptions3[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptions3[0]);

    // select the code
    const codeSelector3 = screen.getAllByTestId("code-selector");
    const codeDropdown3 = within(codeSelector3[2]).getByRole("combobox", {
      name: "Code",
    });
    userEvent.click(codeDropdown3);
    const codeOptions3 = await screen.findAllByRole("option");
    expect(codeOptions3).toHaveLength(2);
    expect(codeOptions3[0]).toHaveTextContent(
      "183452005 - Snomed Emergency hospital admission (procedure)"
    );
    expect(codeOptions3[1]).toHaveTextContent(
      "305686008 - Seen by palliative care physician (finding)"
    );
    userEvent.click(codeOptions3[0]);
    expect(mockHandleChange).toHaveBeenCalledTimes(1);

    expect(
      mockHandleChange.mock.calls[0][0] instanceof Practitioner
    ).toBeTruthy();
  });

  test("Location attributeType", async () => {
    const mockHandleChange = jest.fn();
    render(
      <QdmEntity
        attributeType="Location"
        attributeValue=""
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(0);

    userEvent.paste(
      screen.getByRole("textbox", {
        name: "Naming System",
      }),
      "test naming system"
    );
    userEvent.paste(
      screen.getByRole("textbox", {
        name: "Value",
      }),
      "test value"
    );
    userEvent.paste(screen.getByTestId("string-field-id-input"), "test id");
    expect(mockHandleChange).toHaveBeenCalledTimes(0);

    const valueSetsInput = screen.getByTestId(
      "value-set-selector-input"
    ) as HTMLInputElement;
    expect(valueSetsInput.value).toBe("");
    const valueSetSelector = screen.getByTestId("value-set-selector");
    const valueSetDropdown = within(valueSetSelector).getByRole("combobox", {
      name: "Value Set / Direct Reference Code",
    }) as HTMLInputElement;
    userEvent.click(valueSetDropdown);

    const valueSetOptions = await screen.findAllByRole("option");
    expect(valueSetOptions).toHaveLength(3);
    // by default code system and code dropdown is not displayed unless user choose value set
    expect(
      screen.queryByTestId("code-system-selector")
    ).not.toBeInTheDocument();
    userEvent.click(valueSetOptions[1]);

    // select the code system
    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole(
      "combobox",
      { name: "Code System" }
    );
    userEvent.click(codeSystemDropdown);
    const codeSystemOptions = await screen.findAllByRole("option");
    expect(codeSystemOptions[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptions[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptions[0]);

    // select the code
    const codeSelector = screen.getByTestId("code-selector");
    const codeDropdown = within(codeSelector).getByRole("combobox", {
      name: "Code",
    });
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
    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange.mock.calls[0][0] instanceof Location).toBeTruthy();
  });

  test("CarePartner attributeType", async () => {
    const mockHandleChange = jest.fn();
    render(
      <QdmEntity
        attributeType="CarePartner"
        attributeValue=""
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(0);

    userEvent.paste(
      screen.getByRole("textbox", {
        name: "Naming System",
      }),
      "ValueSet"
    );
    userEvent.paste(
      screen.getByRole("textbox", {
        name: "Value",
      }),
      "test value"
    );
    userEvent.paste(screen.getByTestId("string-field-id-input"), "test id");
    expect(mockHandleChange).toHaveBeenCalledTimes(0);

    const valueSetsInput = screen.getByTestId(
      "value-set-selector-input"
    ) as HTMLInputElement;
    expect(valueSetsInput.value).toBe("");
    const valueSetSelector = screen.getByTestId("value-set-selector");
    const valueSetDropdown = within(valueSetSelector).getByRole("combobox", {
      name: "Value Set / Direct Reference Code",
    }) as HTMLInputElement;
    userEvent.click(valueSetDropdown);

    const valueSetOptions = await screen.findAllByRole("option");
    expect(valueSetOptions).toHaveLength(3);
    // by default code system and code dropdown is not displayed unless user choose value set
    expect(
      screen.queryByTestId("code-system-selector")
    ).not.toBeInTheDocument();
    userEvent.click(valueSetOptions[1]);

    // select the code system
    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole(
      "combobox",
      { name: "Code System" }
    );
    userEvent.click(codeSystemDropdown);
    const codeSystemOptions = await screen.findAllByRole("option");
    expect(codeSystemOptions[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptions[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptions[0]);

    // select the code
    const codeSelector = screen.getByTestId("code-selector");
    const codeDropdown = within(codeSelector).getByRole("combobox", {
      name: "Code",
    });
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

    expect(
      mockHandleChange.mock.calls[0][0] instanceof CarePartner
    ).toBeTruthy();
  });

  test("Organization attributeType", async () => {
    const mockHandleChange = jest.fn();
    render(
      <QdmEntity
        attributeType="Organization"
        attributeValue=""
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(0);

    userEvent.paste(
      screen.getByRole("textbox", {
        name: "Naming System",
      }),
      "ValueSet"
    );
    userEvent.paste(
      screen.getByRole("textbox", {
        name: "Value",
      }),
      "test value"
    );
    userEvent.paste(screen.getByTestId("string-field-id-input"), "test id");
    expect(mockHandleChange).toHaveBeenCalledTimes(0);

    const valueSetsInput = screen.getByTestId(
      "value-set-selector-input"
    ) as HTMLInputElement;
    expect(valueSetsInput.value).toBe("");
    const valueSetSelector = screen.getByTestId("value-set-selector");
    const valueSetDropdown = within(valueSetSelector).getByRole("combobox", {
      name: "Value Set / Direct Reference Code",
    }) as HTMLInputElement;
    userEvent.click(valueSetDropdown);

    const valueSetOptions = await screen.findAllByRole("option");
    expect(valueSetOptions).toHaveLength(3);
    // by default code system and code dropdown is not displayed unless user choose value set
    expect(
      screen.queryByTestId("code-system-selector")
    ).not.toBeInTheDocument();
    userEvent.click(valueSetOptions[1]);

    // select the code system
    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole(
      "combobox",
      { name: "Code System" }
    );
    userEvent.click(codeSystemDropdown);
    const codeSystemOptions = await screen.findAllByRole("option");
    expect(codeSystemOptions[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptions[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptions[0]);

    // select the code
    const codeSelector = screen.getByTestId("code-selector");
    const codeDropdown = within(codeSelector).getByRole("combobox", {
      name: "Code",
    });
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

    expect(
      mockHandleChange.mock.calls[0][0] instanceof Organization
    ).toBeTruthy();
  });

  test("change in attributeType", async () => {
    const mockHandleChange = jest.fn();
    const { rerender } = render(
      <QdmEntity
        attributeType="PatientEntity"
        attributeValue=""
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(0);

    userEvent.paste(
      screen.getByRole("textbox", {
        name: "Naming System",
      }),
      "ValueSet"
    );
    userEvent.paste(
      screen.getByRole("textbox", {
        name: "Value",
      }),
      "test value"
    );
    userEvent.paste(screen.getByTestId("string-field-id-input"), "test id");
    expect(
      mockHandleChange.mock.calls[0][0] instanceof PatientEntity
    ).toBeTruthy();

    rerender(
      <QdmEntity
        attributeType="CarePartner"
        attributeValue=""
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(1);

    const valueSetsInput = screen.getByTestId(
      "value-set-selector-input"
    ) as HTMLInputElement;
    expect(valueSetsInput.value).toBe("");
    const valueSetSelector = screen.getByTestId("value-set-selector");
    const valueSetDropdown = within(valueSetSelector).getByRole("combobox", {
      name: "Value Set / Direct Reference Code",
    }) as HTMLInputElement;
    userEvent.click(valueSetDropdown);

    const valueSetOptions = await screen.findAllByRole("option");
    expect(valueSetOptions).toHaveLength(3);
    // by default code system and code dropdown is not displayed unless user choose value set
    expect(
      screen.queryByTestId("code-system-selector")
    ).not.toBeInTheDocument();
    userEvent.click(valueSetOptions[1]);

    // select the code system
    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole(
      "combobox",
      { name: "Code System" }
    );
    userEvent.click(codeSystemDropdown);
    const codeSystemOptions = await screen.findAllByRole("option");
    expect(codeSystemOptions[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptions[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptions[0]);

    // select the code
    const codeSelector = screen.getByTestId("code-selector");
    const codeDropdown = within(codeSelector).getByRole("combobox", {
      name: "Code",
    });
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
    expect(
      mockHandleChange.mock.calls[1][0] instanceof CarePartner
    ).toBeTruthy();
  });

  test("change in attributeType between location and practitioner", async () => {
    const mockHandleChange = jest.fn();
    const { rerender } = render(
      <QdmEntity
        attributeType="Location"
        attributeValue=""
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(0);

    userEvent.paste(
      screen.getByRole("textbox", {
        name: "Naming System",
      }),
      "ValueSet"
    );
    userEvent.paste(
      screen.getByRole("textbox", {
        name: "Value",
      }),
      "test value"
    );
    userEvent.paste(screen.getByTestId("string-field-id-input"), "test id");
    expect(mockHandleChange).toHaveBeenCalledTimes(0);

    const valueSetsInput = screen.getByTestId(
      "value-set-selector-input"
    ) as HTMLInputElement;
    expect(valueSetsInput.value).toBe("");
    const valueSetSelector = screen.getByTestId("value-set-selector");
    const valueSetDropdown = within(valueSetSelector).getByRole("combobox", {
      name: "Value Set / Direct Reference Code",
    }) as HTMLInputElement;
    userEvent.click(valueSetDropdown);

    const valueSetOptions = await screen.findAllByRole("option");
    expect(valueSetOptions).toHaveLength(3);
    // by default code system and code dropdown is not displayed unless user choose value set
    expect(
      screen.queryByTestId("code-system-selector")
    ).not.toBeInTheDocument();
    userEvent.click(valueSetOptions[1]);

    // select the code system
    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole(
      "combobox",
      { name: "Code System" }
    );
    userEvent.click(codeSystemDropdown);
    const codeSystemOptions = await screen.findAllByRole("option");
    expect(codeSystemOptions[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptions[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptions[0]);

    // select the code
    const codeSelector = screen.getByTestId("code-selector");
    const codeDropdown = within(codeSelector).getByRole("combobox", {
      name: "Code",
    });
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
    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange.mock.calls[0][0] instanceof Location).toBeTruthy();

    rerender(
      <QdmEntity
        attributeType="Practitioner"
        attributeValue=""
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
      />
    );

    const valueSetsInputs = screen.getAllByTestId(
      "value-set-selector-input"
    ) as HTMLInputElement[];
    expect(valueSetsInputs.length).toBe(3);
    const valueSetSelectors = screen.getAllByTestId("value-set-selector");
    expect(valueSetSelectors.length).toBe(3);

    //Specialty
    const valueSetDropdown2 = within(valueSetSelectors[1]).getByRole(
      "combobox",
      { name: "Value Set / Direct Reference Code" }
    ) as HTMLInputElement;
    userEvent.click(valueSetDropdown2);
    const valueSetOptions2 = await screen.findAllByRole("option");
    expect(valueSetOptions2).toHaveLength(3);
    userEvent.click(valueSetOptions2[1]);

    // select the code system
    const codeSystemSelector2 = screen.getAllByTestId("code-system-selector");
    const codeSystemDropdown2 = within(codeSystemSelector2[1]).getByRole(
      "combobox",
      { name: "Code System" }
    );
    userEvent.click(codeSystemDropdown2);
    const codeSystemOptions2 = await screen.findAllByRole("option");
    expect(codeSystemOptions2[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptions2[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptions2[0]);

    // select the code
    const codeSelector2 = screen.getAllByTestId("code-selector");
    const codeDropdown2 = within(codeSelector2[1]).getByRole("combobox", {
      name: "Code",
    });
    userEvent.click(codeDropdown2);
    const codeOptions2 = await screen.findAllByRole("option");
    expect(codeOptions2).toHaveLength(2);
    expect(codeOptions2[0]).toHaveTextContent(
      "183452005 - Snomed Emergency hospital admission (procedure)"
    );
    expect(codeOptions2[1]).toHaveTextContent(
      "305686008 - Seen by palliative care physician (finding)"
    );
    userEvent.click(codeOptions2[0]);
    expect(mockHandleChange).toHaveBeenCalledTimes(1);

    //Qualification
    const valueSetDropdown3 = within(valueSetSelectors[2]).getByRole(
      "combobox",
      { name: "Value Set / Direct Reference Code" }
    ) as HTMLInputElement;
    userEvent.click(valueSetDropdown3);
    const valueSetOptions3 = await screen.findAllByRole("option");
    expect(valueSetOptions3).toHaveLength(3);
    userEvent.click(valueSetOptions3[1]);

    // select the code system
    const codeSystemSelector3 = screen.getAllByTestId("code-system-selector");
    const codeSystemDropdown3 = within(codeSystemSelector3[2]).getByRole(
      "combobox",
      { name: "Code System" }
    );
    userEvent.click(codeSystemDropdown3);
    const codeSystemOptions3 = await screen.findAllByRole("option");
    expect(codeSystemOptions3[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptions3[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptions3[0]);

    // select the code
    const codeSelector3 = screen.getAllByTestId("code-selector");
    const codeDropdown3 = within(codeSelector3[2]).getByRole("combobox", {
      name: "Code",
    });
    userEvent.click(codeDropdown3);
    const codeOptions3 = await screen.findAllByRole("option");
    expect(codeOptions3).toHaveLength(2);
    expect(codeOptions3[0]).toHaveTextContent(
      "183452005 - Snomed Emergency hospital admission (procedure)"
    );
    expect(codeOptions3[1]).toHaveTextContent(
      "305686008 - Seen by palliative care physician (finding)"
    );
    userEvent.click(codeOptions3[0]);

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
  });

  test("setAttributeValue receives updated identifier value on entity", () => {
    const mockHandleChange = jest.fn();
    const patientEntity = new PatientEntity();
    render(
      <QdmEntity
        attributeType="PatientEntity"
        attributeValue={patientEntity}
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(0);

    userEvent.paste(
      screen.getByRole("textbox", {
        name: "Naming System",
      }),
      "ValueSet"
    );
    userEvent.paste(
      screen.getByRole("textbox", {
        name: "Value",
      }),
      "test value"
    );
    userEvent.paste(screen.getByTestId("string-field-id-input"), "test id");

    expect(mockHandleChange).toHaveBeenCalledTimes(1);

    expect(
      mockHandleChange.mock.calls[0][0] instanceof PatientEntity
    ).toBeTruthy();

    expect(mockHandleChange.mock.calls[0][0]?.identifier?.namingSystem).toEqual(
      "ValueSet"
    );
    expect(mockHandleChange.mock.calls[0][0]?.identifier?.value).toEqual(
      "test value"
    );
    expect(mockHandleChange.mock.calls[0][0]?.id).toEqual("test id");
  });
});
