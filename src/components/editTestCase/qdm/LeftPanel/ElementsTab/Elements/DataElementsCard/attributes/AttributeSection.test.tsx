import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import AttributeSection from "./AttributeSection";
import { EncounterOrder, AssessmentPerformed } from "cqm-models";

describe("AttributeSection", () => {
  it("should render two empty dropdowns when null selectedDataElement is provided", () => {
    render(<AttributeSection selectedDataElement={null} />);

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
    render(<AttributeSection selectedDataElement={undefined} />);

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
    const encounterElement: EncounterOrder = new EncounterOrder();
    render(<AttributeSection selectedDataElement={encounterElement} />);

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
    const encounterElement: EncounterOrder = new EncounterOrder();
    render(<AttributeSection selectedDataElement={encounterElement} />);

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
    const plusButton = await screen.findByTestId("AddCircleOutlineIcon")
    expect(plusButton).toBeInTheDocument();
  });

  it("should render different type select options for different selected attributes", async () => {
    const encounterElement: EncounterOrder = new EncounterOrder();
    render(<AttributeSection selectedDataElement={encounterElement} />);

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
  });

  it.only("date selection shows date input", async () => {
    const assessmentElement: AssessmentPerformed = new AssessmentPerformed();
    render(<AttributeSection selectedDataElement={assessmentElement} />);
    

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
    
    const typeSelectBtn = await screen.findByTestId("type-select");
    expect(typeSelectBtn).toBeInTheDocument();
    // const typeSelect = within(typeSelectBtn.parentElement).getByRole("textbox", {
    //   hidden: true,
    // });
    userEvent.click(typeSelectBtn);
    const typeSelect = await screen.findByRole("listbox");
    expect(typeSelect).toBeInTheDocument();
    expect(typeSelect).toHaveValue("");
    const typeOptions = within(typeSelect).getAllByRole("option");
    expect(typeOptions.length).toEqual(9);
    console.log(typeSelect)
    userEvent.click(within(typeSelect).getByText(/date/i));
    

    
  });
});
