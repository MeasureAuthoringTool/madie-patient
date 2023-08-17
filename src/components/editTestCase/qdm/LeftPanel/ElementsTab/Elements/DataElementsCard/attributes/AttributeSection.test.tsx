import * as React from "react";

import { render, screen, within, fireEvent } from "@testing-library/react";

import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import AttributeSection from "./AttributeSection";
import { EncounterOrder, AssessmentPerformed } from "cqm-models";
import { MemoryRouter } from "react-router-dom";
import { QdmExecutionContextProvider } from "../../../../../../../routes/qdm/QdmExecutionContext";
import { MeasureScoring } from "@madie/madie-models";

jest.mock("dayjs", () => ({
  extend: jest.fn(),
  utc: jest.fn((...args) => {
    const dayjs = jest.requireActual("dayjs");
    dayjs.extend(jest.requireActual("dayjs/plugin/utc"));

    return dayjs.utc(
      args.filter((arg) => arg).length > 0 ? args : "01/01/2023"
    );
  }),
  startOf: jest.fn().mockReturnThis(),
}));
const onAddClicked = jest.fn();
const mockCqmMeasure = {
  id: "id-1",
  title: "Mock Measure",
  measure_scoring: MeasureScoring.COHORT,
  value_sets: [],
};

describe("AttributeSection", () => {
  let encounterElement;
  let assessmentElement;
  beforeEach(() => {
    encounterElement = new EncounterOrder();
    assessmentElement = new AssessmentPerformed();
  });

  const renderAttributeSection = (dataElement, attributeChipList, onAddCb) => {
    return render(
      <MemoryRouter>
        <QdmExecutionContextProvider
          value={{
            measureState: [null, jest.fn],
            cqmMeasureState: [mockCqmMeasure, jest.fn],
            executionContextReady: true,
            executing: false,
            setExecuting: jest.fn(),
          }}
        >
          <AttributeSection
            selectedDataElement={dataElement}
            attributeChipList={attributeChipList}
            onAddClicked={onAddCb}
          />
        </QdmExecutionContextProvider>
      </MemoryRouter>
    );
  };

  it("should render two empty dropdowns when null selectedDataElement is provided", () => {
    renderAttributeSection(null, [], onAddClicked);
    const attributeSelectBtn = screen.getByRole("button", {
      name: "Attribute Select Attribute",
    });
    expect(attributeSelectBtn).toBeInTheDocument();
    const attributeInput = within(attributeSelectBtn.parentElement).getByRole(
      "textbox",
      { hidden: true }
    );
    expect(attributeInput).toBeInTheDocument();
    expect(attributeInput).toHaveValue("");

    const typeSelectBtn = screen.getByRole("button", {
      name: "Type Select Type",
    });
    expect(typeSelectBtn).toBeInTheDocument();
    const typeInput = within(typeSelectBtn.parentElement).getByRole("textbox", {
      hidden: true,
    });
    expect(typeInput).toHaveValue("");
  });

  it("should render two empty dropdowns when undefined selectedDataElement is provided", () => {
    renderAttributeSection(undefined, [], onAddClicked);
    const attributeSelectBtn = screen.getByRole("button", {
      name: "Attribute Select Attribute",
    });
    expect(attributeSelectBtn).toBeInTheDocument();
    const attributeInput = within(attributeSelectBtn.parentElement).getByRole(
      "textbox",
      { hidden: true }
    );
    expect(attributeInput).toBeInTheDocument();
    expect(attributeInput).toHaveValue("");

    const typeSelectBtn = screen.getByRole("button", {
      name: "Type Select Type",
    });
    expect(typeSelectBtn).toBeInTheDocument();
    const typeInput = within(typeSelectBtn.parentElement).getByRole("textbox", {
      hidden: true,
    });
    expect(typeInput).toHaveValue("");
  });

  it("should render attribute select options when valid selectedDataElement is provided", async () => {
    renderAttributeSection(encounterElement, [], onAddClicked);
    const attributeSelectBtn = screen.getByRole("button", {
      name: "Attribute Select Attribute",
    });
    expect(attributeSelectBtn).toBeInTheDocument();
    const attributeInput = within(attributeSelectBtn.parentElement).getByRole(
      "textbox",
      { hidden: true }
    );
    expect(attributeInput).toBeInTheDocument();
    expect(attributeInput).toHaveValue("");
    userEvent.click(attributeSelectBtn);

    const attributeSelect = await screen.findByRole("listbox");
    const attributeOptions = within(attributeSelect).getAllByRole("option");
    expect(attributeOptions).toHaveLength(4);
  });

  it("should auto select type when attribute only has single type option", async () => {
    renderAttributeSection(encounterElement, [], onAddClicked);
    const attributeSelectBtn = screen.getByRole("button", {
      name: "Attribute Select Attribute",
    });
    expect(attributeSelectBtn).toBeInTheDocument();

    userEvent.click(attributeSelectBtn);

    const attributeSelect = await screen.findByRole("listbox");
    const attributeOptions = within(attributeSelect).getAllByRole("option");
    expect(attributeOptions).toHaveLength(4);

    userEvent.click(within(attributeSelect).getByText(/reason/i));
    const attributeInput = within(attributeSelectBtn.parentElement).getByRole(
      "textbox",
      { hidden: true }
    );
    expect(attributeInput).toBeInTheDocument();
    expect(attributeInput).toHaveValue("Reason");

    // auto selects when there is only one option, which impacts the name
    const typeSelectBtn = await screen.findByRole("button", {
      name: "Type Code",
    });
    const typeInput = within(typeSelectBtn.parentElement).getByRole("textbox", {
      hidden: true,
    });
    expect(typeInput).toBeInTheDocument();
    expect(typeInput).toHaveValue("Code");
    const plusButton = await screen.findByTestId("AddCircleOutlineIcon");
    expect(plusButton).toBeInTheDocument();
  });

  it("should render different type select options for different selected attributes", async () => {
    renderAttributeSection(encounterElement, [], onAddClicked);
    const attributeSelectBtn = screen.getByRole("button", {
      name: "Attribute Select Attribute",
    });
    expect(attributeSelectBtn).toBeInTheDocument();

    userEvent.click(attributeSelectBtn);

    const attributeSelect = await screen.findByRole("listbox");
    const attributeOptions = within(attributeSelect).getAllByRole("option");
    expect(attributeOptions).toHaveLength(4);

    userEvent.click(within(attributeSelect).getByText(/reason/i));
    const attributeInput = within(attributeSelectBtn.parentElement).getByRole(
      "textbox",
      { hidden: true }
    );
    expect(attributeInput).toBeInTheDocument();
    expect(attributeInput).toHaveValue("Reason");

    // auto selects when there is only one option, which impacts the name
    const typeSelectBtn = await screen.findByRole("button", {
      name: "Type Code",
    });
    const typeInput = within(typeSelectBtn.parentElement).getByRole("textbox", {
      hidden: true,
    });
    expect(typeInput).toBeInTheDocument();
    expect(typeInput).toHaveValue("Code");

    // pick a different attribute
    userEvent.click(attributeSelectBtn);
    const attributeSelect2 = await screen.findByRole("listbox");
    userEvent.click(within(attributeSelect2).getByText(/requester/i));

    userEvent.click(typeSelectBtn);
    const typeSelect = await screen.findByRole("listbox");
    const typeOptions = within(typeSelect).getAllByRole("option");
    expect(typeOptions.length).toEqual(6);
    userEvent.click(within(typeSelect).getByText("Practitioner"));
    const identifierNamingSystemField = (await screen.getByTestId(
      "identifier-input-field-Naming System"
    )) as HTMLInputElement;
    expect(identifierNamingSystemField).toBeInTheDocument();
    fireEvent.change(identifierNamingSystemField, { target: { value: "10" } });
    expect(identifierNamingSystemField.value).toBe("10");

    const identifierValueField = (await screen.getByTestId(
      "identifier-value-input-field-Value"
    )) as HTMLInputElement;
    expect(identifierValueField).toBeInTheDocument();
    fireEvent.change(identifierValueField, { target: { value: "90" } });
    expect(identifierValueField.value).toBe("90");
  });

  it("date selection shows date input", async () => {
    renderAttributeSection(assessmentElement, [], onAddClicked);
    const attributeSelectBtn = screen.getByRole("button", {
      name: "Attribute Select Attribute",
    });
    expect(attributeSelectBtn).toBeInTheDocument();

    userEvent.click(attributeSelectBtn);

    const attributeSelect = await screen.findByRole("listbox");
    const attributeOptions = within(attributeSelect).getAllByRole("option");
    expect(attributeOptions).toHaveLength(7);

    userEvent.click(within(attributeSelect).getByText(/result/i));
    const attributeInput = within(attributeSelectBtn.parentElement).getByRole(
      "textbox",
      { hidden: true }
    );
    expect(attributeInput).toBeInTheDocument();
    expect(attributeInput).toHaveValue("Result");
    const typeSelectBtn = await screen.findByRole("button", {
      name: /type/i,
    });
    expect(typeSelectBtn).toBeInTheDocument();
    userEvent.click(typeSelectBtn);
    const typeSelect = await screen.findByRole("listbox");
    expect(typeSelect).toBeInTheDocument();
    const typeOptions = within(typeSelect).getAllByRole("option");
    expect(typeOptions.length).toEqual(9);
    userEvent.click(within(typeSelect).getByText("Date"));
    const dateInput = (await screen.findByPlaceholderText(
      "MM/DD/YYYY"
    )) as HTMLInputElement;
    const dateInput2 = await screen.findByTestId("CalendarIcon");
    expect(dateInput).toBeInTheDocument();
    expect(dateInput2).toBeInTheDocument();

    fireEvent.change(dateInput, { target: { value: "01/01/2023" } });
    expect(dateInput.value).toBe("01/01/2023");

    const addButton = screen.getByTestId("AddCircleOutlineIcon");
    expect(addButton).toBeInTheDocument();
    userEvent.click(addButton);
  });

  it("shows RatioInput on selecting the Ratio type", async () => {
    renderAttributeSection(assessmentElement, [], onAddClicked);
    const attributeSelectBtn = screen.getByRole("button", {
      name: "Attribute Select Attribute",
    });
    expect(attributeSelectBtn).toBeInTheDocument();

    userEvent.click(attributeSelectBtn);

    const attributeSelect = await screen.findByRole("listbox");
    const attributeOptions = within(attributeSelect).getAllByRole("option");
    expect(attributeOptions).toHaveLength(7);

    userEvent.click(within(attributeSelect).getByText(/result/i));
    const attributeInput = within(attributeSelectBtn.parentElement).getByRole(
      "textbox",
      { hidden: true }
    );
    expect(attributeInput).toBeInTheDocument();
    expect(attributeInput).toHaveValue("Result");
    const typeSelectBtn = await screen.findByRole("button", {
      name: /type/i,
    });
    expect(typeSelectBtn).toBeInTheDocument();
    userEvent.click(typeSelectBtn);
    const typeSelect = await screen.findByRole("listbox");
    expect(typeSelect).toBeInTheDocument();
    const typeOptions = within(typeSelect).getAllByRole("option");
    expect(typeOptions.length).toEqual(9);
    fireEvent.click(within(typeSelect).getByText("Ratio"));
  });

  it("DateTime selection shows date input", async () => {
    renderAttributeSection(assessmentElement, [], onAddClicked);
    const dateTimeVal = { value: "01/01/2023 12:00 AM" };
    const attributeSelectBtn = screen.getByRole("button", {
      name: "Attribute Select Attribute",
    });
    expect(attributeSelectBtn).toBeInTheDocument();

    userEvent.click(attributeSelectBtn);

    const attributeSelect = await screen.findByRole("listbox");
    const attributeOptions = within(attributeSelect).getAllByRole("option");
    expect(attributeOptions).toHaveLength(7);

    userEvent.click(within(attributeSelect).getByText(/result/i));
    const attributeInput = within(attributeSelectBtn.parentElement).getByRole(
      "textbox",
      { hidden: true }
    );
    expect(attributeInput).toBeInTheDocument();
    expect(attributeInput).toHaveValue("Result");
    const typeSelectBtn = await screen.findByRole("button", {
      name: /type/i,
    });
    expect(typeSelectBtn).toBeInTheDocument();
    userEvent.click(typeSelectBtn);
    const typeSelect = await screen.findByRole("listbox");
    expect(typeSelect).toBeInTheDocument();
    const typeOptions = within(typeSelect).getAllByRole("option");
    expect(typeOptions.length).toEqual(9);
    userEvent.click(within(typeSelect).getByText("DateTime"));
    const dateTimeInput = (await screen.findByPlaceholderText(
      "MM/DD/YYYY hh:mm aa"
    )) as HTMLInputElement;
    const dateTimeInput2 = await screen.findByTestId("CalendarIcon");
    expect(dateTimeInput).toBeInTheDocument();
    expect(dateTimeInput2).toBeInTheDocument();
    fireEvent.change(dateTimeInput, {
      target: dateTimeVal,
    });
    expect(dateTimeInput.value).toBe("01/01/2023 12:00 AM");

    const addButton = screen.getByTestId("AddCircleOutlineIcon");
    expect(addButton).toBeInTheDocument();
    userEvent.click(addButton);
  });

  it("Clicking the plus button calls works", async () => {
    renderAttributeSection(assessmentElement, [], onAddClicked);
    const attributeSelectBtn = screen.getByRole("button", {
      name: "Attribute Select Attribute",
    });
    expect(attributeSelectBtn).toBeInTheDocument();

    userEvent.click(attributeSelectBtn);

    const attributeSelect = await screen.findByRole("listbox");
    userEvent.click(within(attributeSelect).getByText(/result/i));
    const attributeInput = within(attributeSelectBtn.parentElement).getByRole(
      "textbox",
      { hidden: true }
    );
    expect(attributeInput).toBeInTheDocument();
    expect(attributeInput).toHaveValue("Result");
    const typeSelectBtn = await screen.findByRole("button", {
      name: /type/i,
    });
    expect(typeSelectBtn).toBeInTheDocument();
    userEvent.click(typeSelectBtn);
    const typeSelect = await screen.findByRole("listbox");
    expect(typeSelect).toBeInTheDocument();
    userEvent.click(within(typeSelect).getByText("Date"));
    const dateInput = await screen.findByTestId("CalendarIcon");
    expect(dateInput).toBeInTheDocument();
    userEvent.click(dateInput);
    userEvent.type(dateInput, "12121912");
    const plusButton = await screen.findByTestId("AddCircleOutlineIcon");
    expect(plusButton).toBeInTheDocument();
    userEvent.click(plusButton);
    expect(onAddClicked).toHaveBeenCalled();
  });

  it("shows integer input on selecting the integer type", async () => {
    renderAttributeSection(assessmentElement, [], onAddClicked);
    const attributeSelectBtn = screen.getByRole("button", {
      name: "Attribute Select Attribute",
    });
    expect(attributeSelectBtn).toBeInTheDocument();

    userEvent.click(attributeSelectBtn);

    const attributeSelect = await screen.findByRole("listbox");
    const attributeOptions = within(attributeSelect).getAllByRole("option");
    expect(attributeOptions).toHaveLength(7);

    userEvent.click(within(attributeSelect).getByText(/result/i));
    const attributeInput = within(attributeSelectBtn.parentElement).getByRole(
      "textbox",
      { hidden: true }
    );
    expect(attributeInput).toBeInTheDocument();
    expect(attributeInput).toHaveValue("Result");
    const typeSelectBtn = await screen.findByRole("button", {
      name: /type/i,
    });
    expect(typeSelectBtn).toBeInTheDocument();
    userEvent.click(typeSelectBtn);
    const typeSelect = await screen.findByRole("listbox");
    expect(typeSelect).toBeInTheDocument();
    const typeOptions = within(typeSelect).getAllByRole("option");
    expect(typeOptions.length).toEqual(9);
    userEvent.click(within(typeSelect).getByText("Integer"));
    const integerField = (await screen.getByTestId(
      "integer-input-field-Integer"
    )) as HTMLInputElement;
    expect(integerField).toBeInTheDocument();

    expect(integerField).toBeInTheDocument();
    fireEvent.change(integerField, { target: { value: "10" } });
    expect(integerField.value).toBe("10");
  });

  it("shows DecimalInput on selecting the Decimal type", async () => {
    renderAttributeSection(assessmentElement, [], onAddClicked);
    const attributeSelectBtn = screen.getByRole("button", {
      name: "Attribute Select Attribute",
    });
    expect(attributeSelectBtn).toBeInTheDocument();

    userEvent.click(attributeSelectBtn);

    const attributeSelect = await screen.findByRole("listbox");
    const attributeOptions = within(attributeSelect).getAllByRole("option");
    expect(attributeOptions).toHaveLength(7);

    userEvent.click(within(attributeSelect).getByText(/result/i));
    const attributeInput = within(attributeSelectBtn.parentElement).getByRole(
      "textbox",
      { hidden: true }
    );
    expect(attributeInput).toBeInTheDocument();
    expect(attributeInput).toHaveValue("Result");
    const typeSelectBtn = await screen.findByRole("button", {
      name: /type/i,
    });
    expect(typeSelectBtn).toBeInTheDocument();
    userEvent.click(typeSelectBtn);
    const typeSelect = await screen.findByRole("listbox");
    expect(typeSelect).toBeInTheDocument();
    const typeOptions = within(typeSelect).getAllByRole("option");
    expect(typeOptions.length).toEqual(9);
    fireEvent.click(within(typeSelect).getByText("Decimal"));
  });

  it("shows DateTime on selecting the DateTime type", async () => {
    const assessmentElement = new AssessmentPerformed();
    const { container } = render(
      <AttributeSection selectedDataElement={assessmentElement} />
    );

    const attributeSelectBtn = screen.getByRole("button", {
      name: "Attribute Select Attribute",
    });
    expect(attributeSelectBtn).toBeInTheDocument();

    userEvent.click(attributeSelectBtn);

    const attributeSelect = await screen.findByRole("listbox");
    const attributeOptions = within(attributeSelect).getAllByRole("option");
    expect(attributeOptions).toHaveLength(7);

    userEvent.click(within(attributeSelect).getByText(/result/i));
     const attributeInput = within(attributeSelectBtn.parentElement).getByRole(
      "textbox",
      { hidden: true }
    );
    expect(attributeInput).toBeInTheDocument();
         expect(attributeInput).toHaveValue("Result");
    const typeSelectBtn = await screen.findByRole("button", {
      name: /type/i,
    });
    expect(typeSelectBtn).toBeInTheDocument();
    userEvent.click(typeSelectBtn);
    const typeSelect = await screen.findByRole("listbox");
    expect(typeSelect).toBeInTheDocument();
    const typeOptions = within(typeSelect).getAllByRole("option");
    expect(typeOptions.length).toEqual(9);
    fireEvent.click(within(typeSelect).getByText("DateTime"));
  });

  it("shows Quantity on selecting the Quantity type", async () => {
    const assessmentElement = new AssessmentPerformed();
    const { container } = render(
      <AttributeSection
        selectedDataElement={assessmentElement}
        onAddClicked={onAddClicked}
      />
    );

    const attributeSelectBtn = screen.getByRole("button", {
      name: "Attribute Select Attribute",
    });
    expect(attributeSelectBtn).toBeInTheDocument();

    userEvent.click(attributeSelectBtn);

    const attributeSelect = await screen.findByRole("listbox");
    const attributeOptions = within(attributeSelect).getAllByRole("option");
    expect(attributeOptions).toHaveLength(7);

    userEvent.click(within(attributeSelect).getByText(/result/i));
    const attributeInput = within(attributeSelectBtn.parentElement).getByRole(
      "textbox",
      { hidden: true }
    );
    expect(attributeInput).toBeInTheDocument();
    expect(attributeInput).toHaveValue("Result");
    const typeSelectBtn = await screen.findByRole("button", {
      name: /type/i,
    });
    expect(typeSelectBtn).toBeInTheDocument();
    userEvent.click(typeSelectBtn);
    const typeSelect = await screen.findByRole("listbox");
    expect(typeSelect).toBeInTheDocument();
    const typeOptions = within(typeSelect).getAllByRole("option");
    expect(typeOptions.length).toEqual(9);
    fireEvent.click(within(typeSelect).getByText("Quantity"));
    const addButton = screen.getByTestId("AddCircleOutlineIcon");
    expect(addButton).toBeInTheDocument();
    userEvent.click(addButton);
        });
  it("renders code component on selecting the code type attribute", async () => {
    renderAttributeSection(assessmentElement, [], onAddClicked);
    const attributeSelectBtn = screen.getByRole("button", {
      name: "Attribute Select Attribute",
    });
    userEvent.click(attributeSelectBtn);
    const attributeSelect = await screen.findByRole("listbox");
    userEvent.click(within(attributeSelect).getByText(/reason/i));
    const attributeInput = within(attributeSelectBtn.parentElement).getByRole(
      "textbox",
      { hidden: true }
    );
    expect(attributeInput).toBeInTheDocument();
    expect(attributeInput).toHaveValue("Reason");
    userEvent.click(
      await screen.findByRole("button", {
        name: /type/i,
      })
    );
    const typeSelect = await screen.findByRole("listbox");
    expect(typeSelect).toBeInTheDocument();
    fireEvent.click(within(typeSelect).getByText("Code"));

    const valueSetSelector = screen.getByTestId("value-set-selector");
    const valueSetDropdown = within(valueSetSelector).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(valueSetDropdown);
    const valueSetOptions = await screen.findAllByRole("option");
    expect(valueSetOptions).toHaveLength(1);
    expect(valueSetOptions[0]).toHaveTextContent("Custom Code");
  });
});
